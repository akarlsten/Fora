import { useUser } from 'hooks/useUser'
import Signin from 'components/Signin'

function PleaseSignIn ({ children }) {
  const me = useUser()
  // TODO Loading..
  if (!me) return <Signin />
  return children
}

export default PleaseSignIn
