import { Text, Checkbox, Relationship, Select, Slug } from '@keystonejs/fields'
import { byTracking, atTracking } from '@keystonejs/list-plugins'

import { userIsLoggedIn, userIsAdmin } from '../utils/access'
import {
  userIsForumAdminModeratorOrOwner,
  userIsBanned,
  forumIsBanned,
  threadHasNoPosts,
  setPostsDeleted,
  setLastPost
} from '../hooks/threadHooks'

export default {
  fields: {
    title: {
      type: Text,
      isRequired: true,
      hooks: {
        resolveInput: async ({ resolvedData }) => {
          if (resolvedData.title) {
            return resolvedData.title.trim()
          }
        },
        validateInput: async ({ existingItem, context, actions, resolvedData, addFieldValidationError }) => {
          if (resolvedData.title.length > 75 || resolvedData.title.length < 4) {
            addFieldValidationError('Thread title needs to be between 4 and 75 characters.')
          }

          // only allow mods/admins/forum owners to edit thread titles
          if (existingItem) {
            await userIsForumAdminModeratorOrOwner({ existingItem, context, actions })
          }
        }
      },
      access: {
        read: ({ authentication, existingItem }) => !existingItem.isDeleted || userIsAdmin({ authentication }),
        update: ({ existingItem }) => !existingItem.isDeleted // an admin would have to undelete first
      }
    },
    url: {
      type: Slug,
      isUnique: true,
      access: {
        create: false,
        read: true,
        update: false
      }
    },
    posts: {
      type: Relationship,
      ref: 'Post.thread',
      many: true,
      isRequired: true,
      access: {
        read: ({ authentication, existingItem }) => !existingItem.isDeleted || userIsAdmin({ authentication }),
        update: false
      }
    },
    lastPost: {
      type: Text,
      access: {
        update: userIsAdmin
      }
    },
    lastPoster: {
      type: Relationship,
      ref: 'User',
      access: {
        update: userIsAdmin
      }
    },
    forum: { type: Relationship, ref: 'Forum.threads', isRequired: true, access: { update: userIsAdmin } },
    isStickied: {
      type: Checkbox,
      defaultValue: () => false,
      hooks: {
        validateInput: async ({ operation, resolvedData, existingItem, context, actions }) => {
          if (resolvedData.isStickied === true || operation !== 'create') {
            await userIsForumAdminModeratorOrOwner({ existingItem, context, actions })
          }
        }
      }
    },
    isDeleted: {
      type: Checkbox,
      hooks: {
        validateInput: userIsForumAdminModeratorOrOwner,
        beforeChange: setPostsDeleted
      }
    },
    state: {
      type: Select,
      options: ['opened', 'closed'],
      defaultValue: 'opened',
      hooks: {
        validateInput: async ({ existingItem, context, actions }) => {
          if (existingItem) {
            await userIsForumAdminModeratorOrOwner({ existingItem, context, actions })
          }
        }
      }
    }
  },
  plugins: [byTracking(), atTracking()],
  access: {
    create: userIsLoggedIn,
    update: userIsLoggedIn,
    delete: false
  },
  hooks: {
    validateInput: async ({ existingItem, context, actions, resolvedData }) => {
      // these functions will throw errors to prevent invalid requests
      await Promise.all([
        userIsBanned({ resolvedData, existingItem, context, actions }),
        forumIsBanned({ resolvedData, existingItem, context, actions }),
        threadHasNoPosts({ resolvedData, existingItem, context, actions })
      ])
    },
    resolveInput: setLastPost
  }
}
