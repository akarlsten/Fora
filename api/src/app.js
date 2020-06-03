import { Keystone } from '@keystonejs/keystone'
import { PasswordAuthStrategy } from '@keystonejs/auth-password'
import { GraphQLApp, validation } from '@keystonejs/app-graphql'
import { AdminUIApp } from '@keystonejs/app-admin-ui'
import initialiseData from './initial-data'
import expressSession from 'express-session'
import MongoStoreMaker from 'connect-mongo'
import path from 'path'

import { MongooseAdapter as Adapter } from '@keystonejs/adapter-mongoose'

import User from './lists/User'
import Forum from './lists/Forum'
import Thread from './lists/Thread'
import Post from './lists/Post'
import * as mutations from './mutations'

const MongoStore = MongoStoreMaker(expressSession)

const PROJECT_NAME = 'Fora'

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.MONGODB_ATLAS : process.env.DATABASE_URL

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter({ mongoUri: dbUrl }),
  sessionStore: new MongoStore({ url: dbUrl }),
  cookieSecret: process.env.COOKIE_SECRET,
  onConnect: initialiseData,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: false,
    secure: process.env.NODE_ENV === 'production'
  }
})

keystone.createList('User', User)
keystone.createList('Forum', Forum)
keystone.createList('Thread', Thread)
keystone.createList('Post', Post)

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User'
})

keystone.extendGraphQLSchema({
  types: [{ type: 'type Message { message: String }' }],
  mutations: [
    {
      schema: 'requestReset(email: String!): Message',
      resolver: mutations.requestReset
    },
    {
      schema:
        'resetPassword(resetToken: String!, password: String!, confirmPassword: String!): Message',
      resolver: mutations.resetPassword
    }
  ]
})

// ---- Schema dumping ----
if (typeof process.env.DUMP_SCHEMA === 'string') {
  const schemaName = 'public' // this is the default keystonejs schema name
  keystone.dumpSchema(process.env.DUMP_SCHEMA, schemaName)
  console.log(`Schema dumped to: ${path.resolve(process.env.DUMP_SCHEMA)}`)
  process.exit(0)
}
// ---- End Schema dumping ----

console.log('!!!!!!')
console.log('Hello future me, Keystone added the ability to use async access control functions in v 10.0.')
console.log('This should allow us to rewrite the hacky validateInput-hook based access control and allow us to use it on read operations, enabling private forums.')
console.log('Investigate this later!!')

export default {
  keystone,
  apps: [
    new GraphQLApp({
      authStrategy,
      apiPath: '/',
      graphiqlPath: '/gql',
      apollo: {
        validationRules: [validation.depthLimit(30)],
        engine: {
          privateVariables: ['password']
        }
      }
    }),
    new AdminUIApp({
      enableDefaultRoute: false,
      apiPath: '/',
      // graphiqlPath: '/gql',
      adminPath: '/admin',
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user, listKey: list } }) => !!user && !!user.isAdmin
    })
  ], // uncomment this in production when behind nginx
  configureExpress: app => {
    app.set('trust proxy', process.env.NODE_ENV === 'production')
  }
}
