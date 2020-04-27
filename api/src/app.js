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

export default {
  keystone,
  apps: [
    new GraphQLApp({
      authStrategy,
      apollo: {
        validationRules: [validation.depthLimit(10)]
      }
    }),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user, listKey: list } }) => !!user && !!user.isAdmin
    })
  ]
}
