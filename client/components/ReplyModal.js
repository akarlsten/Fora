import { useToasts } from 'react-toast-notifications'
import { useForm, ErrorMessage } from 'react-hook-form'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import { FORUM_QUERY } from 'pages/f/[url]'
import { THREAD_QUERY } from 'pages/f/[url]/[tid]'

const CREATE_POST = gql`
mutation CREATE_POST($threadID: ID!, $content: String!) {
  createPost(data: {
    content: $content,
    thread: { connect: { id: $threadID } }
    }) {
      id
      content
    }
  updateThread(id: $threadID, data: {}){
    id
  }
}
`

const POSTS_FRAGMENT = gql`
fragment myThread on Thread {
    _postsMeta {
      count
    }
  }
`

const ReplyModal = ({ color, threadSlug, threadID, setReplyModal, forumUrl }) => {
  const { addToast } = useToasts()
  const { register, handleSubmit, errors: formErrors } = useForm()

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: () => {
      addToast('Post made!', { appearance: 'success' })
      setReplyModal(false)
    },
    refetchQueries: [{ query: THREAD_QUERY, variables: { threadSlug } }, { query: FORUM_QUERY, variables: { forumUrl } }],
    onError: () => addToast('Couldn\'t create post, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true }),
    update (cache) {
      const { _postsMeta: { count } } = cache.readFragment({ id: `Thread:${threadID}`, fragment: POSTS_FRAGMENT })
      cache.writeFragment({
        id: `Thread:${threadID}`,
        fragment: POSTS_FRAGMENT,
        data: { _typeName: 'Thread', _postsMeta: { count: count + 1 } }
      })
    }
  })

  const onSubmit = ({ content }) => {
    if (!formErrors.content) {
      createPost({
        variables: { threadID: threadID, content }
      })
    }
  }

  return (
    <div className={`absolute bottom-0 right-0 p-4 bg-${color === 'black' ? 'gray' : (color || 'pink')}-300 w-full sm:w-3/4 lg:w-1/2 xl:w-1/4 sm:rounded-tl-lg`}>
      <h1 className={`font-bold text-2xl text-${color || 'pink'}-800`}>Quick Reply</h1>
      <form className="w-full max-w-xl flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Content</label>
          <div>
            <textarea rows="4" ref={register({ minLength: 1, maxLength: 20000, required: true })} className="resize-none form-textarea block w-full" name="content" type="text" />
            {formErrors.content && (<span className="text-sm text-red-600">Content must be between 1 and 20000 characters.</span>)}
          </div>
          <span className="text-xs text-center text-gray-600">Markdown is enabled!</span>
          <div className="flex justify-end">
            {color === 'black' ? (
              <input className={'bg-gray-600 text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8 rounded'} type="submit" value="Post" />
            ) : (
              <input className={`bg-${color || 'pink'}-400 text-white font-bold text-lg hover:bg-${color || 'pink'}-700 p-2 mt-8 rounded`} type="submit" value="Post" />
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ReplyModal