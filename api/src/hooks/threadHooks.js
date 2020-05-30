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
      forumID: `${forum}`
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

export async function setPostsDeleted ({ existingItem, resolvedData, context, actions: { query } }) {
  const thread = (existingItem && existingItem.id) || resolvedData.id

  // only do this if the flag has actually changed
  if (existingItem.isDeleted !== resolvedData.isDeleted) {
    const queryString = `
          query ($threadID: ID!) {
            allPosts(where: { thread: { id: $threadID} }) {
              id
            }
          }
          `

    const options1 = {
      skipAccessControl: true,
      variables: {
        threadID: `${thread}`
      }
    }

    const { data: { allPosts: posts } } = await query(queryString, options1)

    const postsData = []
    posts.forEach(post => postsData.push({ id: post.id, data: { isDeleted: !!resolvedData.isDeleted } }))

    const mutationString = `
          mutation ($postsData: [PostsUpdateInput]) {
            updatePosts(data: $postsData) {
              id
              isDeleted
            }
          }
          `

    const options2 = {
      skipAccessControl: true,
      variables: {
        postsData: postsData
      }
    }

    await query(mutationString, options2)
  }
}

export async function setLastPost ({ operation, resolvedData, context }) {
  if (operation !== 'create') return resolvedData

  const user = context.authedItem

  const now = new Date()

  return { ...resolvedData, lastPost: `${now.toISOString()}`, lastPoster: user.id }
}
