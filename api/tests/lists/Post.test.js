import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import createThread from '../utils/createThread'
import fixtures, { users, forums } from '../fixtures/fixtures'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  describe('Model: Post', () => {
    console.log(process.env.CLOUDINARY_CLOUD_NAME)
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
              name
            }
            thread {
              title
              forum {
                name
              }
              posts {
                owner {
                  name
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
              name
            }
            thread {
              title
              forum {
                name
              }
              posts {
                owner {
                  name
                }
                content
                isEdited
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
            name: 'pepp'
          },
          thread: {
            title: 'The first thread',
            forum: {
              name: 'test2'
            },
            posts: [{
              content: 'hej hej hej',
              owner: {
                name: 'fifth'
              }
            }, {
              content: 'hej kompisar',
              owner: {
                name: 'pepp'
              }
            },
            {
              content: 'hej tjomme',
              owner: {
                name: 'pepp'
              },
              isEdited: false
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
                  name
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
              name: 'fifth'
            }
          }, {
            content: 'hej kompisar',
            owner: {
              name: 'pepp'
            }
          },
          {
            content: 'hej tjomme',
            owner: {
              name: 'pepp'
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

    test('should allow moderator to edit others posts', runner(setupTest, async ({ keystone, create, app }) => {
      const { postID } = await createThread(keystone, fixtures, users, app, { user: 2 })
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[3]

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
            updatePost(id: "${postID}", data: { content: "edited by moderator" }) {
              content
          }
        }
      `
      })

      expect(data).toMatchObject({ updatePost: { content: 'edited by moderator' } })
      expect(errors).toBe(undefined)
    }))

    test('should not allow user to edit others posts', runner(setupTest, async ({ keystone, create, app }) => {
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
            updatePost(id: "${postID}", data: { content: "edited by me" }) {
              content
          }
        }
      `
      })

      expect(data).toMatchObject({ updatePost: null })
      expect(errors[0]).toMatchObject({ name: 'AccessDeniedError' })
    }))

    test('should allow user to edit own posts', runner(setupTest, async ({ keystone, create, app }) => {
      const { postID } = await createThread(keystone, fixtures, users, app, { user: 1 })
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
            updatePost(id: "${postID}", data: { content: "edited by me" }) {
              content
              isEdited
          }
        }
      `
      })

      expect(data).toMatchObject({ updatePost: { content: 'edited by me', isEdited: true } })
      expect(errors).toBe(undefined)
    }))

    test('shouldnt allow user to post to closed thread', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app, { startClosed: true })
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[1]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      // post 1
      const { data, errors } = await networkedGraphqlRequest({
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
            thread {
              title
              forum {
                name
              }
              posts {
                content
              }
            }
        }
      }
    `
      })

      expect(data).toMatchObject({
        createPost: null
      })
      expect(errors).toMatchObject([{ name: 'ThreadClosedError' }])
    }))

    test('shouldnt allow user to post to thread in banned forum', runner(setupTest, async ({ keystone, create, app }) => {
      // here, an admin created a thread in a banned forum, which our user then attempts to post to
      const { threadID } = await createThread(keystone, fixtures, users, app, { user: 0, forum: 'bannedforum' })
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[1]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      // post 1
      const { data, errors } = await networkedGraphqlRequest({
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
            thread {
              title
              forum {
                name
              }
              posts {
                content
              }
            }
        }
      }
    `
      })

      expect(data).toMatchObject({
        createPost: null
      })
      expect(errors).toMatchObject([{ name: 'ForumBannedError' }])
    }))

    test('should not allow posts with no content', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app)
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
          createPost(data: {
            content: "   ",
            thread: { connect: { id: "${threadID}" } }
          }) {
            content
            thread {
              title
              forum {
                name
              }
              posts {
                content
              }
            }
        }
      }
    `
      })

      expect(data).toMatchObject({
        createPost: null
      })
      expect(errors).toMatchObject([{ name: 'ValidationFailureError' }])
    }))
  })
})
