import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import fixtures, { users, forums } from '../fixtures/fixtures'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  describe('Model: Forum', () => {

  })
})
