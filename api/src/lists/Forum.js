import { Text, Slug, Relationship, Checkbox } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdmin, userIsLoggedIn, userIsAdminOrOwner, userIsAdminModeratorOrOwner } from '../utils/access'
import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'

export default {
  fields: {
    name: {
      type: Text,
      hooks: {
        resolveInput: async ({ resolvedData, existingItem }) => {
          // trims any non-alphanumeric
          return (resolvedData.name && resolvedData.name.replace(/\W/g, '')) || existingItem.name
        },
        validateInput: async ({ resolvedData, addFieldValidationError }) => {
          if (resolvedData.name.length > 20) {
            addFieldValidationError('Max length of forum name is 20 characters.')
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
    threads: { type: Relationship, ref: 'Thread', many: true },
    owner: {
      type: AuthedRelationship,
      ref: 'User',
      access: {
        update: userIsAdmin
      }
    },
    moderators: {
      type: Relationship,
      ref: 'User',
      many: true
    },
    isBanned: {
      type: Checkbox,
      access: {
        update: userIsAdmin
      }
    },
    isPrivate: {
      type: Checkbox,
      access: {
        update: ({ authentication: { item: user }, existingItem, itemId }) => {
          // TODO: Clean this up - perhaps into access
          if (!user) {
            return false
          }
          const { owner, moderators } = existingItem

          // console.log(moderators)
          // console.log(`--------\nCurrent user: ${user.id}\nCurrent owner: ${owner}\nAre they equal? ${user.id === owner}\nType - user.id: ${typeof user.id}\n Type - owner: ${typeof owner}`)

          if (user.isAdmin || user.id === `${owner}` || (moderators && moderators.includes(user.id))) {
            return true
          }

          return true
        }
      },
      hooks: {
        validateInput: async ({ existingItem, context, actions: { query } }) => {
          const queryString = `
          query ($forumID: ID!) {
            Forum(where: { id: $forumID}) {
              name
              moderators {
                id
              }
            }
          }
          `

          const options = {
            skipAccessControl: true,
            variables: {
              forumID: existingItem.id
              // userID: context.authedItem.id
            }
          }

          const { errors, data } = await query(queryString, options)

          console.log(errors)
          console.log(JSON.stringify(data))
          // console.log('data', data.Forum.moderators.includes(context.authedItem.id))
          // console.log('errors', errors)
        }
      }
    }
  },
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    read: true,
    update: userIsAdminModeratorOrOwner,
    delete: userIsAdmin
  }
}
