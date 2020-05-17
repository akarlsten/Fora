import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PleaseSignIn from '../../../../components/PleaseSignIn'
import NotFound from '../../../../components/404'
import EditForum from '../../../../components/EditForum'

const Action = () => {
  const router = useRouter()
  const { url, action } = router.query

  if (action === 'post') {

  } else if (action === 'edit') {
    return <EditForum />
  } else {
    return <NotFound />
  }
  return (
    <PleaseSignIn>
      <div>{action} on {url}</div>
    </PleaseSignIn>
  )
}

export default Action
