import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY } from '../hooks/useUser'

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    unauthenticateUser {
      success
    }
  }
`

function SignoutButton () {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  })
  return (
    <button className="flex items-center font-medium text-gray-800 transition duration-100 ease-in-out transform hover:scale-105" type="button" onClick={signout}>
      <svg className="text-gray-500 fill-current w-5 h-5 mr-1" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
      Sign Out
    </button>
  )
}
export default SignoutButton
