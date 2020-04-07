import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import fixtures, { users, forums } from '../fixtures/fixtures'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  describe('Model: Forum', () => {
    test('should return correct owner name', runner(setupTest, async ({ keystone, create }) => {
      await keystone.createItems(fixtures)
      const { data, errors } = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "hejhopp"
          }
        ) {
          owner {
            name
          }
        }
      }
      `
      })

      expect(data.allForums[0].owner.name).toBe('Adde C')
      expect(errors).toBe(undefined)
    }))

    test('shouldnt allow unauthenticated user to create forum', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      const { data, errors } = await networkedGraphqlRequest({
        app,
        query: `
        mutation {
          createForum(data: {
            name: "test !!! 123"
          }) {
          id
          name
          url
          owner {
            name
          }
        }
      }
    `
      })
      expect(data).toEqual({ createForum: null })
      expect(errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('should allow authenticated user to create forum', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[0]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        query: `
        mutation {
          createForum(data: {
            name: "test !!! 123"
          }) {
          name
          url
          owner {
            name
          }
        }
      }
    `
      })

      expect(data).toMatchObject({
        createForum: {
          name: 'test123',
          url: 'test123',
          owner: { name: 'Adde C' }
        }
      }
      )
      expect(errors).toBe(undefined)
    }))
  })
})
