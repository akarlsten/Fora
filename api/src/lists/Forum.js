import { Text, Slug, Relationship, Checkbox, Select, CloudinaryImage } from '@keystonejs/fields'
import { byTracking, atTracking } from '@keystonejs/list-plugins'
import { CloudinaryAdapter } from '@keystonejs/file-adapters'

import { userIsAdmin, userIsLoggedIn, userIsAdminOrOwner, userIsAdminOrForumNotBanned } from '../utils/access'
import { userIsAdminModeratorOrOwner, userIsGlobalBanned } from '../hooks/forumHooks'

import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'icons'
})

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
          if (resolvedData.name.length > 20 || resolvedData.name.length < 1) {
            addFieldValidationError('Forum name must be between 1 and 20 characters.')
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
    description: {
      type: Text,
      hooks: {
        resolveInput: async ({ resolvedData }) => {
          if (resolvedData.description) {
            return resolvedData.description.trim()
          }
        },
        validateInput: async ({ resolvedData, addFieldValidationError, existingItem, context, actions }) => {
          // MAYBE: Change hardcoded values to configurable from .json file
          if (resolvedData.description.length > 140 || resolvedData.description.length < 1) {
            addFieldValidationError('Description cannot be empty or longer than 140 characters.')
          }
          if (existingItem) {
            userIsAdminModeratorOrOwner({ existingItem, context, actions })
          }
        }
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
    colorScheme: {
      type: Select,
      options: 'red, orange, green, teal, blue, indigo, purple, pink, black',
      hooks: {
        validateInput: userIsAdminModeratorOrOwner
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
    subscribers: { type: Relationship, ref: 'User.subscriptions', many: true, update: false },
    icon: {
      type: CloudinaryImage,
      adapter: cloudinaryAdapter,
      hooks: {
        validateInput: async ({ resolvedData, addFieldValidationError, existingItem, context, actions }) => {
          if (existingItem) {
            userIsAdminModeratorOrOwner({ existingItem, context, actions })
          }
        }
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
  plugins: [byTracking(), atTracking()],
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
