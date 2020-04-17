// Access control functions
export function userIsAdmin ({ authentication: { item: user } }) {
  return Boolean(user && user.isAdmin)
}

export function userOwnsThing ({ authentication: { item: user }, existingItem }) {
  if (!user) {
    return false
  }

  return {
    owner: { id: user.id }
  }
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

export function userIsModerator ({ authentication: { item: user }, itemId, itemIds }) {
  /*
  @Adam Karlsten I have the function for list and field level but I add this
if (existingItem) {
    return existingItem[fieldName] === user.id || existingItem.public === true;
  }
before I do the where return.
This will allow you to check on the field level if the person is a moderator and make the change.
You should be able to access fieldKey on a field access control and do this check
(ie - if existing item and the user is moderator, approve if fieldKey is isPrivate)
  */
  console.log(itemId)
  console.log(itemIds)
  if (!user) {
    return false
  }

  return {
    moderators_some: {
      id: user.id
    }
  }
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
