import { Text, Checkbox, Select, Password, Relationship } from '@keystonejs/fields'
import { DateTimeUtc } from '@keystonejs/fields-datetime-utc'
import { byTracking, atTracking } from '@keystonejs/list-plugins'
import { userCanAccessUsers, userIsAdmin } from '../utils/access'

export default {
  fields: {
    name: { type: Text, isUnique: true, isRequired: true },
    email: { type: Text, isUnique: true, isRequired: true },
    password: { type: Password, useCompiledBcrypt: true, rejectCommon: true, isRequired: true },
    isAdmin: { type: Checkbox },
    threads: { type: Relationship, ref: 'Thread', many: true },
    posts: { type: Relationship, ref: 'Post', many: true },
    isModeratorOf: { type: Relationship, ref: 'Forum.moderators', many: true },
    isOwnerOf: { type: Relationship, ref: 'Forum.owner', many: true },
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
    read: userCanAccessUsers,
    update: userCanAccessUsers,
    delete: userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
}
