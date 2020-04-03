// Access control functions
export function userIsAdmin ({ authentication: { item: user } }) {
  return Boolean(user && user.isAdmin)
}

export function userOwnsPost ({ authentication: { item: user } }) {
  if (!user) {
    return false
  }
  // This returns a graphql Where object, not a boolean
  return { user: { id: user.id } }
}

// This will check if the current user is requesting information about themselves
export function userIsUser ({ authentication: { item: user } }) {
  return user && { id: user.id }
}

export function userIsAdminOrOwner (auth) {
  const isAdmin = userIsAdmin(auth)
  const isOwner = userOwnsPost(auth)
  return isAdmin || isOwner
}

export function userCanAccessUsers (auth) {
  const isAdmin = userIsAdmin(auth)
  const isThemselves = userIsUser(auth)
  return isAdmin || isThemselves
}
