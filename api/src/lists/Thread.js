import { Text, Checkbox, Relationship, Select } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdminOrOwner, userIsLoggedIn, userIsAdmin } from '../utils/access'
import { userIsForumAdminModeratorOrOwner } from '../hooks/threadHooks'

export default {
  fields: {
    title: {
      type: Text,
      hooks: {
        // TODO: Add max length validation
        validateInput: ({ existingItem, context, actions, resolvedData, addFieldValidationError }) => {
          if (resolvedData.title.length > 75) {
            addFieldValidationError('Max length of thread title is 75 characters.')
          }
          if (existingItem) {
            userIsForumAdminModeratorOrOwner(existingItem, context, actions)
          }
        }
      }
    },
    posts: { type: Relationship, ref: 'Post', many: true, isRequired: true },
    forum: { type: Relationship, ref: 'Forum', isRequired: true, access: { update: userIsAdmin } },
    isStickied: {
      type: Checkbox,
      hooks: {
        validateInput: userIsForumAdminModeratorOrOwner
      }
    },
    state: {
      type: Select,
      options: ['opened', 'closed'],
      defaultValue: 'opened'
    }
  },
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    update: userIsLoggedIn,
    delete: userIsAdmin
  }
}
