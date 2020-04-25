import { Text, Slug, Relationship, Checkbox } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdmin, userIsLoggedIn, userIsAdminOrOwner, userIsAdminOrForumNotBanned } from '../utils/access'
import { userIsAdminModeratorOrOwner } from '../hooks/forumHooks'

import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'

export default {
  fields: {
    name: {
      type: Text,
      hooks: {
        resolveInput: async ({ resolvedData, existingItem }) => {
          // trims any non-alphanumeric
          return (resolvedData.name && resolvedData.name.replace(/\W/g, '')) || existingItem.name
        },
        validateInput: async ({ resolvedData, addFieldValidationError }) => {
          if (resolvedData.name.length > 20) {
            addFieldValidationError('Max length of forum name is 20 characters.')
          }
        }
      },
      isRequired: true,
      isUnique: true,
      access: {
        update: userIsAdmin
      }
    },
    url: {
      type: Slug,
      generate: ({ resolvedData, existingItem }) => {
        return (resolvedData.name && resolvedData.name.replace(/\W/g, '').toLowerCase()) || existingItem.url
      },
      isUnique: true,
      access: {
        create: false,
        read: true,
        update: false
      }
    },
    threads: { type: Relationship, ref: 'Thread', many: true },
    owner: {
      type: AuthedRelationship,
      ref: 'User',
      access: {
        update: userIsAdmin
      }
    },
    moderators: {
      type: Relationship,
      ref: 'User',
      many: true,
      access: {
        update: userIsAdminOrOwner
      }
    },
    bannedUsers: {
      type: Relationship,
      ref: 'User',
      many: true,
      hooks: {
        validateInput: userIsAdminModeratorOrOwner
      }
    },
    isBanned: {
      type: Checkbox,
      access: {
        update: userIsAdmin
      },
      defaultValue: false
    },
    isPrivate: {
      type: Checkbox,
      hooks: {
        validateInput: userIsAdminModeratorOrOwner
      }
    }
  },
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    read: userIsAdminOrForumNotBanned,
    update: userIsLoggedIn,
    delete: userIsAdmin
  }
}
