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

    test('should not allow forum names longer than 20 characters', runner(setupTest, async ({ keystone, create, app }) => {
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
            name: "AReallyLongNameWowVeryLongTooLongPerhaps"
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

      expect(data).toEqual({ createForum: null })

      expect(errors[0].name).toBe('ValidationFailureError')
      expect(errors[0].data.messages[0]).toBe('Max length of forum name is 20 characters.')
    }))

    test('should allow owner to set moderators', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[1]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumData = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "test2"
          }
        ) {
          id
          owner {
            id
          }
        }
      }
      `
      })

      const userData = await graphqlRequest({
        keystone,
        query: `
      query {
        allUsers(
          where: {
            email: "test2@wow.com"
          }
        ) {
          id
        }
      }
      `
      })

      const forumID = forumData.data.allForums[0].id
      const userID = userData.data.allUsers[0].id

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation($id: ID!, $data: ForumUpdateInput) {
          updateForum(
            id: $id,
            data: $data
          ) {
            moderators {
              email
            }
          }
      }
    `,
        variables: {
          id: forumID,
          data: {
            moderators: {
              disconnectAll: true,
              connect: [
                { id: userID }
              ]
            }
          }
        }
      })

      expect(errors).toBe(undefined)
      expect(data.updateForum.moderators[0].email).toBe(users[2].email)
    }))

    test('should not allow non-owner to set moderators', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[2] // we log in as user 3 who doesnt own any forums

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumData = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "test2"
          }
        ) {
          id
          owner {
            id
          }
        }
      }
      `
      })

      const userData = await graphqlRequest({
        keystone,
        query: `
      query {
        allUsers(
          where: {
            email: "test2@wow.com"
          }
        ) {
          id
        }
      }
      `
      })

      const forumID = forumData.data.allForums[0].id // owned by user 1
      const userID = userData.data.allUsers[0].id

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation($id: ID!, $data: ForumUpdateInput) {
          updateForum(
            id: $id,
            data: $data
          ) {
            moderators {
              email
            }
          }
      }
    `,
        variables: {
          id: forumID,
          data: {
            moderators: {
              disconnectAll: true,
              connect: [
                { id: userID }
              ]
            }
          }
        }
      })

      expect(data).toEqual({ updateForum: null })
      expect(errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('should allow admins to set moderators', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[0]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumData = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "test2"
          }
        ) {
          id
          owner {
            id
          }
        }
      }
      `
      })

      const userData = await graphqlRequest({
        keystone,
        query: `
      query {
        allUsers(
          where: {
            email: "test2@wow.com"
          }
        ) {
          id
        }
      }
      `
      })

      const forumID = forumData.data.allForums[0].id
      const userID = userData.data.allUsers[0].id

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation($id: ID!, $data: ForumUpdateInput) {
          updateForum(
            id: $id,
            data: $data
          ) {
            moderators {
              email
            }
          }
      }
    `,
        variables: {
          id: forumID,
          data: {
            moderators: {
              disconnectAll: true,
              connect: [
                { id: userID }
              ]
            }
          }
        }
      })

      expect(errors).toBe(undefined)
      expect(data.updateForum.moderators[0].email).toBe(users[2].email)
    }))

    test('should allow admins to delete forums', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[0]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumData = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "test2"
          }
        ) {
          id
          owner {
            id
          }
        }
      }
      `
      })

      const forumID = forumData.data.allForums[0].id

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation($id: ID!) {
          deleteForum(
            id: $id
          ) {
            name
          }
      }
    `,
        variables: {
          id: forumID
        }
      })

      expect(errors).toBe(undefined)
      expect(data.deleteForum.name).toBe('test2')
    }))

    test('should not allow non-admins to delete forums, not even owners', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[1]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumData = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "test2"
          }
        ) {
          id
          owner {
            id
          }
        }
      }
      `
      })

      const forumID = forumData.data.allForums[0].id

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation($id: ID!) {
          deleteForum(
            id: $id
          ) {
            name
          }
      }
    `,
        variables: {
          id: forumID
        }
      })

      expect(data).toEqual({ deleteForum: null })
      expect(errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

    test('should allow admins to rename forum', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[0]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumData = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "test2"
          }
        ) {
          id
          owner {
            id
          }
        }
      }
      `
      })

      const forumID = forumData.data.allForums[0].id

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation($id: ID!, $data: ForumUpdateInput) {
          updateForum(
            id: $id,
            data: $data
          ) {
            name
          }
      }
    `,
        variables: {
          id: forumID,
          data: {
            name: 'blurp yurp'
          }
        }
      })

      expect(errors).toBe(undefined)
      expect(data.updateForum.name).toBe('blurpyurp')
    }))

    test('should not allow non-admins to rename forum', runner(setupTest, async ({ keystone, create, app }) => {
      await keystone.createItems(fixtures)

      // fetch the email and password from the fixtures
      const { email, password } = users[1]

      const { token } = await login(app, email, password)

      expect(token).toBeTruthy()

      const forumData = await graphqlRequest({
        keystone,
        query: `
      query {
        allForums(
          where: {
            url: "test2"
          }
        ) {
          id
          owner {
            id
          }
        }
      }
      `
      })

      const forumID = forumData.data.allForums[0].id

      const { data, errors } = await networkedGraphqlRequest({
        app,
        headers: {
          Authorization: `Bearer ${token}`
        },
        expectedStatusCode: 200,
        query: `
        mutation($id: ID!, $data: ForumUpdateInput) {
          updateForum(
            id: $id,
            data: $data
          ) {
            name
          }
      }
    `,
        variables: {
          id: forumID,
          data: {
            name: 'blurp yurp'
          }
        }
      })

      expect(data).toEqual({ updateForum: null })
      expect(errors).toMatchObject([{ name: 'AccessDeniedError' }])
    }))

  // admins should be able to ban forum
  // moderators or admins should be able to set forum to private
  // non-admin/moderators shouldnt be able to update forum at all
  })
})
