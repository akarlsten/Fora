import { AccessDeniedError, ThreadClosedError, ForumBannedError } from './errors'

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

  if (data.Thread.forum.bannedUsers.some(banned => banned.id === user.id) || user.isGlobalBanned) {
    throw new AccessDeniedError()
  }
}

export async function userOwnsPost ({ existingItem, context }) {
  if (!existingItem) {
    return
  }

  const user = context.authedItem

  const owner = (existingItem && existingItem.owner)

  if (user.isAdmin) {
    return
  }

  if (user.id !== `${owner}`) {
    throw new AccessDeniedError()
  }
}

export async function threadOrForumIsClosed ({ resolvedData, existingItem, context, actions: { query } }) {
  const user = context.authedItem

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
              state
              forum {
                isBanned
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

  if (data.Thread.state === 'closed') {
    throw new ThreadClosedError()
  }

  if (data.Thread.forum.isBanned) {
    throw new ForumBannedError()
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
      threadID: `${existingItem.thread}`
    }
  }

  const { data } = await query(queryString, options)

  if (!data.Thread.forum.moderators.some(moderator => moderator.id === user.id || !data.Thread.forum.owner.id === user.id)) {
    throw new AccessDeniedError()
  }
}

export async function updateLastPostOnThread ({
  operation,
  context,
  updatedItem,
  actions: { query }
}) {
  // Ignore operations other than create and delete
  if (operation !== 'create' && operation !== 'delete') return

  const user = context.authedItem

  const { errors: updateErrors } = await query(`
    mutation($threadID: ID!, $newDate: String!, $poster: UserRelateToOneInput!) {
      updateThread(id: $threadID, data: { lastPost: $newDate, lastPoster: $poster }) { id }
    }`,
  {
    skipAccessControl: true,
    variables: {
      newDate: `${updatedItem.createdAt}`,
      poster: { connect: { id: `${user.id}` } },
      threadID: `${updatedItem.thread}`
    }
  }
  )
}

export async function setPostNumber ({
  operation,
  context,
  updatedItem,
  resolvedData,
  actions: { query }
}) {
  if (operation !== 'create') return resolvedData

  // NOTE: this function may assign the same post number if two posts are made at the same time
  // unsure if that is actually the case, the window for this should be tiny
  const { data, errors } = await query(`
  query($threadID: ID!) {
    Thread(where: { id: $threadID }) {
      _postsMeta {
        count
      }
    }
  }
  `, {
    skipAccessControl: true,
    variables: { threadID: `${resolvedData.thread}` }
  })

  const count = (data && data.Thread && data.Thread._postsMeta && data.Thread._postsMeta.count) || 0

  return { ...resolvedData, postNumber: count + 1 }
}
