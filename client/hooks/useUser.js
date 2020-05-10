import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedUser {
      id
      name
      displayName
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
