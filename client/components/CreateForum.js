import { useForm, ErrorMessage } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Link from 'next/link'
import Loader from 'react-loader-spinner'

import { useTheme } from 'context/ColorContext'
import colorConverter from 'lib/colorConverter'

import BackToForum from 'components/BackToForum'
import ColorSelector from 'components/ColorSelector'
import ImageSelector from 'components/ImageSelector'
import PleaseSignIn from 'components/PleaseSignIn'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'

import { FORUM_QUERY, SUBSCRIBED_QUERY } from 'pages/index'

const FORUM_NAME_QUERY = gql`
query FORUM_NAME_QUERY($name: String!) {
  allForums(where: {name_i: $name}) {
    id
  }
}
`

const CREATE_FORUM = gql`
mutation CREATE_FORUM($data: ForumCreateInput!) {
  createForum(data: $data) {
    id
    url
  }
}
`

const CreateForum = () => {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { addToast } = useToasts()
  const { url } = router.query

  const [nameInput, setNameInput] = useState('')

  const [forumNameCheck, { data: nameData }] = useLazyQuery(FORUM_NAME_QUERY)
  const { register, handleSubmit, errors: formErrors, watch, triggerValidation, getValues } = useForm()

  const [createForum, { loading: mutationLoading }] = useMutation(CREATE_FORUM, {
    refetchQueries: [{ query: FORUM_QUERY }, { query: SUBSCRIBED_QUERY }],
    onCompleted: ({ createForum: { url: forumUrl } }) => {
      addToast('Successfully created forum!', { appearance: 'success' })
      router.push('/f/[url]', `/f/${forumUrl}/`)
    },
    onError: () => addToast('Couldn\'t create forum, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ name, description, colorScheme, image }) => {
    if (Object.keys(formErrors).length === 0) {
      if (image && image[0]) {
        createForum({
          variables: { data: { name, description, colorScheme, icon: image[0] } }
        })
      } else {
        createForum({
          variables: { data: { name, description, colorScheme } }
        })
      }
    }
  }

  // TODO: add slug preview when typing name

  return (
    <PleaseSignIn>
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-3xl mb-4 text-gray-700">Create your community!</h1>
        <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">Name</label>
              <input onChange={(e) => {
                setNameInput(e.target.value.replace(/\W/g, ''))
                if (e.target.value.length >= 1) {
                  triggerValidation('name')
                }
              }} ref={register({
                minLength: { value: 1, message: '⚠ Forum name must have at least 1 character.' },
                maxLength: { value: 20, message: '⚠ Forum name can be at most 20 characters long.' },
                required: '⚠ You need to enter a forum name.',
                validate: {
                  notTaken: async value => {
                    forumNameCheck({ variables: { name: value } })
                    if (nameData?.allForums?.length > 0) {
                      return '⚠ A forum with this name already exists.'
                    }
                  },
                  trimmed: value => value.trim().length >= 1 || '⚠ Forum name must have at least 1 character.'
                }
              })} value={nameInput} className="form-input block w-full" name="name" type="text" />
              {formErrors.name && (<span className="text-sm text-red-600">{formErrors.name.message}</span>)}
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-2" htmlFor="description">Description</label>
              <textarea rows="4" ref={register({ minLength: 1, maxLength: 140 })} className="resize-none form-textarea block w-full" name="description" type="text" />
              {formErrors.description && (<span className="text-sm text-red-600">Description must be between 1 and 140 characters.</span>)}
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-2" htmlFor="color">Color Theme</label>
              <ColorSelector register={register} />
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4">Icon</label>
              <ImageSelector
                getValues={getValues}
                watch={watch}
                triggerValidation={triggerValidation}
                formErrors={formErrors}
                register={register} />
              <div className="flex align-start items-center mt-8">
                {!mutationLoading ? (
                  <input className={'bg-pink-400 mr-4 text-white font-medium text-lg hover:bg-\'pink\'-700 p-2 rounded'} type="submit" value="Create Forum" />
                ) : (
                  <>
                    <input className={'border border-gray-500 mr-4 text-gray-500 font-medium text-lg p-2 rounded'} type="submit" value="Creating.." />
                    <Loader type="ThreeDots" color={colorConverter('pink')} width={40} height={40} />
                  </>
                )}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </PleaseSignIn>
  )
}

export default CreateForum
