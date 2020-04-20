import { Keystone } from '@keystonejs/keystone'
import { PasswordAuthStrategy } from '@keystonejs/auth-password'
import { GraphQLApp } from '@keystonejs/app-graphql'
import { AdminUIApp } from '@keystonejs/app-admin-ui'
import initialiseData from './initial-data'

import { MongooseAdapter as Adapter } from '@keystonejs/adapter-mongoose'

import User from './lists/User'
import Forum from './lists/Forum'
import Thread from './lists/Thread'
import Post from './lists/Post'

const PROJECT_NAME = 'dev'

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  onConnect: initialiseData
})

keystone.createList('User', User)
keystone.createList('Forum', Forum)
keystone.createList('Thread', Thread)
keystone.createList('Post', Post)

// keystone.createList('User', {
//   fields: {
//     name: { type: Text },
//     email: {
//       type: Text,
//       isUnique: true
//     },
//     isAdmin: {
//       type: Checkbox,
//       // Field-level access controls
//       // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
//       access: {
//         update: access.userIsAdmin
//       }
//     },
//     password: {
//       type: Password
//     }
//   },
//   // List-level access controls
//   access: {
//     read: access.userIsAdminOrOwner,
//     update: access.userIsAdminOrOwner,
//     create: access.userIsAdmin,
//     delete: access.userIsAdmin,
//     auth: true
//   }
// })

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User'
})

export default {
  keystone,
  apps: [
    new GraphQLApp({ authStrategy }),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user, listKey: list } }) => !!user && !!user.isAdmin
    })
  ]
}
