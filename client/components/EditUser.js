import { useForm } from 'react-hook-form'
import { useUser } from 'hooks/useUser'
import { useRouter } from 'next/router'
import { useRef, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Loader from 'react-loader-spinner'
import Link from 'next/link'

import { USER_QUERY } from 'pages/u/[username]'
import { SIGNIN_MUTATION } from 'components/Signin'

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

const UPDATE_USER = gql`
mutation UPDATE_USER($id: ID!, $data: UserUpdateInput!) {
  updateUser(id: $id, data: $data) {
    id
  }
}
`

const EditUser = ({ user }) => {
  const loggedIn = useUser()
  const router = useRouter()
  const { addToast } = useToasts()

  // NOTE: 2 forms on this page, one for passwords and one for the rest of the info
  const { register, handleSubmit, errors: formErrors, watch, getValues, triggerValidation } = useForm()
  const { register: register2, handleSubmit: handleSubmit2, errors: passwordErrors, watch: watch2 } = useForm()
  const password = useRef({})
  password.current = watch2('password', '')

  const [nameCheck, { data: nameData }] = useLazyQuery(USERNAME_QUERY)
  const [emailCheck, { data: emailData }] = useLazyQuery(EMAIL_QUERY)

  const [updateUser, { loading: mutationLoading }] = useMutation(UPDATE_USER, {
  /* TODO: add USER_QUERY for other users here later */
    refetchQueries: [{ query: USER_QUERY, variables: { username: user?.name } }],
    onCompleted: () => {
      addToast('Updated user!', { appearance: 'success' })
    },
    onError: () => addToast('Couldn\'t update user, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onInfoSubmit = ({ name, displayName, image }) => {
    if (Object.keys(formErrors).length === 0) {
      if (image && image[0]) {
        if (name) {
          updateUser({
            variables: { id: user.id, data: { name, displayName, avatar: image[0] } }
          })
        } else {
          updateUser({
            variables: { id: user.id, data: { displayName, avatar: image[0] } }
          })
        }
      } else {
        if (name) {
          updateUser({
            variables: { id: user.id, data: { name, displayName } }
          })
        } else {
          updateUser({
            variables: { id: user.id, data: { displayName } }
          })
        }
      }
    }
  }

  const [updatePassword, { loading: pwMutationLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      addToast('Password changed!', { appearance: 'success' })
    },
    onError: () => addToast('Couldn\'t change password, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const [signin, { data: signinData, error: signinError }] = useMutation(SIGNIN_MUTATION, {
    onError: () => addToast('Couldn\'t confirm your old password, make sure you\'ve entered it correctly!', { appearance: 'error', autoDismiss: true })
  })

  const onPasswordSubmit = async ({ password, email, old }) => {
    if (Object.keys(passwordErrors).length === 0) {
      await signin({ variables: { email: user.email, password: old } })

      if (signinData?.authenticateUserWithPassword?.item) {
        if (password) {
          if (email) {
            updatePassword({
              variables: { id: user.id, data: { password, email } }
            })
          } else {
            updatePassword({
              variables: { id: user.id, data: { password } }
            })
          }
        } else if (email) {
          updatePassword({
            variables: { id: user.id, data: { email } }
          })
        }
      }
    }
  }

  const handleBan = (banned) => {
    if (loggedIn?.id !== user.id) {
      updateUser({
        variables: { id: user.id, data: { isGlobalBanned: !banned } }
      })
    } else {
      addToast('You cant globally ban yourself!', { appearance: 'error', autoDismiss: true })
    }
  }

  if (!user || !loggedIn) {
    router.push('/u/[username]', `/u/${user?.name}`)
  }

  const watchUsername = watch('name')
  const watchEmail = watch('email')

  useEffect(() => {
    if (watchUsername?.length >= 1) {
      triggerValidation('name')
    }
  }, [nameData])

  useEffect(() => {
    if (watchEmail?.length >= 1) {
      triggerValidation('email')
    }
  }, [emailData])

  return (
    <>
      <Link href="/u/[username]" as={`/u/${user?.name}`}>
        <div className="flex text-base items-center mb-8 cursor-pointer self-start">
          <svg className="w-8 h-8" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          {user?.avatar?.publicUrlTransformed ? (
            <img className="w-8 h-8 rounded-full mr-1" src={user?.avatar?.publicUrlTransformed} alt="" />
          ) : (
            <svg className="w-8 h-8 rounded-full mr-1 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className={'text-pink-400'} cx="79.5" cy="79.5" r="79.5" />
              <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
              <circle cx="96" cy="59" r="43" fill="white" />
            </svg>
          )}
          <div className="flex items-center justify-between w-full">
            <h1 className="font-bold text-lg">{user?.displayName} <span className="text-base font-medium text-gray-700">@{user?.name}</span></h1>
          </div>
        </div>
      </Link>
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-3xl mb-4 text-gray-700">Edit Details</h1>
        <form className="w-full max-w-lg" onSubmit={handleSubmit(onInfoSubmit)}>
          <fieldset disabled={mutationLoading || pwMutationLoading} aria-busy={mutationLoading || pwMutationLoading}>
            <div className="px-3">
              {loggedIn?.isAdmin && (
                <>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold " htmlFor="title">Username</label>
                  <p className="text-xs mb-2">This field is only available to admins. Try to avoid changing usernames unless absolutely necessary, note that after saving a change here this page will 404.</p>
                  <input onChange={(e) => {
                    if (e.target.value.length >= 1) {
                      triggerValidation('name')
                    }
                  }} ref={register({
                    minLength: { value: 1, message: '⚠ Username must have at least 1 character.' },
                    maxLength: { value: 20, message: '⚠ Username can be at most 20 characters long.' },
                    required: '⚠ You need to enter a username.',
                    validate: {
                      notTaken: async value => {
                        if (user.name !== value) {
                          await nameCheck({ variables: { name: value } })
                          if (nameData?.allUsers?.length > 0) {
                            return '⚠ Username already taken.'
                          }
                        }
                      },
                      trimmed: value => value.trim().length >= 1 || '⚠ Username must have at least 1 character.'
                    }
                  })}
                  className="form-input block sm:w-full" name="name" defaultValue={user?.name} type="text" />
                  {formErrors.name && (<span className="text-sm text-red-600">{formErrors.name.message}</span>)}
                </>
              )}
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="title">Display Name</label>
              <input onChange={(e) => {
                if (e.target.value.length >= 1) {
                  triggerValidation('displayName')
                }
              }} ref={register({
                minLength: { value: 1, message: '⚠ Display name must have at least 1 character.' },
                maxLength: { value: 50, message: '⚠ Display name can be at most 50 characters long.' },
                validate: {
                  trimmed: value => value.trim().length >= 1 || '⚠ Display name must have at least 1 character.'
                }
              })}
              className="form-input block sm:w-full" defaultValue={user?.displayName} name="displayName" type="text" />
              {formErrors.displayName && (<span className="text-sm text-red-600">{formErrors.displayName.message}</span>)}
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4">Avatar</label>
              <ImageSelector
                oldImage={user?.avatar?.publicUrlTransformed}
                getValues={getValues}
                watch={watch}
                triggerValidation={triggerValidation}
                formErrors={formErrors}
                register={register}
              />
              <div className="flex items-center mt-8">
                <input className={`${mutationLoading ? 'bg-pink-100' : 'bg-pink-400'} border border-pink-400 ${mutationLoading ? 'text-pink-200' : 'text-white'} font-medium text-lg ${mutationLoading ? '' : 'hover:bg-pink-700 hover:border-pink-700'} p-2 rounded mr-4`}
                  type="submit" value="Update Info" disabled={!!mutationLoading} />
                {loggedIn?.isAdmin && loggedIn?.id !== user.id && (
                user?.isGlobalBanned ? (
                  <button onClick={() => handleBan(user?.isGlobalBanned)} className={'bg-green-400 mr-4 font-medium text-white text-lg hover:bg-green-700 p-2 rounded'}>
                    Unban User
                  </button>
                ) : (
                  <button onClick={() => handleBan(user?.isGlobalBanned)} className={'bg-red-400 mr-4 font-medium text-white text-lg hover:bg-red-700 p-2 rounded'}>
                      Ban User
                  </button>
                ))}
                {mutationLoading && (
                  <Loader type="ThreeDots" color="#f687b3" width={40} height={40} />
                )}
              </div>
            </div>
          </fieldset>
        </form>
        {loggedIn?.id === (user && user.id) && (
          <>
            <h1 className="text-2xl mt-20 text-gray-700">Change Password</h1>
            <form className="w-full max-w-lg" onSubmit={handleSubmit2(onPasswordSubmit)}>
              <fieldset disabled={mutationLoading || pwMutationLoading} aria-busy={mutationLoading || pwMutationLoading}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Email</label>
                <div>
                  <input ref={register2({
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: '⚠ Invalid email address.'
                    },
                    required: '⚠ You must enter an e-mail.',
                    validate: async value => {
                      if (user.email !== value) {
                        await emailCheck({ variables: { email: value } })
                        if (emailData?.allUsers?.length > 0) {
                          return '⚠ Email already in use!'
                        }
                      }
                    }
                  })}
                  className="form-input block sm:w-full" defaultValue={user?.email} name="email" type="text" />
                  {passwordErrors.email && (<span className="text-sm text-red-600">{passwordErrors.email.message}</span>)}
                </div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Password</label>
                <div>
                  <input ref={register2({
                    minLength: {
                      value: 8,
                      message: '⚠ Password must have at least 8 characters'
                    }
                  })}
                  className="form-input block sm:w-full" autoComplete="new-password" name="password" type="password" />
                  {passwordErrors.password && (<span className="text-sm text-red-600">{passwordErrors.password.message}</span>)}
                </div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Confirm Password</label>
                <div>
                  <input ref={register2({
                    validate: value =>
                      value === password.current || '⚠ The passwords do not match'
                  })}
                  className="form-input block sm:w-full" name="confirm" type="password" />
                  {passwordErrors.confirm && (<span className="text-sm text-red-600">{passwordErrors.confirm.message}</span>)}
                </div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1 mt-12" htmlFor="post">Current Password</label>
                <p className="text-xs mb-2">You need to enter your current password to make changes to email or password.</p>
                <div>
                  <input ref={register2({
                    required: '⚠ You must enter a password'
                  })}
                  className="form-input block sm:w-full" autoComplete="new-password" name="old" type="password" />
                  {passwordErrors.old && (<span className="text-sm text-red-600">{passwordErrors.old.message}</span>)}
                </div>
                <div className="flex items-center mt-8">
                  <input className={`${pwMutationLoading ? 'bg-pink-100' : 'bg-pink-400'} border border-pink-400 ${pwMutationLoading ? 'text-pink-200' : 'text-white'} font-medium text-lg ${pwMutationLoading ? '' : 'hover:bg-pink-700 hover:border-pink-700'} p-2 rounded mr-4`}
                    type="submit" value="Change Details" disabled={!!pwMutationLoading || !!mutationLoading} />
                  {pwMutationLoading && (
                    <Loader type="ThreeDots" color="#f687b3" width={40} height={40} />
                  )}
                </div>
              </fieldset>
            </form>
          </>
        )}
      </div>
    </>
  )
}

export default EditUser
