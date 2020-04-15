import { networkedGraphqlRequest } from '@keystonejs/test-utils'

export default function login (app, email, password) {
  return networkedGraphqlRequest({
    app,
    query: `
      mutation($email: String, $password: String) {
        authenticateUserWithPassword(email: $email, password: $password) {
          token
          item {
            id
          }
        }
      }
    `,
    variables: { email, password }
  }).then(({ data }) => {
    return data.authenticateUserWithPassword || {}
  })
}
