import { useForm, ErrorMessage } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Link from 'next/link'
import Loader from 'react-loader-spinner'

import { useTheme } from 'context/ColorContext'
import colorConverter from 'lib/colorConverter'

import BackToForum from 'components/BackToForum'
import ColorSelector from 'components/ColorSelector'
import PleaseSignIn from 'components/PleaseSignIn'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'

const EDIT_FORUM_QUERY = gql`
query EDIT_FORUM_QUERY($url: String) {
  allForums(where: {
    url: $url
  }) {
    id
    name
    url
    description
    colorScheme
    isBanned
    bannedUsers {
      id
    }
    icon {
      publicUrlTransformed(transformation: {
        width:"200",
        height:"200",
        crop:"fill",
        gravity:"center"
      })
    }
    owner {
      id
      name
    }
    moderators {
      id
      name
    }
  }
}
`

const UPDATE_FORUM = gql`
mutation UPDATE_COLOR_DESC($forumID: ID!, $data: ForumUpdateInput!) {
  updateForum(id: $forumID, data: $data) {
    id
    description
    colorScheme
  }
}
`

export const validImageTypes = 'image/gif, image/jpeg, image/jpg, image/png'

const EditForum = () => {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { addToast } = useToasts()
  const { url } = router.query
  const { register, handleSubmit, errors: formErrors, watch, triggerValidation, getValues } = useForm()
  const files = watch('icon')

  const { data, loading, error } = useQuery(EDIT_FORUM_QUERY, {
    variables: { url }
  })

  const [iconPreview, setIconPreview] = useState()

  useEffect(() => {
    if (data?.allForums[0]?.colorScheme) {
      setTheme(data.allForums[0].colorScheme)
    }
    if (data?.allForums[0]?.icon?.publicUrlTransformed) {
      setIconPreview(data.allForums[0].icon.publicUrlTransformed)
    }
  }, [data])

  useEffect(() => {
    if (files && files[0]) {
      triggerValidation('icon')
      if (!formErrors?.icon?.message) {
        const imgUrl = URL.createObjectURL(files[0])
        setIconPreview(imgUrl)
      } else {
        setIconPreview(null)
      }
    }
  }, [files, files && files[0], formErrors?.icon?.message])

  const [updateDescrColor, { loading: mutationLoading }] = useMutation(UPDATE_FORUM, {
    refetchQueries: [{ query: EDIT_FORUM_QUERY, variables: { url } }],
    onCompleted: () => { addToast('Successfully updated forum!', { appearance: 'success' }) },
    onError: () => addToast('Couldn\'t update forum, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ description, colorScheme }) => {
    if (!formErrors.description && !formErrors.colorScheme && !formErrors.icon) {
      setTheme(colorScheme)
      if (files && files[0]) {
        updateDescrColor({
          variables: { forumID: data.allForums[0].id, data: { description, colorScheme, icon: files[0] } }
        })
      } else {
        updateDescrColor({
          variables: { forumID: data.allForums[0].id, data: { description, colorScheme } }
        })
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  } else if (data?.allForums[0]) {
    const forum = data.allForums[0]
    return (
      <PleaseSignIn>
        <div className="container mx-auto flex flex-col items-center">
          <BackToForum url={forum.url} iconUrl={forum.icon.publicUrlTransformed} color={forum.colorScheme} name={forum.name} />
          <h1 className="text-3xl mb-4 text-gray-700">Editing: <span className="font-semibold text-black">{forum.name}</span></h1>
          <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">Description</label>
                <textarea rows="4" ref={register({ minLength: 1, maxLength: 140 })} className="resize-none form-textarea block w-full" name="description" type="text" defaultValue={forum.description}/>
                {formErrors.description && (<span className="text-sm text-red-600">Description must be between 1 and 140 characters.</span>)}
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-2" htmlFor="color">Color Theme</label>
                <ColorSelector oldColor={forum.colorScheme} register={register} />
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4">Icon</label>
                <div className="flex p-4 flex-col sm:flex-row sm:items-center">
                  <div className="flex justify-center mb-4 sm:mb-0 mr-0 sm:mr-4">
                    {iconPreview ? (
                      <img className={'max-w-none my-2 w-24 md:w-32 lg:w-48 h-24 md:h-32 lg:h-48 rounded-full'} src={iconPreview} alt="" />
                    ) : (
                      <svg className={'my-2 w-24 md:w-32 lg:w-40 rounded-full fill-current'} width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className={`text-${forum.colorScheme}-400`} cx="79.5" cy="79.5" r="79.5" />
                        <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                        <circle cx="96" cy="59" r="43" fill="white" />
                      </svg>
                    )}
                  </div>
                  <input onChange={() => getValues('icon')} accept={validImageTypes} type="file" ref={register({
                    required: false,
                    validate: {
                      largerThan5MB: value => (!value[0] || value[0].size < 5 * 1024 * 1024) || '⚠ Avatar cannot exceed 5MB.',
                      wrongFileType: value => (!value[0] || validImageTypes.indexOf(`${value[0].type}`) > 0) || '⚠ Please provide a valid image type: GIF, JPG, or PNG.'
                    }
                  })} name="icon" />
                </div>
                {formErrors.icon && (<span className="text-sm text-red-600">{formErrors.icon.message}</span>)}
                <div className="flex align-start items-center mt-8">
                  {forum?.colorScheme === 'black' && !mutationLoading ? (
                    <input className={'bg-gray-600 mr-4 text-white font-bold text-lg hover:bg-gray-700 p-2 rounded'} type="submit" value="Save Changes" />
                  ) : !mutationLoading ? (
                    <input className = {`bg-${forum.colorScheme || 'pink'}-400 mr-4 text-white font-bold text-lg hover:bg-${forum.colorScheme || 'pink'}-700 p-2 rounded`} type="submit" value="Save Changes" />
                  ) : (
                    <>
                      <input className={'border border-gray-500 mr-4 text-gray-500 font-bold text-lg p-2 rounded'} type="submit" value="Save Changes" />
                      <Loader type="ThreeDots" color={colorConverter(forum.colorScheme)} width={40} height={40} />
                    </>
                  )}
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </PleaseSignIn>
    )
  } else {
    return <Error />
  }
}

export default EditForum
