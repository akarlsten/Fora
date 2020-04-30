import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import fixtures, { users, forums } from '../fixtures/fixtures'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  describe('Model: User', () => {
    test('should allow creation of user', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      const { data, errors } = await networkedGraphqlRequest({
        app,
        expectedStatusCode: 200,
        query: `
        mutation {
          createUser(data: {
            name: "totinos",
            email: "totinos@pizza.com",
            password: "awoo1234"
          }) {
            name
        }
      }
    `
      })

      expect(data).toMatchObject({ createUser: { name: 'totinos' } })
      expect(errors).toBe(undefined)
    }))

    test('should not allow too long names', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      const { data, errors } = await networkedGraphqlRequest({
        app,
        expectedStatusCode: 200,
        query: `
        mutation {
          createUser(data: {
            name: "superlongnameverylongindeedperhapstoolongdefinitely",
            email: "totinos@pizza.com",
            password: "awoo1234"
          }) {
            name
        }
      }
    `
      })

      expect(data).toMatchObject({ createUser: null })
      expect(errors).toMatchObject([{ name: 'ValidationFailureError' }])
    }))

    test('should not allow empty names', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      const { data, errors } = await networkedGraphqlRequest({
        app,
        expectedStatusCode: 200,
        query: `
        mutation {
          createUser(data: {
            name: "",
            email: "totinos@pizza.com",
            password: "awoo1234"
          }) {
            name
        }
      }
    `
      })

      expect(data).toMatchObject({ createUser: null })
      expect(errors).toMatchObject([{ name: 'ValidationFailureError' }])
    }))

    test('should lowercase and trim names + remove non-alphanumeric', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      const { data, errors } = await networkedGraphqlRequest({
        app,
        expectedStatusCode: 200,
        query: `
        mutation {
          createUser(data: {
            name: "/// cool bean xxD !!    ",
            email: "totinos@pizza.com",
            password: "awoo1234"
          }) {
            name
        }
      }
    `
      })

      expect(data).toMatchObject({ createUser: { name: 'coolbeanxxd' } })
      expect(errors).toBe(undefined)
    }))
  })
})
