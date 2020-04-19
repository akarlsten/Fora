import { Text, Checkbox, Relationship } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdminOrOwner, userIsLoggedIn, userIsAdmin } from '../utils/access'

export default {
  fields: {
    title: {
      type: Text
    },
    posts: { type: Relationship, ref: 'Post', many: true, isRequired: true },
    forum: { type: Relationship, ref: 'Forum', isRequired: true, access: { update: userIsAdmin } },
    isStickied: {
      type: Checkbox,
      access: {
        update: userIsAdminOrOwner
      }
    }
  },
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    update: true,
    delete: userIsAdmin
  }
}
