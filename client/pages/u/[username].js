import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import UserDetails from 'components/UserDetails'
import LoadingSpinner from 'components/LoadingSpinner'

const NotFound = dynamic(() => import('components/404'))
const Error = dynamic(() => import('components/Error'))

const USER_QUERY = gql`
query USER_QUERY($username: String!) {
  allUsers(where: { name: $username}) {
    id
    name
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

const UserDetailsPage = () => {
  const router = useRouter()

  const { username } = router.query

  const { data, loading, error } = useQuery(USER_QUERY, { variables: { username } })
  if (loading) {
    return <LoadingSpinner />
  } else if (data) {
    const user = data.allUsers[0]
    return (
      <>
        <Head>
          <title>
          Fora | @{user.name}
          </title>
        </Head>
        <UserDetails user={user} />
      </>
    )
  } else if (error) {
    return <Error />
  } else {
    return <NotFound />
  }
}

export default UserDetailsPage
