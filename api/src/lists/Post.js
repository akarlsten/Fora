import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'
import { Text, Checkbox, Virtual, Relationship } from '@keystonejs/fields'
import { atTracking, byTracking } from '@keystonejs/list-plugins'

import { userIsLoggedIn, userIsAdmin, userIsAdminOrOwner } from '../utils/access'
import {
  userIsForumAdminModeratorOrOwner,
  userIsBanned,
  threadOrForumIsClosed,
  userOwnsPost
} from '../hooks/postHooks'

export default {
  fields: {
    owner: {
      type: AuthedRelationship,
      ref: 'User.posts',
      access: {
        update: false
      },
      isRequired: true
    },
    thread: { type: Relationship, ref: 'Thread.posts', isRequired: true, access: { update: false } },
    content: {
      type: Text,
      isRequired: true,
      hooks: {
        resolveInput: async ({ resolvedData }) => {
          if (resolvedData.content) {
            return resolvedData.content.trim()
          }
        },
        validateInput: async ({ resolvedData, addFieldValidationError }) => {
          // MAYBE: Change hardcoded values to configurable from .json file
          if (resolvedData.content.length > 20000 || resolvedData.content.length < 1) {
            addFieldValidationError('Content cannot be empty or longer than 20000 characters.')
          }
        }
      },
      access: {
        read: ({ authentication, existingItem }) => !existingItem.isDeleted || userIsAdmin({ authentication }),
        update: ({ existingItem }) => !existingItem.isDeleted // an admin would have to undelete first
      }
    },
    isEdited: { type: Virtual, graphQLReturnType: 'Boolean', resolver: post => (post.updatedAt > post.createdAt) },
    isDeleted: {
      type: Checkbox,
      // defaultValue: () => false,
      hooks: {
        validateInput: userIsForumAdminModeratorOrOwner
      }
    }
  },
  access: {
    create: userIsLoggedIn,
    read: true,
    update: userIsLoggedIn, // access check is done later
    delete: false // never actually delete from db
  },
  hooks: {
    validateInput: async ({ existingItem, context, actions, resolvedData }) => {
      // maybe a bit clever, but since these functions all potentially throw errors and this determines access
      // we can use try/catch to conditionally check if a user is the post author/not banned/thread open if -
      // theyre not an admin/mod (who is allowed to do anything really)
      try {
        await userIsForumAdminModeratorOrOwner({ existingItem, context, actions })
      } catch (e) {
        await Promise.all([
          userOwnsPost({ existingItem, context }),
          userIsBanned({ resolvedData, existingItem, context, actions }),
          threadOrForumIsClosed({ resolvedData, existingItem, context, actions })
        ])
      }
    }
  },
  plugins: [atTracking(), byTracking()]
}
