import { useForm, ErrorMessage } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Link from 'next/link'
import Loader from 'react-loader-spinner'

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

const validImageTypes = 'image/gif, image/jpeg, image/jpg, image/png'

const SignupForm = () => {
  const router = useRouter()
  const { addToast } = useToasts()
  const { register, handleSubmit, errors: formErrors, watch, getValues, triggerValidation } = useForm({
    defaultValues: { avatar: '' }
  })
  const password = useRef({})
  password.current = watch('password', '')
  const files = watch('avatar')

  const [avatarPreview, setAvatarPreview] = useState()

  useEffect(() => {
    if (files && files[0]) {
      triggerValidation('avatar')
      if (!formErrors?.avatar?.message) {
        const imgUrl = URL.createObjectURL(files[0])
        setAvatarPreview(imgUrl)
      } else {
        setAvatarPreview(null)
      }
    }
  }, [files, files[0], formErrors?.avatar?.message])

  const [nameCheck, { data: nameData }] = useLazyQuery(USERNAME_QUERY)
  const [emailCheck, { data: emailData }] = useLazyQuery(EMAIL_QUERY)

  const [createUser, { loading: mutationLoading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      addToast('Successfully registered!', { appearance: 'success' })
      router.push('/signin')
    },
    onError: () => addToast('Couldn\'t register user, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ name, email, password }) => {
    if (Object.keys(formErrors).length === 0) {
      createUser({
        variables: { data: { name, displayName: name, email, password, avatar: files[0] } }
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
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4">Avatar</label>
          <div className="flex p-4 items-center">
            <div className="flex mr-4">
              {avatarPreview ? (
                <img className={'max-w-none my-2 w-12 md:w-32 lg:w-48 h-12 md:h-32 lg:h-48'} src={avatarPreview} alt="" />
              ) : (
                <svg className={'my-2 w-12 md:w-32 lg:w-40 rounded-full fill-current'} width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className={'text-pink-400'} cx="79.5" cy="79.5" r="79.5" />
                  <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                  <circle cx="96" cy="59" r="43" fill="white" />
                </svg>
              )}
            </div>
            <input onChange={() => getValues('avatar')} accept={validImageTypes} type="file" ref={register({
              validate: {
                fileHasToExist: value => (value[0] ? value[0] : false) || '⚠ Invalid file.',
                largerThan5MB: value => value[0].size < 5 * 1024 * 1024 || '⚠ Avatar cannot exceed 5MB.',
                wrongFileType: value => (value[0].type && validImageTypes.indexOf(`${value[0].type}`) > 0) || '⚠ Please provide a valid image type: GIF, JPG, or PNG.'
              }
            })} name="avatar" />
          </div>
          {formErrors.avatar && (<span className="text-sm text-red-600">{formErrors.avatar.message}</span>)}
          <div className="flex items-center mt-8">
            <input className={`${mutationLoading ? 'bg-pink-100' : 'bg-pink-400'} border border-pink-400 ${mutationLoading ? 'text-pink-200' : 'text-white'} font-bold text-lg ${mutationLoading ? '' : 'hover:bg-pink-700 hover:border-pink-700'} p-2 rounded mr-4`}
              type="submit" value="Sign Up" disabled={!!mutationLoading} />
            {mutationLoading && (
              <Loader type="ThreeDots" color="#f687b3" width={40} height={40} />
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignupForm
