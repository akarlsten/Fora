import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PleaseSignIn from 'components/PleaseSignIn'
import NotFound from 'components/404'
import EditForum from 'components/EditForum'
import ThreadForm from 'components/ThreadForm'

const Action = () => {
  const router = useRouter()
  const { url, action } = router.query

  if (action === 'post') {
    return (
      <PleaseSignIn>
        <ThreadForm />
      </PleaseSignIn >
    )
  } else if (action === 'edit') {
    return (
      <PleaseSignIn>
        <EditForum />
      </PleaseSignIn>)
  } else {
    return <NotFound />
  }
}

export default Action
