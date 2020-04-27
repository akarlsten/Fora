import { Text, Checkbox, Select, Password, Relationship, CloudinaryImage } from '@keystonejs/fields'
import { DateTimeUtc } from '@keystonejs/fields-datetime-utc'
import { byTracking, atTracking } from '@keystonejs/list-plugins'
// import { CloudinaryAdapter } from '@keystonejs/file-adapters'

import { userCanAccessUsers, userIsAdmin } from '../utils/access'

// const cloudinaryAdapter = new CloudinaryAdapter({
//   cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//   apiKey: process.env.CLOUDINARY_KEY,
//   apiSecret: process.env.CLOUDINARY_SECRET,
//   folder: 'my-keystone-app'
// })

export default {
  fields: {
    name: { type: Text, isUnique: true, isRequired: true },
    email: { type: Text, isUnique: true, isRequired: true },
    password: { type: Password, useCompiledBcrypt: true, rejectCommon: true, isRequired: true },
    // avatar: {type: CloudinaryImage, adapter: cloudinaryAdapter},
    isAdmin: {
      type: Checkbox,
      access: {
        update: userIsAdmin
      }
    },
    threads: { type: Relationship, ref: 'Thread', many: true },
    posts: { type: Relationship, ref: 'Post.owner', many: true },
    // isModeratorOf: {
    //   type: Relationship,
    //   ref: 'Forum.moderators',
    //   many: true,
    //   access: { update: false }
    // },
    // isOwnerOf: {
    //   type: Relationship,
    //   ref: 'Forum.owner',
    //   many: true,
    //   access: { read: true, create: false, update: false }
    // },
    resetToken: { type: Text, unique: true },
    resetTokenExpiry: { type: DateTimeUtc, unique: true },
    state: {
      type: Select,
      options: ['active', 'deactivated'],
      defaultValue: 'active'
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
