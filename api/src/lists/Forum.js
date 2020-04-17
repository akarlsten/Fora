import { Text, Slug, Relationship, Checkbox } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'
import { createError } from 'apollo-errors'

import { userIsAdmin, userIsLoggedIn, userIsAdminOrOwner, userIsAdminModeratorOrOwner } from '../utils/access'
import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'

const AccessDeniedError = createError('AccessDeniedError', {
  message: 'You do not have access to this resource',
  options: { showPath: true }
})

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
      ref: 'User.isModeratorOf',
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
        update: ({ authentication: { item: user }, existingItem, operation }) => {
          return true
          // console.log()
          // console.log(existingItem)
          // if (existingItem) {
          //   return existingItem[fieldKey] === user.id
          // }
          // TODO: Clean this up - perhaps into access
          if (!user) {
            return false
          }
          const { owner } = existingItem

          console.log(existingItem)

          if (user.isAdmin || user.id === `${owner}`) {
            return true
          }

          return false
        }
      },
      hooks: {
        validateInput: async ({ existingItem, context, actions: { query } }) => {
          const user = context.authedItem
          if (!!user.isAdmin || user.id === `${existingItem.owner}`) {
            return
          }

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
            }
          }
          console.log(existingItem)
          console.log(context.authedItem)
          const { data } = await query(queryString, options)

          if (!data.Forum.moderators.some(moderator => moderator.id === user.id)) {
            throw new AccessDeniedError()
          }
        }
      }
    }
  },
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    read: true,
    update: true, // userIsAdminModeratorOrOwner,
    delete: userIsAdmin
  }
}
