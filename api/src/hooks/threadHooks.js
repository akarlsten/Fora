import { AccessDeniedError, ForumBannedError, NoPostsError } from './errors'

export async function threadHasNoPosts ({ operation, resolvedData, existingItem, actions: { query } }) {
  // with new threads, check that post arent empty
  if (!existingItem) {
    // check for both absence of the field and if the array is length 0
    if (!resolvedData.posts || resolvedData.posts.length < 1) {
      throw new NoPostsError()
    }
  }
}

export async function userIsBanned ({ resolvedData, existingItem, context, actions: { query } }) {
  const user = context.authedItem
  const forum = (existingItem && existingItem.forum) || resolvedData.forum

  if (user.isAdmin) {
    return
  }

  const queryString = `
          query ($forumID: ID!) {
            Forum(where: { id: $forumID}) {
              bannedUsers {
                id
              }
            }
          }
          `

  const options = {
    skipAccessControl: true,
    variables: {
      forumID: `${forum}`
    }
  }

  const { data } = await query(queryString, options)

  if (data.Forum.bannedUsers.some(banned => banned.id === user.id) || user.isGlobalBanned) {
    throw new AccessDeniedError()
  }
}

export async function forumIsBanned ({ resolvedData, existingItem, context, actions: { query } }) {
  const user = context.authedItem

  if (!resolvedData.forum) {
    return
  }

  const forum = (existingItem && existingItem.forum) || resolvedData.forum

  if (user.isAdmin) {
    return
  }

  const queryString = `
          query ($forumID: ID!) {
            Forum(where: { id: $forumID}) {
              isBanned
            }
          }
          `

  const options = {
    skipAccessControl: true,
    variables: {
      forumID: forum
    }
  }

  const { data } = await query(queryString, options)

  if (data.Forum.isBanned) {
    throw new ForumBannedError()
  }
}

export async function userIsForumAdminModeratorOrOwner ({ existingItem, context, actions: { query } }) {
  const user = context.authedItem

  if (user.isAdmin) {
    return
  }

  const queryString = `
          query ($forumID: ID!) {
            Forum(where: { id: $forumID}) {
              name
              owner {
                id
              }
              moderators {
                id
              }
            }
          }
          `

  const options = {
    skipAccessControl: true,
    variables: {
      forumID: `${existingItem.forum}`
    }
  }

  const { data, errors } = await query(queryString, options)

  if (!data.Forum.moderators.some(moderator => moderator.id === user.id || !data.Forum.owner.id === user.id)) {
    throw new AccessDeniedError()
  }
}
