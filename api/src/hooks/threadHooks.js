import { createError } from 'apollo-errors'

const AccessDeniedError = createError('AccessDeniedError', {
  message: 'You do not have access to this resource',
  options: { showPath: true }
})

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
      forumID: forum
    }
  }

  const { data } = await query(queryString, options)

  if (data.Forum.bannedUsers.some(banned => banned.id === user.id)) {
    throw new AccessDeniedError()
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
      forumID: existingItem.forum
    }
  }

  const { data, errors } = await query(queryString, options)

  console.log(errors)

  if (!data.Forum.moderators.some(moderator => moderator.id === user.id || !data.Forum.owner.id === user.id)) {
    throw new AccessDeniedError()
  }
}

export async function threadIsOpen ({ existingItem }) {

}
