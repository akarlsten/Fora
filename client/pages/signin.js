import Signin from '../components/Signin'
import { useEffect } from 'react'
import { useTheme } from '../context/ColorContext'

const SignupPage = props => {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('pink')
  }, [])

  return (
    <div>
      <Signin />
    </div>
  )
}

export default SignupPage
