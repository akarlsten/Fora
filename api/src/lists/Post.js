import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'
import { Text, Checkbox, Relationship } from '@keystonejs/fields'
import { atTracking, byTracking } from '@keystonejs/list-plugins'

import { userIsLoggedIn, userIsAdmin } from '../utils/access'

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
    thread: { type: Relationship, ref: 'Thread', isRequired: true },
    content: { type: Text },
    edited: { type: Checkbox, defaultValue: false }
  },
  access: {
    create: userIsLoggedIn,
    read: true,
    update: userIsLoggedIn,
    delete: userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
}
