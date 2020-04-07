import { setupServer } from '@keystonejs/test-utils'
import { PasswordAuthStrategy } from '@keystonejs/auth-password'

import User from '../src/lists/User'
import Forum from '../src/lists/Forum'
import Thread from '../src/lists/Thread'
import Post from '../src/lists/Post'

export default () => {
  return setupServer({
    adapterName: 'mongoose',
    name: 'test',
    createLists: keystone => {
      keystone.createList('User', User)
      keystone.createList('Forum', Forum)
      keystone.createList('Thread', Thread)
      keystone.createList('Post', Post)
      keystone.createAuthStrategy({
        type: PasswordAuthStrategy,
        list: 'User'
      })
    }
  })
}
