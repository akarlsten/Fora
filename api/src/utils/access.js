// Access control functions
export function userIsAdmin ({ authentication: { item: user } }) {
  return Boolean(user && user.isAdmin)
}

export function userOwnsThing ({ authentication: { item: user }, existingItem }) {
  // TODO: Look into why this doesnt work with Posts, existingItem = undefined
  return user && user.id === `${existingItem.owner}`
  // {
  //   owner: { id: user.id }
  // }
}

// export function userOwnsItem ({ authentication: { item: user } }) {
//   if (!user) {
//     return false
//   }
//   // This returns a graphql Where object, not a boolean
//   console.log(user)
//   return { user: { id: user.id } }
// }

// This will check if the current user is requesting information about themselves
export function userIsUser ({ authentication: { item: user } }) {
  return user && { id: user.id }
}

export function userIsLoggedIn ({ authentication: { item: user } }) {
  return !!user
}

export function userIsModerator ({ authentication: { item: user } }) {
  if (!user) {
    return false
  }

  return {
    moderators_some: {
      id: user.id
    }
  }
}

export function forumIsBanned ({ existingItem }) {
  return Boolean(existingItem && existingItem.isBanned)
}

export function userIsAdminOrForumNotBanned (auth) {
  const isAdmin = userIsAdmin(auth)
  const isBanned = forumIsBanned(auth)

  return isAdmin || !isBanned
}

export function userIsAdminModeratorOrOwner (auth) {
  const isAdmin = userIsAdmin(auth)
  const isOwner = userOwnsThing(auth)
  const isModerator = userIsModerator(auth)

  return isAdmin || isOwner || isModerator
}

export function userIsAdminOrOwner (auth) {
  const isAdmin = userIsAdmin(auth)
  const isOwner = userOwnsThing(auth)

  return isAdmin || isOwner
}

export function userCanAccessUsers (auth) {
  const isAdmin = userIsAdmin(auth)
  const isThemselves = userIsUser(auth)
  return isAdmin || isThemselves
}
