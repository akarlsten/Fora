import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import fixtures, { users, forums } from '../fixtures/fixtures'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  describe('Model: Post', () => {
    runner(setupTest, async ({ keystone, create, app }) => {
      // sequential tests
      test('a test within a test', () => {
        const test = 2

        expect(test).toBe(2)
      })
    })

    test('post test', runner(setupTest, async ({ keystone, create, app }) => {
      const testy = 3

      expect(testy).toBe(3)
    }))
  })
})
