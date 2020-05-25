import { useForm, ErrorMessage } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Link from 'next/link'
import Loader from 'react-loader-spinner'

import ImageSelector from 'components/ImageSelector'

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
  const { register, handleSubmit, errors: formErrors, watch, getValues, triggerValidation } = useForm()
  const password = useRef({})
  password.current = watch('password', '')

  const [nameCheck, { data: nameData }] = useLazyQuery(USERNAME_QUERY)
  const [emailCheck, { data: emailData }] = useLazyQuery(EMAIL_QUERY)

  const [createUser, { loading: mutationLoading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      addToast('Successfully registered!', { appearance: 'success' })
      router.push('/signin')
    },
    onError: () => addToast('Couldn\'t register user, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ name, email, password, image }) => {
    if (Object.keys(formErrors).length === 0) {
      if (image && image[0]) {
        createUser({
          variables: { data: { name, displayName: name, email, password, avatar: image[0] } }
        })
      } else {
        createUser({
          variables: { data: { name, displayName: name, email, password } }
        })
      }
    }
  }
  return (
    <div className="container mx-auto flex flex-col items-center">
      <h1 className="text-3xl mb-4 text-gray-700">Sign up to start posting!</h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
          <div className="px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">Username</label>
            <input ref={register({
              minLength: { value: 1, message: '⚠ Username must have at least 1 character.' },
              maxLength: { value: 20, message: '⚠ Username can be at most 20 characters long.' },
              required: '⚠ You need to enter a username.',
              validate: async value => {
                await nameCheck({ variables: { name: value } })
                if (nameData?.allUsers?.length > 0) {
                  return '⚠ Username already taken.'
                }
              }
            })}
            className="form-input block sm:w-full" name="name" type="text" />
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
              className="form-input block sm:w-full" name="email" type="text" />
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
              className="form-input block sm:w-full" name="password" type="password" />
              {formErrors.password && (<span className="text-sm text-red-600">{formErrors.password.message}</span>)}
            </div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Confirm Password</label>
            <div>
              <input ref={register({
                validate: value =>
                  value === password.current || '⚠ The passwords do not match'
              })}
              className="form-input block sm:w-full" name="confirm" type="password" />
              {formErrors.confirm && (<span className="text-sm text-red-600">{formErrors.confirm.message}</span>)}
            </div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4">Avatar</label>
            <ImageSelector
              getValues={getValues}
              watch={watch}
              triggerValidation={triggerValidation}
              formErrors={formErrors}
              register={register}
            />
            <div className="flex items-center mt-8">
              <input className={`${mutationLoading ? 'bg-pink-100' : 'bg-pink-400'} border border-pink-400 ${mutationLoading ? 'text-pink-200' : 'text-white'} font-bold text-lg ${mutationLoading ? '' : 'hover:bg-pink-700 hover:border-pink-700'} p-2 rounded mr-4`}
                type="submit" value="Sign Up" disabled={!!mutationLoading} />
              {mutationLoading && (
                <Loader type="ThreeDots" color="#f687b3" width={40} height={40} />
              )}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default SignupForm
