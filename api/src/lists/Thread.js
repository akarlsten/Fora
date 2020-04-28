import { Text, Checkbox, Relationship, Select } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdminOrOwner, userIsLoggedIn, userIsAdmin } from '../utils/access'
import { userIsForumAdminModeratorOrOwner, userIsBanned, forumIsBanned } from '../hooks/threadHooks'

export default {
  fields: {
    title: {
      type: Text,
      isRequired: true,
      hooks: {
        validateInput: async ({ existingItem, context, actions, resolvedData, addFieldValidationError }) => {
          if (resolvedData.title.length > 75 || resolvedData.title.length < 4) {
            addFieldValidationError('Thread title needs to be between 4 and 75 characters.')
          }

          // only allow mods/admins/forum owners to edit thread titles
          if (existingItem) {
            await userIsForumAdminModeratorOrOwner({ existingItem, context, actions })
          }
        }
      }
    },
    posts: { type: Relationship, ref: 'Post.thread', many: true, isRequired: true, access: { update: false } },
    forum: { type: Relationship, ref: 'Forum.threads', isRequired: true, access: { update: userIsAdmin } },
    isStickied: {
      type: Checkbox,
      hooks: {
        validateInput: userIsForumAdminModeratorOrOwner
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
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    update: userIsLoggedIn,
    delete: userIsAdmin
  },
  hooks: {
    validateInput: async ({ existingItem, context, actions, resolvedData }) => {
      await Promise.all([userIsBanned({ resolvedData, existingItem, context, actions }), forumIsBanned({ resolvedData, existingItem, context, actions })])
    }
  }
}
