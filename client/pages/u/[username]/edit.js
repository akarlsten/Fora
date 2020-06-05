import { useQuery, gql } from '@apollo/client'
import dynamic from 'next/dynamic'

import LoadingSpinner from 'components/LoadingSpinner'
import EditUser from 'components/EditUser'

const Error = dynamic(() => import('components/Error'))

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
        url
        colorScheme
        icon {
          publicUrlTransformed(transformation: {
            width:"200",
            height:"200",
            crop:"fill",
            gravity:"center"
          })
        }
      }
      _postsMeta {
        count
      }
    }
  }
`

const EditSelf = () => {
  const { data, loading, error } = useQuery(DETAILED_USER_QUERY)
  if (loading) {
    return <LoadingSpinner />
  } else if (data) {
    const user = data.authenticatedUser
    return (
      <EditUser user={user} />
    )
  } else {
    return <Error />
  }
}

export default EditSelf
