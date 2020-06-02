import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import gql from 'graphql-tag'
import { useToasts } from 'react-toast-notifications'
import { useState, useEffect } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useUser } from 'hooks/useUser'
import Loader from 'react-loader-spinner'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

import { THREAD_QUERY } from 'pages/f/[url]/[tid]'
import { postsPerPage } from 'config'
import MarkdownHelp from './MarkdownHelp'
import colorConverter from 'lib/colorConverter'
import BanButton from 'components/BanButton'

import RenderMarkdown from 'components/RenderMarkdown'

const UPDATE_POST = gql`
mutation UPDATE_POST($id: ID!, $data: PostUpdateInput!) {
  updatePost(id: $id, data: $data) {
    id
  }
}
`

const PostItem = ({ id, postNumber, threadID, owner, content, color, canEditAll, createdAt, isEdited, updatedAt, forum }) => {
  const [editing, setEditing] = useState(false)
  const { addToast } = useToasts()
  const { register, handleSubmit, errors: formErrors, triggerValidation } = useForm()
  const loggedIn = useUser()
  const router = useRouter()

  // once a user has scrolled through 70% of a post we count it as read and update the "last read post" in localstorage
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '70%' })
  useEffect(() => {
    if (window.localStorage) {
      const previouslySet = JSON.parse(window.localStorage.getItem(`${threadID}/${loggedIn?.id || 'anon'}`))
      if (!previouslySet || previouslySet.postNumber < postNumber) {
        const data = {
          postNumber,
          postID: id
        }

        window.localStorage.setItem(`${threadID}/${loggedIn?.id || 'anon'}`, JSON.stringify(data))
      }
    }
  }, [inView])

  const { url, tid, p } = router.query

  const page = +p || 1
  const perPage = loggedIn?.postsPerPage || postsPerPage

  const [updatePost, { loading: mutationLoading }] = useMutation(UPDATE_POST, {
    refetchQueries: [{ query: THREAD_QUERY, variables: { slug: tid, first: perPage, skip: page * perPage - perPage } }],
    onCompleted: () => {
      addToast('Post edited!', { appearance: 'success' })
      setEditing(false)
    },
    onError: () => addToast('Couldn\'t update post, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const onSubmit = ({ content }) => {
    console.log(content)
    triggerValidation('content')
    if (!formErrors.content) {
      updatePost({ variables: { id: id, data: { content } } })
    }
  }

  const canEdit = canEditAll || loggedIn?.id === owner.id
  const userIsBanned = owner?.isGlobalBanned || forum?.bannedUsers?.some(banned => banned.id === owner.id)

  // TODO: maybe add a badge for moderators and admins?
  return (
    <div id={id} className={'flex flex-col sm:flex-row'} ref={ref}>
      <div className={'px-2 md:px-4 py-2 flex flex-row sm:flex-col justify-between sm:justify-start items-center  w-full sm:w-32 md:w-40 lg:w-56 flex-shrink-0'}>
        <div className="flex flex-row-reverse items-center sm:flex-col">
          <a name={id}></a>
          <Link href='/u/[username]' as={`/u/${owner.name}`}>
            <a className={`ml-2 sm:ml-0 flex flex-col items-start sm:items-center hover:text-${color || 'pink'}-400`}>
              <span className={`font-bold break-words text-sm sm:text-base ${owner.isAdmin && 'text-red-400'}`}>
                {owner.displayName}
              </span>
              <span className="text-xs sm:text-sm">@{owner.name}</span>
            </a>
          </Link>
          {!userIsBanned && (
            owner.avatar ? (
              <img loading="lazy" className={`sm:my-2 w-12 md:w-32 lg:w-48 h-12 md:h-32 lg:h-48 border border-${color || 'pink'}-200`} src={owner.avatar.publicUrlTransformed} alt="" />
            ) : (
              <svg className={`sm:my-2 rounded-full border border-${color || 'pink'}-200 fill-current`} width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className={`text-${color || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
                <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                <circle cx="96" cy="59" r="43" fill="white" />
              </svg>
            )
          )}
          {userIsBanned && (
            <div className="sm:my-2 flex flex-col text-red-500 items-center">
              <svg className="h-15 w-15 fill-current" viewBox="0 0 20 20"><path d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              <h2 className="text-sm sm:text-xl font-bold ">
            BANNED!
              </h2>
              <p className="-mt-1 leading-tight text-xs sm:text-sm font-bold ">
                {owner?.isGlobalBanned ? '(global)' : '(forum)'}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span title={parseISO(createdAt)} className="text-xs text-gray-600 flex items-center break-word">
            <svg className="fill-current h-4 w-4 mr-1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
            {formatDistanceToNow(parseISO(createdAt), new Date())} ago
          </span>
          {isEdited && (
            <span title={parseISO(updatedAt)} className="text-xs text-gray-600 flex items-center break-word">
              <svg className="fill-current h-4 w-4 mr-1" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
              {formatDistanceToNow(parseISO(updatedAt), new Date())} ago
            </span>
          )}
        </div>
      </div>
      <div className={`flex flex-col sm:flex-row flex-grow sm:px-4 py-2 ${!editing && 'border-t sm:border-t-0 sm:border-l'} ${editing && 'border-4 border-dashed'}  border-${color || 'pink'}-200`}>
        <div className={`w-full sm:mr-2 px-2 ${canEdit && 'pb-2'} sm:pb-0 sm:px-0`}>
          {editing ? (
            <form id="edit" className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>
              <textarea ref={register({
                minLength: { value: 1, message: '< 1' },
                maxLength: { value: 20000, message: '> 20k' },
                required: 'Required',
                validate: value => value.trim().length >= 1 || '< 1'
              })} onChange={() => triggerValidation('content')} name="content" className={'w-full h-full resize-y mr-1'} defaultValue={content}></textarea>
            </form>
          ) : (
            <RenderMarkdown content={content} color={color} />
          )}
        </div>
        {canEdit && !editing && (
          <div className={`sm:self-end w-full pt-2 px-2 sm:py-0 sm:px-0 sm:w-auto border-t border-t items-center flex sm:flex-col border-${color || 'pink'}-200 sm:border-0`}>
            {canEditAll && (
              <BanButton color={color} userID={owner.id} forumID={forum.id} />
            )}
            <div className="ml-2 sm:ml-0 self-end">
              <a onClick={() => setEditing(true)} className={`px-2 cursor-pointer sm:-mr-2 font-bold py-1 rounded bg-${color}-400 hover:bg-${color}-600`}>Edit</a>
            </div>
          </div>
        )}
        {canEdit && editing && (
          <div className="ml-2 self-end flex flex-col items-end h-full">
            <div className="flex flex-col items-center h-full justify-between -mr-2">
              <div className="flex items-center">
                <MarkdownHelp color={color} />
                <button onClick={() => setEditing(false)} className={'cursor-pointer self-end mb-1 px-1 font-bold py-1 rounded bg-red-400 hover:bg-red-600'}>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                {formErrors?.content && (<span className="-mb-1 text-lg text-red-600">⚠</span>)}
                {formErrors?.content && (<span className="mb-1 text-xs text-red-600">{formErrors?.content?.message}</span>)}
                {mutationLoading && (
                  <Loader type="ThreeDots" color={colorConverter(color)} width={30} height={30} />
                )}
                <button disabled={mutationLoading} form="edit" type="submit" className={`px-2 cursor-pointer font-bold py-1 rounded bg-${color}-400 hover:bg-${color}-600 ${mutationLoading && 'opacity-50'}`}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={`flex justify-center items-center divide-x divide-${color || 'pink'}-200`}>
      </div>
    </div>
  )
}

export default PostItem
