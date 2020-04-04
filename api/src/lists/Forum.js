import { Text, Slug, Relationship } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdmin, userIsLoggedIn, userIsAdminOrOwner } from '../utils/access'

export default {
  fields: {
    name: {
      type: Text,
      hooks: {
        resolveInput: async ({ resolvedData }) => {
          // trims any non-alphanumeric
          return resolvedData.name.replace(/\W/g, '')
        }
      },
      isRequired: true,
      isUnique: true
    },
    url: {
      type: Slug,
      generate: ({ resolvedData }) => resolvedData.name.replace(/\W/g, '').toLowerCase(),
      isUnique: true,
      access: {
        create: false,
        read: true,
        update: false
      }
    },
    threads: { type: Relationship, ref: 'Thread', many: true }
  },
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    read: true,
    update: userIsAdminOrOwner,
    delete: userIsAdmin
  }
}
