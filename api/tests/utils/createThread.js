import login from './login'
import getForumID from './getForumID'
import { networkedGraphqlRequest } from '@keystonejs/test-utils'

// TODO: disgusting, refactor the parameters
export default async function createThread (keystone, fixtures, users, app, startClosed, user = 4, forum = 'test2') {
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
