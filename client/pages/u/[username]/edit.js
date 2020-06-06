import { useQuery, gql } from '@apollo/client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useUser } from 'hooks/useUser'

import { USER_QUERY } from 'pages/u/[username]'
import LoadingSpinner from 'components/LoadingSpinner'
import EditUser from 'components/EditUser'

const Error = dynamic(() => import('components/Error'))
const NotFound = dynamic(() => import('components/404'))

const Edit = () => {
  const router = useRouter()
  const loggedIn = useUser()

  const { username } = router.query
  const { data, loading, error } = useQuery(USER_QUERY, { variables: { username } })
  if (loading) {
    return <LoadingSpinner />
  } else if (data?.allUsers[0]) {
    const user = data.allUsers[0]

    if (!loggedIn || (loggedIn.id !== user.id && !loggedIn.isAdmin)) {
      router.push('/u/[username]', `/u/${user?.name}`)
      return <LoadingSpinner />
    }

    return (
      <EditUser user={user} />
    )
  } else if (error) {
    return <Error />
  } else {
    return <NotFound />
  }
}

export default Edit
