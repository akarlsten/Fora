import { multiAdapterRunners, graphqlRequest, networkedGraphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'
import login from '../utils/login'
import getForumID from '../utils/getForumID'
import createThread from '../utils/createThread'
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

    test('shouldnt allow banned user to create thread', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[5]

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

      expect(data).toEqual({ createThread: null })
      expect(errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('shouldnt allow too long thread names', runner(setupTest, async ({ keystone, create, app }) => {
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
            title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lobortis velit tortor, vitae posuere.",
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

      expect(data).toEqual({ createThread: null })
      expect(errors).toMatchObject([{ name: 'ValidationFailureError' }])
    }))

    test('should not allow user to change posts in thread', runner(setupTest, async ({ keystone, create, app }) => {
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
        expectedStatusCode: 400,
        query: `
        mutation {
          updateThread(id: "${threadID}", 
          data: {
            posts: {
              create: [{content: "tjenis"}]
            }
          }) {
            title
            posts {
              content
            }
          }
        }
    `
      })

      expect(data).toBeFalsy()
      expect(errors).toMatchObject([{ name: 'ValidationError' }])
    }))

    test('shouldnt allow user to create thread in banned forum', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[4]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumID = await getForumID(keystone, 'bannedforum')

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
            title: "banned thread",
            posts: { create: [{content: "post in banned"}]},
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
        createThread: null
      })
      expect(errors).toMatchObject([{ name: 'NestedError' }])
    }))

    test('should not allow user to change title of thread', runner(setupTest, async ({ keystone, create, app }) => {
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
          updateThread(id: "${threadID}", 
          data: {
            title: "new title"
          }) {
            title
            posts {
              content
            }
          }
        }
    `
      })

      expect(data).toMatchObject({ updateThread: null })
      expect(errors[0].data.errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('should allow moderator to change title of thread', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app)
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
          updateThread(id: "${threadID}", 
          data: {
            title: "new title"
          }) {
            title
          }
        }
    `
      })

      expect(data).toMatchObject({ updateThread: { title: 'new title' } })
      expect(errors).toBe(undefined)
    }))

    test('should not allow user to close thread', runner(setupTest, async ({ keystone, create, app }) => {
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
          updateThread(id: "${threadID}", 
          data: {
            state: closed
          }) {
            state
          }
        }
    `
      })

      expect(data).toMatchObject({ updateThread: null })
      expect(errors[0].data.errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('should allow moderator to close thread', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app)
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
          updateThread(id: "${threadID}", 
          data: {
            state: closed
          }) {
            state
          }
        }
    `
      })

      expect(data).toMatchObject({ updateThread: { state: 'closed' } })
      expect(errors).toBe(undefined)
    }))

    test('should not allow user to sticky thread', runner(setupTest, async ({ keystone, create, app }) => {
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
          updateThread(id: "${threadID}", 
          data: {
            isStickied: true
          }) {
            isStickied
          }
        }
    `
      })

      expect(data).toMatchObject({ updateThread: null })
      expect(errors[0].data.errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('should allow moderator to sticky thread', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app)
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
          updateThread(id: "${threadID}", 
          data: {
            isStickied: true
          }) {
            isStickied
          }
        }
    `
      })

      expect(data).toMatchObject({ updateThread: { isStickied: true } })
      expect(errors).toBe(undefined)
    }))

    test('should not allow thread with empty title', runner(setupTest, async ({ keystone, create, app }) => {
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
            title: "   ",
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
        createThread: null
      })
      expect(errors).toMatchObject([{ name: 'ValidationFailureError' }])
    }))

    test('should not allow creating thread without a first post', runner(setupTest, async ({ keystone, create, app }) => {
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
            title: "a little thread",
            posts: {create: []},
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
        createThread: null
      })
      expect(errors).toMatchObject([{ name: 'NoPostsError' }])
    }))

    test('should not allow user to delete own thread', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app, { user: 1 })
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
            updateThread(id: "${threadID}", data: { isDeleted: true }) {
              title
              posts {
                content
              }
              isDeleted
          }
        }
      `
      })

      expect(data).toMatchObject({ updateThread: null })
      expect(errors[0].data.errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('should allow moderator to delete threads but not see content', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app, { user: 1 })
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
            updateThread(id: "${threadID}", data: { isDeleted: true }) {
              title
              posts {
                content
              }
              isDeleted
          }
        }
      `
      })

      expect(data).toMatchObject({ updateThread: { title: null, posts: null, isDeleted: true } })
      expect(errors).toMatchObject([{ name: 'AccessDeniedError' }, { name: 'AccessDeniedError' }])
    }))

    test('should allow admins to delete threads and see content', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app, { user: 1 })
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[0]

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
            updateThread(id: "${threadID}", data: { isDeleted: true }) {
              title
              posts {
                isDeleted
                content
              }
              isDeleted
          }
        }
      `
      })

      expect(data).toMatchObject({ updateThread: { title: 'The first thread', posts: [{ content: 'hej hej hej', isDeleted: true }], isDeleted: true } })
      expect(errors).toBe(undefined)
    }))

    test('should allow admins to undelete threads', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app, { user: 1 })
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[0]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
          mutation {
            updateThread(id: "${threadID}", data: { isDeleted: true }) {
              title
              posts {
                isDeleted
                content
              }
              isDeleted
          }
        }
      `
      })

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
          mutation {
            updateThread(id: "${threadID}", data: { isDeleted: false }) {
              title
              posts {
                isDeleted
                content
              }
              isDeleted
          }
        }
      `
      })

      expect(data).toMatchObject({ updateThread: { title: 'The first thread', posts: [{ content: 'hej hej hej', isDeleted: false }], isDeleted: false } })
      expect(errors).toBe(undefined)
    }))

    test('should allow moderators to undelete threads', runner(setupTest, async ({ keystone, create, app }) => {
      const { threadID } = await createThread(keystone, fixtures, users, app, { user: 1 })
      // sequential tests
      // fetch the email and password from the fixtures
      const { email, password } = users[3]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
          mutation {
            updateThread(id: "${threadID}", data: { isDeleted: true }) {
              title
              posts {
                isDeleted
                content
              }
              isDeleted
          }
        }
      `
      })

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
          mutation {
            updateThread(id: "${threadID}", data: { isDeleted: false }) {
              title
              posts {
                isDeleted
                content
              }
              isDeleted
          }
        }
      `
      })

      expect(data).toMatchObject({ updateThread: { title: 'The first thread', posts: [{ content: 'hej hej hej', isDeleted: false }], isDeleted: false } })
      expect(errors).toBe(undefined)
    }))
  })
})
