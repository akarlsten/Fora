import { useForm, ErrorMessage } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Link from 'next/link'

const EMAIL_QUERY = gql`
query EMAIL_QUERY($email: String!) {
  allUsers(where: {email: $email}) {
    id
  }
}
`
const USERNAME_QUERY = gql`
query USERNAME_QUERY($name: String!) {
  allUsers(where: {name: $name }) {
    id
  }
}
`

const CREATE_USER = gql`
mutation CREATE_USER($data: UserCreateInput!) {
  createUser(data: $data) {
    id
  }
}
`

const SignupForm = () => {
  const router = useRouter()
  const { addToast } = useToasts()
  const { register, handleSubmit, errors: formErrors, watch } = useForm()
  const password = useRef({})
  password.current = watch('password', '')

  const [nameCheck, { data: nameData }] = useLazyQuery(USERNAME_QUERY)
  const [emailCheck, { data: emailData }] = useLazyQuery(EMAIL_QUERY)

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      addToast('Successfully registered!', { appearance: 'success' })
      router.push('/signin')
    },
    onError: () => addToast('Couldn\'t register user, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ name, email, password }) => {
    if (Object.keys(formErrors).length === 0) {
      createUser({
        variables: { data: { name, displayName: name, email, password } }
      })
    }
  }
  return (
    <div className="container mx-auto flex flex-col items-center">
      <h1 className="text-3xl mb-4 text-gray-700">Sign up to start posting!</h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">Username</label>
          <input ref={register({
            minLength: { value: 1, message: '⚠ Username must have at least 1 character.' },
            maxLength: { value: 20, message: '⚠ Username can be at most 20 characters long.' },
            required: '⚠ You need to enter a username.',
            validate: async value => {
              nameCheck({ variables: { name: value } })
              if (nameData?.allUsers?.length > 0) {
                return '⚠ Username already taken.'
              }
            }
          })}
          className="form-input block w-full" name="name" type="text" />
          {formErrors.name && (<span className="text-sm text-red-600">{formErrors.name.message}</span>)}
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Email</label>
          <div>
            <input ref={register({
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: '⚠ Invalid email address.'
              },
              required: '⚠ You must enter an e-mail.',
              validate: async value => {
                await emailCheck({ variables: { email: value } })
                if (emailData?.allUsers?.length > 0) {
                  return '⚠ Email already in use!'
                }
              }
            })}
            className="form-input block w-full" name="email" type="text" />
            {formErrors.email && (<span className="text-sm text-red-600">{formErrors.email.message}</span>)}
          </div>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Password</label>
          <div>
            <input ref={register({
              required: '⚠ You must specify a password',
              minLength: {
                value: 8,
                message: '⚠ Password must have at least 8 characters'
              }
            })}
            className="form-input block w-full" name="password" type="password" />
            {formErrors.password && (<span className="text-sm text-red-600">{formErrors.password.message}</span>)}
          </div>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Confirm Password</label>
          <div>
            <input ref={register({
              validate: value =>
                value === password.current || '⚠ The passwords do not match'
            })}
            className="form-input block w-full" name="confirm" type="password" />
            {formErrors.confirm && (<span className="text-sm text-red-600">{formErrors.confirm.message}</span>)}
          </div>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Avatar</label>
          <div>

          </div>
          <input className={'bg-pink-400 mx-auto text-white font-bold text-lg hover:bg-pink-700 p-2 mt-8 rounded'}
            type="submit" value="Sign Up" />
        </div>
      </form>
    </div>
  )
}

export default SignupForm
