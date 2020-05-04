import { Keystone } from '@keystonejs/keystone'
import { PasswordAuthStrategy } from '@keystonejs/auth-password'
import { GraphQLApp, validation } from '@keystonejs/app-graphql'
import { AdminUIApp } from '@keystonejs/app-admin-ui'
import initialiseData from './initial-data'
import expressSession from 'express-session'
import MongoStoreMaker from 'connect-mongo'

import { MongooseAdapter as Adapter } from '@keystonejs/adapter-mongoose'

import User from './lists/User'
import Forum from './lists/Forum'
import Thread from './lists/Thread'
import Post from './lists/Post'
import * as mutations from './mutations'

const MongoStore = MongoStoreMaker(expressSession)

const PROJECT_NAME = 'dev'

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter({ mongoUri: process.env.DATABASE_URL }),
  sessionStore: new MongoStore({ url: process.env.DATABASE_URL }),
  cookieSecret: process.env.COOKIE_SECRET,
  secureCookies: false, // TODO: true for production!!!!!
  onConnect: initialiseData
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

export default {
  keystone,
  apps: [
    new GraphQLApp({
      authStrategy,
      apiPath: '/api',
      graphiqlPath: '/gql',
      apollo: {
        validationRules: [validation.depthLimit(30)]
      }
    }),
    new AdminUIApp({
      enableDefaultRoute: true,
      apiPath: '/api',
      // graphiqlPath: '/gql',
      adminPath: '/admin',
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user, listKey: list } }) => !!user && !!user.isAdmin
    })
  ]/* , // uncomment this in production when behind nginx
  configureExpress: app => {
    app.set('trust proxy', true)
  } */
}
