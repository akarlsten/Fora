import { useForm, ErrorMessage } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import { useEffect } from 'react'
import gql from 'graphql-tag'
import Link from 'next/link'
import Loader from 'react-loader-spinner'

import colorConverter from 'lib/colorConverter'
import { useTheme } from 'context/ColorContext'
import PleaseSignIn from 'components/PleaseSignIn'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'

import { FORUM_QUERY } from 'pages/f/[url]'

const CREATE_THREAD = gql`
mutation CREATE_THREAD($forumID: ID!, $title: String!, $post: String!) {
  createThread(data: {
    title: $title,
    posts: { create: [{content: $post}]},
    forum: { connect: { id: $forumID } }
    }) {
      id
      title
      url
    }
}
`

const ThreadForm = () => {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { addToast } = useToasts()
  const { register, handleSubmit, errors: formErrors } = useForm()

  const { url } = router.query
  const { data, loading, error } = useQuery(FORUM_QUERY, {
    variables: { url }
  })

  const forum = data?.allForums[0]

  useEffect(() => {
    if (forum) {
      setTheme(forum.colorScheme)
    }
  }, [forum])

  const [createThread, { loading: mutationLoading }] = useMutation(CREATE_THREAD, {
    onCompleted: ({ createThread: { url: threadUrl } }) => {
      addToast('Thread created!', { appearance: 'success' })
      router.push('/f/[url]/[tid]', `/f/${url}/${threadUrl}`)
    },
    refetchQueries: [{ query: FORUM_QUERY, variables: { url } }],
    onError: () => addToast('Couldn\'t create thread, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ title, post }) => {
    if (!formErrors.title && !formErrors.post) {
      createThread({
        variables: { forumID: forum.id, title, post }
      })
    }
  }

  if (loading) {
    return <LoadingSpinner />
  } else if (forum) {
    return (
      <PleaseSignIn>
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
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl mb-4 text-gray-700">Post a new thread..</h1>
          <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">Title</label>
                <input ref={register({ minLength: 4, maxLength: 75, required: true })} className="form-input block w-full" name="title" type="text" />
                {formErrors.title && (<span className="text-sm text-red-600">Title must be between 4 and 75 characters.</span>)}
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Post</label>
                <div>
                  <textarea rows="4" ref={register({ minLength: 1, maxLength: 20000, required: true })} className="resize-none form-textarea block w-full" name="post" type="text" />
                  {formErrors.post && (<span className="text-sm text-red-600">Content must be between 1 and 20000 characters.</span>)}
                </div>
                <div className="flex align-start items-center mt-8 space-x-4">
                  {forum?.colorScheme === 'black' ? (
                    <input className={'bg-gray-600 text-white font-bold text-lg hover:bg-gray-700 p-2 rounded'} type="submit" value="Post" />
                  ) : (
                    <input className={`bg-${forum.colorScheme || 'pink'}-400 text-white font-bold text-lg hover:bg-${forum.colorScheme || 'pink'}-700 p-2 rounded`} type="submit" value="Post" />
                  )}
                  {mutationLoading && (
                    <Loader type="ThreeDots" color={colorConverter(forum.colorScheme)} width={40} height={40} />
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

export default ThreadForm
