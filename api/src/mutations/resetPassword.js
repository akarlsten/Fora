// https://github.com/wesbos/advanced-react-rerecord/blob/master/backend/mutations/resetPassword.js
export async function resetPassword (parent, args, ctx, info, { query }) {
  if (args.password !== args.confirmPassword) {
    throw new Error("Passwords don't match!")
  }

  const userResponse = await query(`query {
    allUsers(where: {
      resetToken: "${args.resetToken}",
    }) {
      id
      resetTokenExpiry
    }
  }`)
  const [user] = userResponse.data.allUsers
  if (!user) {
    throw new Error('This token is invalid.')
  }

  const now = Date.now()
  const expiry = new Date(user.resetTokenExpiry).getTime()
  if (now - expiry > 3600000) {
    throw new Error('This token is expired')
  }

  const updatedUserResponse = await query(`
    mutation {
      updateUser(
        id: "${user.id}",
        data: {
          password: "${args.password}",
          resetToken: null,
          resetTokenExpiry: null,
        }
      ) {
        password_is_set
        name
      }
    }
  `, { skipAccessControl: true })
  const { errors, data } = updatedUserResponse
  if (errors) {
    throw new Error(errors)
  }

  return {
    message: 'Your password has been reset'
  }
}
