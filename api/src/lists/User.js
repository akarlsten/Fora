import { Text, Checkbox, Select, Password, Relationship, CloudinaryImage } from '@keystonejs/fields'
import { DateTimeUtc } from '@keystonejs/fields-datetime-utc'
import { byTracking, atTracking } from '@keystonejs/list-plugins'
// import { CloudinaryAdapter } from '@keystonejs/file-adapters'

import { userCanAccessUsers, userIsAdmin, userIsSelfOrAdmin } from '../utils/access'

// const cloudinaryAdapter = new CloudinaryAdapter({
//   cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//   apiKey: process.env.CLOUDINARY_KEY,
//   apiSecret: process.env.CLOUDINARY_SECRET,
//   folder: 'my-keystone-app'
// })

export default {
  fields: {
    name: {
      type: Text,
      isUnique: true,
      isRequired: true,
      hooks: {
        resolveInput: async ({ resolvedData, existingItem }) => {
          // trims any non-alphanumeric
          return (resolvedData.name && resolvedData.name.replace(/\W/g, '').toLowerCase())
        },
        validateInput: async ({ resolvedData, addFieldValidationError }) => {
          if (resolvedData.name.length > 20 || resolvedData.name.length < 1) {
            addFieldValidationError('Username must be between 1 and 20 characters.')
          }
        }
      },
      access: {
        update: userIsAdmin
      }
    },
    email: { type: Text, isUnique: true, isRequired: true, access: { read: userIsSelfOrAdmin } },
    password: {
      type: Password,
      useCompiledBcrypt: true,
      rejectCommon: true,
      isRequired: true,
      access: { read: false }
    },
    // avatar: {type: CloudinaryImage, adapter: cloudinaryAdapter},
    isAdmin: {
      type: Checkbox,
      access: {
        update: userIsAdmin
      }
    },
    threads: { type: Relationship, ref: 'Thread', many: true },
    posts: { type: Relationship, ref: 'Post.owner', many: true },
    resetToken: { type: Text, unique: true },
    resetTokenExpiry: { type: DateTimeUtc, unique: true },
    state: {
      type: Select,
      options: ['active', 'deactivated'],
      defaultValue: 'active'
    },
    isGlobalBanned: {
      type: Checkbox,
      access: {
        create: userIsAdmin,
        update: userIsAdmin
      }
    }
  },
  access: {
    create: true,
    read: true,
    update: userCanAccessUsers,
    delete: userIsAdmin,
    auth: true
  },
  plugins: [atTracking(), byTracking()]
}
