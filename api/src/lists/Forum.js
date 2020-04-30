import { Text, Slug, Relationship, Checkbox } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdmin, userIsLoggedIn, userIsAdminOrOwner, userIsAdminOrForumNotBanned } from '../utils/access'
import { userIsAdminModeratorOrOwner, userIsGlobalBanned } from '../hooks/forumHooks'

import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'

export default {
  fields: {
    name: {
      type: Text,
      hooks: {
        resolveInput: async ({ resolvedData, existingItem }) => {
          // trims any non-alphanumeric
          return (resolvedData.name && resolvedData.name.replace(/\W/g, '')) // || existingItem.name // perhaps not needed
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
    threads: { type: Relationship, ref: 'Thread.forum', many: true },
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
        // note to maintainer: Keystone doesnt yet allow async access control checks on the field level
        // they do however allow them on field hooks, hence we are cheating by checking access control
        // in a validation hook
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
    // this field is currently unusable, as there is no way to create async access control checks except with hooks
    // we cant check if a user is subscriber before giving read access
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
  },
  hooks: {
    validateInput: userIsGlobalBanned
  }
}
