import { useQuery } from '@apollo/client'

import { useUser } from 'hooks/useUser'
import PleaseSignIn from 'components/PleaseSignIn'
import { DETAILED_USER_QUERY } from 'pages/me'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'
import Signin from 'components/Signin'
import EditUser from 'components/EditUser'

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
