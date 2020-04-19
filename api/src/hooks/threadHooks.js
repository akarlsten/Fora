import { createError } from 'apollo-errors'

const AccessDeniedError = createError('AccessDeniedError', {
  message: 'You do not have access to this resource',
  options: { showPath: true }
})

export async function userIsAdminModeratorOrOwner ({ existingItem, context, actions: { query } }) {
  const user = context.authedItem
  if (!user) {
    throw new AccessDeniedError()
  }

  if (!!user.isAdmin || user.id === `${existingItem.owner}`) {
    return
  }

  const queryString = `
          query ($forumID: ID!) {
            Forum(where: { id: $forumID}) {
              name
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

  const { data } = await query(queryString, options)

  if (!data.Forum.moderators.some(moderator => moderator.id === user.id)) {
    throw new AccessDeniedError()
  }
}
