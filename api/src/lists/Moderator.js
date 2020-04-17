import { Text, Checkbox, Relationship } from '@keystonejs/fields'
import { atTracking, byTracking } from '@keystonejs/list-plugins'

import { userIsLoggedIn, userIsAdmin } from '../utils/access'

export default {
  fields: {
    users: {
      type: Relationship,
      ref: 'User'
    }
  },
  access: true,
  plugins: [atTracking(), byTracking()]
}
