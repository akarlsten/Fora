import { useForm, ErrorMessage } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import gql from 'graphql-tag'
import Link from 'next/link'

import { useTheme } from 'context/ColorContext'
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

const UPDATE_COLOR_DESC = gql`
mutation UPDATE_COLOR_DESC($forumID: ID!, $description: String!, $colorScheme: ForumColorSchemeType) {
  updateForum(id: $forumID, data: { description: $description, colorScheme: $colorScheme}) {
    id
    description
    colorScheme
  }
}
`

const ColorRadio = ({ color, register, oldColor }) => (
  <label className={`inline-flex items-center p-2 bg-${color}-200 border-${color}-400 border-4 rounded`}>
    <input type="radio" ref={register} className={`form-radio text-${color}-400 h-6 w-6`} name="colorScheme" value={color} defaultChecked={oldColor === color} />
    <span className={`ml-2 text-${color}-800 font-bold`}>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
  </label>
)

const EditForum = () => {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { addToast } = useToasts()
  const { url } = router.query

  const { data, loading, error } = useQuery(EDIT_FORUM_QUERY, {
    variables: { url }
  })

  const [updateDescrColor] = useMutation(UPDATE_COLOR_DESC, {
    data,
    onCompleted: () => { addToast('Successfully updated forum!', { appearance: 'success' }) },
    onError: () => addToast('Couldn\'t update forum, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const { register, handleSubmit, errors: formErrors } = useForm()
  const onSubmit = ({ description, colorScheme }) => {
    if (!formErrors.description && !formErrors.colorScheme) {
      updateDescrColor({
        variables: { forumID: data.allForums[0].id, description, colorScheme }
      })
      setTheme(colorScheme)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  } else if (data?.allForums[0]) {
    const forum = data.allForums[0]
    return (
      <PleaseSignIn>
        <div className="container mx-auto flex flex-col items-center">
          <Link href="/f/[url]" as={`/f/${forum.url}`}>
            <div className="flex items-center mb-8 cursor-pointer self-start">
              <svg className="w-6 h-6" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              {forum.icon ? (
                <img className="w-8 h-8 rounded-full mr-1" src={forum.icon.publicUrlTransformed} alt="" />
              ) : (
                <svg className="w-8 h-8 rounded-full mr-1 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className={`text-${forum.colorScheme || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
                  <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                  <circle cx="96" cy="59" r="43" fill="white" />
                </svg>
              )}
              <div className="flex items-center justify-between w-full">
                <h1 className="font-bold text-lg">{forum.name}</h1>
              </div>
            </div>
          </Link>
          <h1 className="text-3xl mb-4 text-gray-700">Editing: <span className="font-semibold text-black">{forum.name}</span></h1>
          <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">Description</label>
              <textarea rows="4" ref={register({ minLength: 1, maxLength: 140 })} className="resize-none form-textarea block w-full" name="description" type="text" defaultValue={forum.description}/>
              {formErrors.description && (<span className="text-sm text-red-600">Description must be between 1 and 140 characters.</span>)}
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-2" htmlFor="color">Color Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <ColorRadio color="red" oldColor={forum.colorScheme} register={register} />
                <ColorRadio color="orange" oldColor={forum.colorScheme} register={register} />
                <ColorRadio color="green" oldColor={forum.colorScheme} register={register} />
                <ColorRadio color="teal" oldColor={forum.colorScheme} register={register}/>
                <ColorRadio color="blue" oldColor={forum.colorScheme} register={register} />
                <ColorRadio color="indigo" oldColor={forum.colorScheme} register={register} />
                <ColorRadio color="purple" oldColor={forum.colorScheme} register={register}/>
                <ColorRadio color="pink" oldColor={forum.colorScheme} register={register} />
                <label className="inline-flex bg-gray-200 items-center p-2 border-black border-4 rounded">
                  <input type="radio" ref={register} defaultChecked={forum.colorScheme === 'black'} className="form-radio h-6 w-6 text-black" name="colorScheme" value="black" />
                  <span className="ml-2 text-gray-800 font-bold">Gray/Black</span>
                </label>
              </div>
              {forum?.colorScheme === 'black' ? (
                <input className={'bg-gray-600 mx-auto text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8 rounded'} type="submit" value="Save Changes" />

              ) : (
                <input className = {`bg-${forum.colorScheme}-400 mx-auto text-white font-bold text-lg hover:bg-${forum.colorScheme}-700 p-2 mt-8 rounded`} type="submit" value="Save Changes" />
              )}
            </div>
          </form>
        </div>
      </PleaseSignIn>
    )
  } else {
    return <Error />
  }
}

export default EditForum
