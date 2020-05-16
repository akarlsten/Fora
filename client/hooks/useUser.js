import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedUser {
      id
      name
      displayName
      isAdmin
      isGlobalBanned
      avatar {
        publicUrlTransformed(transformation: {
        width:"100",
        height:"100",
        crop:"fill",
        gravity:"center"
      })
      }
      subscriptions {
        id
      }
    }
  }
`

function useUser () {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY)
  if (data) {
    return data.authenticatedUser
  }
}

export { CURRENT_USER_QUERY, useUser }
