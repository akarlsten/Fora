import { useForm, ErrorMessage } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Link from 'next/link'
import Loader from 'react-loader-spinner'

import { useTheme } from 'context/ColorContext'
import { useUser } from 'hooks/useUser'
import colorConverter from 'lib/colorConverter'

import BackToForum from 'components/BackToForum'
import ColorSelector from 'components/ColorSelector'
import ImageSelector from 'components/ImageSelector'
import PleaseSignIn from 'components/PleaseSignIn'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'
import ModsBansForm from './ModsBansForm'

export const EDIT_FORUM_QUERY = gql`
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
      name
      displayName
      avatar {
        publicUrlTransformed(transformation: {
          width:"300",
          height:"300",
          crop:"fill",
          gravity:"center"
        })
      }
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
      displayName
      avatar {
        publicUrlTransformed(transformation: {
          width:"300",
          height:"300",
          crop:"fill",
          gravity:"center"
        })
      }
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

const EditForum = () => {
  const loggedIn = useUser()
  const router = useRouter()
  const { setTheme } = useTheme()
  const { addToast } = useToasts()
  const { url } = router.query
  const { register, handleSubmit, errors: formErrors, watch, triggerValidation, getValues } = useForm()

  const { data, loading, error } = useQuery(EDIT_FORUM_QUERY, {
    variables: { url }
  })

  useEffect(() => {
    if (data?.allForums[0]?.colorScheme) {
      setTheme(data.allForums[0].colorScheme)
    }
  }, [data])

  const [updateDescrColor, { loading: mutationLoading }] = useMutation(UPDATE_FORUM, {
    refetchQueries: [{ query: EDIT_FORUM_QUERY, variables: { url } }],
    onCompleted: () => { addToast('Successfully updated forum!', { appearance: 'success' }) },
    onError: () => addToast('Couldn\'t update forum, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ description, colorScheme, image }) => {
    if (!formErrors.description && !formErrors.colorScheme && !formErrors.icon) {
      setTheme(colorScheme)
      if (image && image[0]) {
        updateDescrColor({
          variables: { forumID: data.allForums[0].id, data: { description, colorScheme, icon: image[0] } }
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
    const canEditForum = loggedIn?.isAdmin || forum?.moderators?.some(mod => mod.id === loggedIn?.id) || forum?.owner?.id === loggedIn?.id

    if (!canEditForum) {
      router.push('/f/[url]', `/f/${url}`)
    }

    return (
      <div className="container mx-auto flex flex-col items-center">
        <BackToForum url={forum.url} iconUrl={forum?.icon?.publicUrlTransformed} color={forum.colorScheme} name={forum.name} />
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
              <ImageSelector
                oldImage={forum?.icon?.publicUrlTransformed}
                getValues={getValues}
                watch={watch}
                triggerValidation={triggerValidation}
                formErrors={formErrors}
                register={register}
                color={forum?.colorScheme} />
              <div className="flex align-start items-center mt-8">
                {forum?.colorScheme === 'black' && !mutationLoading ? (
                  <input className={'bg-gray-600 mr-4 text-white text-lg font-medium hover:bg-gray-700 p-2 rounded'} type="submit" value="Save Changes" />
                ) : !mutationLoading ? (
                  <input className = {`bg-${forum.colorScheme || 'pink'}-400 mr-4 font-medium text-white text-lg hover:bg-${forum.colorScheme || 'pink'}-700 p-2 rounded`} type="submit" value="Save Changes" />
                ) : (
                  <>
                    <input className={'border border-gray-500 mr-4 text-gray-500 font-medium text-lg p-2 rounded'} type="submit" value="Saving.." />
                    <Loader type="ThreeDots" color={colorConverter(forum.colorScheme)} width={40} height={40} />
                  </>
                )}
              </div>
            </div>
          </fieldset>
        </form>
        <ModsBansForm id={forum.id} color={forum?.colorScheme} banned={forum.bannedUsers} mods={forum.moderators} />
      </div>
    )
  } else {
    return <Error />
  }
}

export default EditForum
