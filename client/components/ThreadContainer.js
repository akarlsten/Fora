import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import { useForm } from 'react-hook-form'

import { useUser } from 'hooks/useUser'
import { useTheme } from 'context/ColorContext'
import PostList from 'components/PostList'
import ReplyModal from 'components/ReplyModal'
import Pagination from 'components/Pagination'
import BackToForum from 'components/BackToForum'

import { THREAD_QUERY } from 'pages/f/[url]/[tid]'
import { useRouter } from 'next/router'

const UPDATE_THREAD = gql`
mutation UPDATE_THREAD($id: ID!, $data: ThreadUpdateInput!) {
    updateThread(id: $id, data: $data) {
    id
    title
    url
    state
  }
}
`

const ThreadContainer = (props) => {
  const {
    title,
    forum,
    posts,
    url,
    id: threadID,
    count,
    page,
    pages,
    perPage,
    state,
    isDeleted
  } = props

  const router = useRouter()
  const { addToast } = useToasts()

  const [replyModalOpen, setReplyModal] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const { setTheme } = useTheme()
  const loggedIn = useUser()

  const { register, handleSubmit, errors: formErrors, triggerValidation } = useForm()

  useEffect(() => {
    setTheme(forum.colorScheme)
  }, [])

  const { post } = router.query

  // scrolls us to the correct post if a post query param is supplied
  // TODO: see if we can do this without the ugly query + hash combo that happens here:
  // &post=5ed30ed9e234f3192df58853#5ed30ed9e234f3192df58853
  useEffect(() => {
    if (post) {
      router.replace(`${router.pathname}#${post}`, `${router.asPath}#${post}`)
    }
  }, [post])

  const [updateThread, { loading: mutationLoading }] = useMutation(UPDATE_THREAD, {
    refetchQueries: [{ query: THREAD_QUERY, variables: { slug: url, first: perPage, skip: page * perPage - perPage } }],
    onCompleted: ({ updateThread: { url: threadUrl } }) => {
      addToast('Thread edited!', { appearance: 'success' })
      setEditingTitle(false)
      router.push('/f/[url]/[tid]', `/f/${forum.url}/${threadUrl}`)
    },
    onError: () => addToast('Couldn\'t update thread, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const [updateThreadState, { loading: stateLoading }] = useMutation(UPDATE_THREAD, {
    refetchQueries: [{ query: THREAD_QUERY, variables: { slug: url, first: perPage, skip: page * perPage - perPage } }],
    onCompleted: ({ updateThread: { state: newState } }) => {
      addToast(`Thread ${newState}!`, { appearance: 'success' })
    },
    onError: () => addToast('Couldn\'t update thread, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const handleClick = () => {
    const operation = state === 'opened' ? 'closed' : 'opened'

    updateThreadState({ variables: { id: threadID, data: { state: operation } } })
  }

  const onSubmit = ({ title }) => {
    triggerValidation('title')
    if (!formErrors.content) {
      updateThread({ variables: { id: threadID, data: { title } } })
    }
  }

  const canPost = !loggedIn?.isGlobalBanned &&
  !forum?.isBanned &&
  !forum?.bannedUsers?.some(banned => banned.id === loggedIn?.id) &&
  (loggedIn?.isAdmin || (state === 'opened' && !isDeleted))

  const canEditAll = loggedIn?.isAdmin || (loggedIn && loggedIn.id === forum?.owner?.id) || forum?.moderators?.some(mod => mod.id === loggedIn?.id)

  return (
    <div className="flex flex-col max-w-full">
      <BackToForum url={forum.url} iconUrl={forum?.icon?.publicUrlTransformed} color={forum.colorScheme} name={forum.name} />
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center flex-wrap">
          {editingTitle ? (
            <>
              <form className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                  <input onChange={() => triggerValidation('title')} ref={register({
                    minLength: { value: 4, message: '⚠ Title must be at least 4 characters long.' },
                    maxLength: { value: 75, message: '⚠ Title can be a maximum of 75 characters long.' },
                    required: '⚠ You need to enter a title.',
                    validate: value => value.trim().length >= 4
                  })} name="title" className={`rounded border-4 border-dashed border-${forum.colorScheme || 'pink'}-400 bg-transparent font-bold text-4xl`} defaultValue={title} type="text"/>
                  {formErrors.title && (<span className="text-sm text-red-600">{formErrors?.title?.message}</span>)}
                </div>
                <div className="ml-4">
                  <button type="submit" className={`cursor-pointer px-2 font-bold py-1 rounded bg-${forum.colorScheme}-400 hover:bg-${forum.colorScheme}-600`}>Save</button>
                </div>
              </form>
              <button onClick={() => setEditingTitle(false)} className={'ml-2 cursor-pointer px-1 font-bold py-1 rounded bg-red-400 hover:bg-red-600'}>
                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </button>
            </>
          ) : (
            <>
              <h1 className="font-bold text-4xl">{title}</h1>
              {state === 'closed' && (
                <p className="ml-8 text-red-400">This thread is closed and cannot be posted in.</p>
              )}
            </>
          )}
          {canEditAll && !editingTitle && (
            <>
              <div className="ml-4">
                <a onClick={() => setEditingTitle(true)} className={`cursor-pointer px-2 -mr-2 font-bold py-1 rounded bg-${forum.colorScheme}-400 hover:bg-${forum.colorScheme}-600`}>Edit</a>
              </div>
              {state === 'opened' ? (
                <div className="ml-4">
                  <a onClick={handleClick} disabled={stateLoading} className={'cursor-pointer px-2 -mr-2 font-bold py-1 rounded bg-red-400 hover:bg-red-600'}>Close Thread</a>
                </div>
              ) : (
                <div className="ml-4">
                  <a onClick={handleClick} disabled={stateLoading} className={'cursor-pointer px-2 -mr-2 font-bold py-1 rounded bg-green-400 hover:bg-green-600'}>Reopen Thread</a>
                </div>
              )}
            </>
          )}
        </div>
        {loggedIn && canPost && !replyModalOpen && (
          <div className="flex justify-end">
            <button onClick={() => setReplyModal(prev => !prev)} className={`p-2 rounded border border-${forum.colorScheme || 'pink'}-400 bg-${forum.colorScheme || 'pink'}-400 ml-4 flex items-center`}>
              <svg className="h-6 w-6 fill-current mr-1" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                  <path d="M229.858 283.813C261.577 283.813 310 277 339.108 245.219C335.483 251.032 342.733 239.563 339.108 245.219C320.202 239.219 302.983 230 293.858 219.813C315.014 219.813 364.784 203 378.921 179.563C373.421 188.875 384.765 169.875 378.921 179.563C362.077 173.563 347.108 165.063 338.827 155.813C357.202 155.813 378.421 151.688 398.171 146.469C421.483 106 501.858 12 501.858 12C305.452 77.469 90.8583 300 6.85835 492L93.8583 404C93.8583 404 85.8583 413 117.858 380C141.827 355.281 204.858 375 245.858 364C256.171 361.25 273.452 341.625 293.514 313.812C267.952 309.063 241.889 297.25 229.858 283.813Z" fill="black" />
                  <path d="M88.5938 151.938H150.891V167.688H88.5938V235.469H71.5781V167.688H10.5469V151.938H71.5781V86.4062H88.5938V151.938Z" fill="black" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="512" height="512" fill="white" />
                  </clipPath>
                </defs>
              </svg>
                Reply
            </button>
          </div>
        )}
        {replyModalOpen && (
          <div className="flex justify-end my-4">
            <button onClick={() => setReplyModal(prev => !prev)} className={`p-2 rounded border border-${forum.colorScheme || 'pink'}-200 ml-4 flex text-${forum.colorScheme || 'pink'}-300 items-center`}>
              <svg className="h-6 w-6 fill-current mr-1" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                  <path d="M229.858 283.813C261.577 283.813 310 277 339.108 245.219C335.483 251.032 342.733 239.563 339.108 245.219C320.202 239.219 302.983 230 293.858 219.813C315.014 219.813 364.784 203 378.921 179.563C373.421 188.875 384.765 169.875 378.921 179.563C362.077 173.563 347.108 165.063 338.827 155.813C357.202 155.813 378.421 151.688 398.171 146.469C421.483 106 501.858 12 501.858 12C305.452 77.469 90.8583 300 6.85835 492L93.8583 404C93.8583 404 85.8583 413 117.858 380C141.827 355.281 204.858 375 245.858 364C256.171 361.25 273.452 341.625 293.514 313.812C267.952 309.063 241.889 297.25 229.858 283.813Z" fillRule="evenodd" />
                  <path d="M88.5938 151.938H150.891V167.688H88.5938V235.469H71.5781V167.688H10.5469V151.938H71.5781V86.4062H88.5938V151.938Z" fillRule="evenodd" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="512" height="512" fill="white" />
                  </clipPath>
                </defs>
              </svg>
                Replying..
            </button>
          </div>
        )}
      </div>
      {pages > 1 && (
        <div className="flex justify-end">
          <Pagination type={'thread'} count={count} page={page} perPage={loggedIn?.postsPerPage} color={forum?.colorScheme} />
        </div>
      )}
      <div className="flex flex-row items-start my-4">
        <PostList color={forum.colorScheme} canEditAll={canEditAll} posts={posts} forum={forum} />
      </div>
      {pages > 1 && (
        <div className="flex justify-end mb-4">
          <Pagination type={'thread'} count={count} page={page} perPage={loggedIn?.postsPerPage} color={forum?.colorScheme} />
        </div>
      )}
      {loggedIn && canPost && !replyModalOpen && (
        <div className="flex justify-end">
          <button onClick={() => setReplyModal(prev => !prev)} className={`p-2 rounded border border-${forum.colorScheme || 'pink'}-400 bg-${forum.colorScheme || 'pink'}-400 ml-4 flex items-center`}>
            <svg className="h-6 w-6 fill-current mr-1" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0)">
                <path d="M229.858 283.813C261.577 283.813 310 277 339.108 245.219C335.483 251.032 342.733 239.563 339.108 245.219C320.202 239.219 302.983 230 293.858 219.813C315.014 219.813 364.784 203 378.921 179.563C373.421 188.875 384.765 169.875 378.921 179.563C362.077 173.563 347.108 165.063 338.827 155.813C357.202 155.813 378.421 151.688 398.171 146.469C421.483 106 501.858 12 501.858 12C305.452 77.469 90.8583 300 6.85835 492L93.8583 404C93.8583 404 85.8583 413 117.858 380C141.827 355.281 204.858 375 245.858 364C256.171 361.25 273.452 341.625 293.514 313.812C267.952 309.063 241.889 297.25 229.858 283.813Z" fill="black" />
                <path d="M88.5938 151.938H150.891V167.688H88.5938V235.469H71.5781V167.688H10.5469V151.938H71.5781V86.4062H88.5938V151.938Z" fill="black" />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="512" height="512" fill="white" />
                </clipPath>
              </defs>
            </svg>
                Reply
          </button>
        </div>
      )}
      {replyModalOpen && (
        <>
          <div className="flex justify-end my-4">
            <button onClick={() => setReplyModal(prev => !prev)} className={`p-2 rounded border border-${forum.colorScheme || 'pink'}-200 ml-4 flex text-${forum.colorScheme || 'pink'}-300 items-center`}>
              <svg className="h-6 w-6 fill-current mr-1" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                  <path d="M229.858 283.813C261.577 283.813 310 277 339.108 245.219C335.483 251.032 342.733 239.563 339.108 245.219C320.202 239.219 302.983 230 293.858 219.813C315.014 219.813 364.784 203 378.921 179.563C373.421 188.875 384.765 169.875 378.921 179.563C362.077 173.563 347.108 165.063 338.827 155.813C357.202 155.813 378.421 151.688 398.171 146.469C421.483 106 501.858 12 501.858 12C305.452 77.469 90.8583 300 6.85835 492L93.8583 404C93.8583 404 85.8583 413 117.858 380C141.827 355.281 204.858 375 245.858 364C256.171 361.25 273.452 341.625 293.514 313.812C267.952 309.063 241.889 297.25 229.858 283.813Z" fillRule="evenodd" />
                  <path d="M88.5938 151.938H150.891V167.688H88.5938V235.469H71.5781V167.688H10.5469V151.938H71.5781V86.4062H88.5938V151.938Z" fillRule="evenodd" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="512" height="512" fill="white" />
                  </clipPath>
                </defs>
              </svg>
                Replying..
            </button>
          </div>
          <ReplyModal color={forum.colorScheme} setReplyModal={setReplyModal} forumUrl={forum.url} threadID={threadID} threadSlug={url} />
        </>
      )}
    </div>
  )
}

export default ThreadContainer
