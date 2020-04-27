import { createError } from 'apollo-errors'

const AccessDeniedError = createError('AccessDeniedError', {
  message: 'You do not have access to this resource',
  options: { showPath: true }
})

export async function userIsBanned ({ resolvedData, existingItem, context, actions: { query } }) {
  const user = context.authedItem

  // if resolvedData doesnt contain the (required!) thread field, this is being run as nested mutation on Thread,
  // which has its own userIsBanned check, hence we can skip it here.
  if (!resolvedData.thread) {
    return
  }

  const thread = (existingItem && existingItem.thread) || resolvedData.thread

  if (user.isAdmin) {
    return
  }

  const queryString = `
          query ($threadID: ID!) {
            Thread(where: { id: $threadID}) {
              forum {
                bannedUsers {
                  id
                }
              }
            }
          }
          `

  const options = {
    skipAccessControl: true,
    variables: {
      threadID: thread
    }
  }

  const { data } = await query(queryString, options)

  console.log(data.Thread)
  if (data.Thread.forum.bannedUsers.some(banned => banned.id === user.id)) {
    throw new AccessDeniedError()
  }
}

export async function userIsForumAdminModeratorOrOwner ({ existingItem, context, actions: { query } }) {
  const user = context.authedItem
  if (!user) {
    throw new AccessDeniedError()
  }

  if (user.isAdmin) {
    return
  }

  const queryString = `
          query ($threadID: ID!) {
            Thread(where: { id: $threadID}) {
              forum {
                owner {
                  id
                }
                moderators {
                  id
                }
              }
            }
          }
          `

  const options = {
    skipAccessControl: true,
    variables: {
      threadID: existingItem.thread
    }
  }

  const { data } = await query(queryString, options)

  if (!data.Thread.forum.moderators.some(moderator => moderator.id === user.id || !data.Thread.forum.owner.id === user.id)) {
    throw new AccessDeniedError()
  }
}
