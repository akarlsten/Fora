import { AuthedRelationship } from '@keystonejs/fields-authed-relationship'
import { Text, Checkbox, Virtual, Relationship } from '@keystonejs/fields'
import { atTracking, byTracking } from '@keystonejs/list-plugins'

import { userIsLoggedIn, userIsAdmin, userIsAdminOrOwner } from '../utils/access'
import { userIsForumAdminModeratorOrOwner } from '../hooks/postHooks'

export default {
  fields: {
    owner: {
      type: AuthedRelationship,
      ref: 'User',
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
    update: userIsAdminOrOwner,
    delete: userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
}
