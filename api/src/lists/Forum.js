import { Text, Slug, Relationship } from '@keystonejs/fields'
import { byTracking } from '@keystonejs/list-plugins'

import { userIsAdmin, userIsLoggedIn, userIsAdminOrOwner } from '../utils/access'
import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'

export default {
  fields: {
    name: {
      type: Text,
      hooks: {
        resolveInput: async ({ resolvedData, existingItem }) => {
          // trims any non-alphanumeric
          return (resolvedData.name && resolvedData.name.replace(/\W/g, '')) || existingItem.name
        }
      },
      isRequired: true,
      isUnique: true
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
    }
  },
  plugins: [byTracking()],
  access: {
    create: userIsLoggedIn,
    read: true,
    update: ({ authentication: { item: user }, itemId, originalInput }) => {
      // TODO: this should query ForumWhereInput with the id of the forum and the logged in user id is ther owner but it doesnt work
      return {
      // checks if
        id: itemId,
        owner: {
          id: user.id
        }
      }
    },
    delete: userIsAdmin
  }
}
