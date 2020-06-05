import { useToasts } from 'react-toast-notifications'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import Loader from 'react-loader-spinner'
import { useRouter } from 'next/router'

import colorConverter from 'lib/colorConverter'
import MarkdownHelp from 'components/MarkdownHelp'

import { DETAILED_FORUM_QUERY } from 'pages/f/[url]'
import { THREAD_QUERY } from 'pages/f/[url]/[tid]'

const CREATE_POST = gql`
mutation CREATE_POST($threadID: ID!, $content: String!) {
  createPost(data: {
    content: $content,
    thread: { connect: { id: $threadID } }
    }) {
      id
      postNumber
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

const ReplyModal = ({ color, threadSlug, threadID, setReplyModal, forumUrl, page, perPage }) => {
  const { addToast } = useToasts()
  const router = useRouter()

  const { register, handleSubmit, errors: formErrors } = useForm()
  // color is the color name, we convert it to hex with this
  const hexColor = colorConverter(color)

  const [createPost, { loading: mutationLoading }] = useMutation(CREATE_POST, {
    onCompleted: ({ createPost: { postNumber } }) => {
      addToast('Post made!', { appearance: 'success' })
      setReplyModal(false)
      // if this post creates a new page
      if (Math.ceil(postNumber / perPage) > page) {
        router.push({ pathname: '/f/[url]/[tid]', query: { p: page + 1 } },
          { pathname: `/f/${forumUrl}/${threadSlug}`, query: { p: page + 1 } })
      }
    },
    refetchQueries: [{ query: THREAD_QUERY, variables: { slug: threadSlug, first: perPage, skip: page * perPage - perPage } }, { query: DETAILED_FORUM_QUERY, variables: { forumUrl } }],
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
    <div className={`absolute bottom-0 right-0 p-4 bg-${color === 'black' ? 'gray' : (color || 'pink')}-300 w-full sm:w-3/4 lg:w-1/2 xl:w-1/3 sm:rounded-tl-lg`}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-2xl text-${color || 'pink'}-800`}>Quick Reply</h1>
        <div className="flex items-center">
          <MarkdownHelp color={color} />
          <button onClick={() => setReplyModal(false)} className={'self-end mb-1 px-1 font-bold py-1 rounded bg-red-400 hover:bg-red-600'}>
            <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          </button>
        </div>
      </div>
      <form className="w-full max-w-2xl flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="post">Content</label>
          <div>
            <textarea rows="10" ref={register({ minLength: 1, maxLength: 20000, required: true })} className="resize-none form-textarea block w-full" name="content" type="text" />
            {formErrors.content && (<span className="text-sm text-red-600">Content must be between 1 and 20000 characters.</span>)}
          </div>
          <span className="text-xs text-center text-gray-600">Markdown is enabled!</span>
          <div className="flex justify-end items-center mt-8">
            {mutationLoading && (
              <Loader type="ThreeDots" color={hexColor} width={40} height={40} />
            )}
            {color === 'black' ? (
              <input className={'ml-4 bg-gray-600 text-white font-bold text-lg hover:bg-gray-700 p-2 rounded'} type="submit" value="Post" />
            ) : (
              <input className={`ml-4 bg-${color || 'pink'}-400 text-white font-bold text-lg hover:bg-${color || 'pink'}-700 p-2 rounded`} type="submit" value="Post" />
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ReplyModal
