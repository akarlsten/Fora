import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import getForumID from '../utils/getForumID'
import fixtures, { users, forums } from '../fixtures/fixtures'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  describe('Model: Thread', () => {
    test('should allow authenticated user to create thread', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[4]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumID = await getForumID(keystone, 'test2')

      expect(forumID).toBeTruthy()

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation {
          createThread(data: {
            title: "The first thread",
            posts: { create: [{content: "hej hej hej"}]},
            forum: { connect: { id: "${forumID}" } }
          }) {
            title
            posts {
              owner {
                email
              }
              content
            }
            forum {
              name
            }
        }
      }
    `
      })

      expect(data).toMatchObject({
        createThread: {
          title: 'The first thread',
          posts: [{
            content: 'hej hej hej',
            owner: {
              email: 'test4@wow.com'
            }
          }],
          forum: { name: 'test2' }
        }
      })
      expect(errors).toBe(undefined)
    }))
  })
})
