import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import createThread from '../utils/createThread'
import fixtures, { users, forums } from '../fixtures/fixtures'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  describe('Model: Post', () => {
    test('should allow authenticated user to post to existing thread', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app)
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[1]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      // post 1
      await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation {
          createPost(data: {
            content: "hej kompisar",
            thread: { connect: { id: "${threadID}" } }
          }) {
            content
            owner {
              email
            }
            thread {
              title
              forum {
                name
              }
              posts {
                owner {
                  email
                }
                content
              }
            }
        }
      }
    `
      })

      // post 2
      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation {
          createPost(data: {
            content: "hej tjomme",
            thread: { connect: { id: "${threadID}" } }
          }) {
            content
            owner {
              email
            }
            thread {
              title
              forum {
                name
              }
              posts {
                owner {
                  email
                }
                content
              }
            }
        }
      }
    `
      })

      expect(data).toMatchObject({
        createPost: {
          content: 'hej tjomme',
          owner: {
            email: 'test@wow.com'
          },
          thread: {
            title: 'The first thread',
            forum: {
              name: 'test2'
            },
            posts: [{
              content: 'hej hej hej',
              owner: {
                email: 'test4@wow.com'
              }
            }, {
              content: 'hej kompisar',
              owner: {
                email: 'test@wow.com'
              }
            },
            {
              content: 'hej tjomme',
              owner: {
                email: 'test@wow.com'
              }
            }]
          }
        }
      })
      expect(errors).toBe(undefined)

      // a last confirmation
      const response = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        query {
          Thread(where: {id: "${threadID}"}) {
              title
              forum {
                name
              }
              posts {
                owner {
                  email
                }
                content
              }
            }
        }
    `
      })

      expect(response.data).toMatchObject({
        Thread: {
          title: 'The first thread',
          forum: {
            name: 'test2'
          },
          posts: [{
            content: 'hej hej hej',
            owner: {
              email: 'test4@wow.com'
            }
          }, {
            content: 'hej kompisar',
            owner: {
              email: 'test@wow.com'
            }
          },
          {
            content: 'hej tjomme',
            owner: {
              email: 'test@wow.com'
            }
          }]
        }
      }
      )
      expect(response.errors).toBe(undefined)
    }))

    test('should not allow user to remove others posts', runner(setupTest, async ({ keystone, create, app }) => {
      const { postID } = await createThread(keystone, fixtures, users, app)
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[1]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation {
          deletePost(id: "${postID}") {
            content
        }
      }
    `
      })

      expect(data).toMatchObject({ deletePost: null })
      expect(errors[0]).toMatchObject({ name: 'AccessDeniedError' })
    }))
  })
})
