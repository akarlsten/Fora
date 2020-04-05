// Access control functions
export function userIsAdmin ({ authentication: { item: user } }) {
  return Boolean(user && user.isAdmin)
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
  const isOwner = userOwnsItem(auth)
  console.log(isAdmin || isOwner)
  return isAdmin || isOwner
}

export function userCanAccessUsers (auth) {
  const isAdmin = userIsAdmin(auth)
  const isThemselves = userIsUser(auth)
  return isAdmin || isThemselves
}
