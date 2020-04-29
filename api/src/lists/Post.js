import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'
import { Text, Checkbox, Virtual, Relationship } from '@keystonejs/fields'
import { atTracking, byTracking } from '@keystonejs/list-plugins'

import { userIsLoggedIn, userIsAdmin, userIsAdminOrOwner } from '../utils/access'
import { userIsForumAdminModeratorOrOwner, userIsBanned, threadOrForumIsClosed, userOwnsPost } from '../hooks/postHooks'

export default {
  fields: {
    owner: {
      type: AuthedRelationship,
      ref: 'User.posts',
      access: {
        update: false
      },
      isRequired: true
    },
    thread: { type: Relationship, ref: 'Thread.posts', isRequired: true, access: { update: false } },
    content: { type: Text, isRequired: true },
    edited: { type: Virtual, graphQLReturnType: 'Boolean', resolver: post => (post.updatedAt > post.createdAt) }
  },
  access: {
    create: userIsLoggedIn,
    read: true,
    update: userIsLoggedIn, // access check is done later
    delete: userIsAdmin
  },
  hooks: {
    validateInput: async ({ existingItem, context, actions, resolvedData }) => {
      try {
        await userIsForumAdminModeratorOrOwner({ existingItem, context, actions })
      } catch (e) {
        await Promise.all([userOwnsPost({ existingItem, context }), userIsBanned({ resolvedData, existingItem, context, actions }), threadOrForumIsClosed({ resolvedData, existingItem, context, actions })])
      }
    }
  },
  plugins: [atTracking(), byTracking()]
}
