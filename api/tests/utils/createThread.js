import login from './login'
import getForumID from './getForumID'
import { networkedGraphqlRequest } from '@keystonejs/test-utils'

export default async function createThread (keystone, fixtures, users, app) {
  await keystone.createItems(fixtures)

  // fetch the email and password from the fixtures
  const { email, password } = users[4]

  const { token } = await login(app, email, password)

  const forumID = await getForumID(keystone, 'test2')

  const { data } = await networkedGraphqlRequest({
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
