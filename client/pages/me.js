import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import PleaseSignIn from 'components/PleaseSignIn'
import UserDetails from 'components/UserDetails'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'
import Signin from 'components/Signin'

import { useUser } from 'hooks/useUser'

export const DETAILED_USER_QUERY = gql`
  query {
    authenticatedUser {
      id
      name
      email
      displayName
      isAdmin
      isGlobalBanned
      avatar {
        publicUrlTransformed(transformation: {
        width:"300",
        height:"300",
        crop:"fill",
        gravity:"center"
      })
      }
      subscriptions {
        id
        name
      }
      _postsMeta {
        count
      }
    }
  }
`

const Me = () => {
  const { data, loading, error } = useQuery(DETAILED_USER_QUERY)
  if (loading) {
    return <LoadingSpinner />
  } else if (data) {
    const user = data.authenticatedUser
    return (
      <UserDetails user={user} />
    )
  } else {
    return <Error />
  }
}

export default Me
