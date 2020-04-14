// Access control functions
export function userIsAdmin ({ authentication: { item: user } }) {
  return Boolean(user && user.isAdmin)
}

export function userOwnsThing ({ authentication: { item: user }, itemId }) {
  if (!user) {
    return false
  }

  return {
    // queries if this forum (itemId) is owned by the currently logged in user
    id: itemId,
    owner: { id: user.id }
  }
}

export function userOwnsItem ({ authentication: { item: user } }) {
  if (!user) {
    return false
  }
  // This returns a graphql Where object, not a boolean
  console.log(user)
  return { user: { id: user.id } }
}

// This will check if the current user is requesting information about themselves
export function userIsUser ({ authentication: { item: user } }) {
  return user && { id: user.id }
}

export function userIsLoggedIn ({ authentication: { item: user } }) {
  return !!user
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
