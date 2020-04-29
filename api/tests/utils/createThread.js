import login from './login'
import getForumID from './getForumID'
import { networkedGraphqlRequest } from '@keystonejs/test-utils'

// TODO: disgusting, refactor the parameters
/**
 * Creates a thread with one post in the test database
 * @param {function} keystone - The testing Keystone instance
 * @param {object} fixtures - An object containing some fixtures to create forums, users, etc.
 * @param {array} users - The users list from the above fixtures. Should probably be removed in favor of fixtures.users
 * @param {function} app - The testing GraphQLApp from Keystone
 * @param {Object} param4 - A configuration object, allowing you to choose if the thread should be set to closed, who the OP is and which forum it is posted to.
 */
export default async function createThread (keystone, fixtures, users, app, { startClosed = false, user = 4, forum = 'test2' } = {}) {
  await keystone.createItems(fixtures)

  // fetch the email and password from the fixtures
  const { email, password } = users[user]

  const { token } = await login(app, email, password)

  const forumID = await getForumID(keystone, forum)

  const state = startClosed ? 'closed' : 'opened'

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
            forum: { connect: { id: "${forumID}" } },
            state: ${state}
          }) {
            id
            title
            posts {
              id
              owner {
                email
              }
              content
            }
            forum {
              id
            }
        }
      }
    `
  })

  return {
    threadID: data.createThread.id,
    forumID: data.createThread.forum.id,
    postID: data.createThread.posts[0].id
  }
}
