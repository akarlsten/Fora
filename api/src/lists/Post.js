import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'
import { Text, Checkbox, Relationship } from '@keystonejs/fields'
import { atTracking, byTracking } from '@keystonejs/list-plugins'

import { userIsLoggedIn, userIsAdmin, userIsAdminOrOwner } from '../utils/access'

export default {
  fields: {
    owner: {
      type: AuthedRelationship,
      ref: 'User',
      access: {
        create: userIsAdmin,
        update: userIsAdmin
      }
    },
    thread: { type: Relationship, ref: 'Thread', isRequired: true, access: { update: false } },
    content: { type: Text }
  },
  access: {
    create: userIsLoggedIn,
    read: true,
    update: userIsAdminOrOwner,
    delete: userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
}
