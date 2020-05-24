import Link from 'next/link'
import { useState, useEffect } from 'react'

import { useUser } from 'hooks/useUser'
import { useTheme } from 'context/ColorContext'
import PostList from 'components/PostList'
import ReplyModal from 'components/ReplyModal'
import Pagination from 'components/Pagination'
import BackToForum from 'components/BackToForum'

const ThreadContainer = (props) => {
  const { title, forum, posts, isBanned, bannedUsers, url, id: threadID, count, page, pages } = props

  const [replyModalOpen, setReplyModal] = useState(false)
  const { setTheme } = useTheme()
  const loggedIn = useUser()

  useEffect(() => {
    setTheme(forum.colorScheme)
  }, [])

  const canPost = !loggedIn?.isGlobalBanned || !isBanned || !bannedUsers.some(banned => banned.id === loggedIn?.id)

  return (
    <div className="flex flex-col max-w-full">
      <BackToForum url={forum.url} iconUrl={forum?.icon?.publicUrlTransformed} color={forum.colorScheme} name={forum.name} />
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="font-bold text-4xl">{title}</h1>
        {loggedIn && canPost && !replyModalOpen && (
          <div className="flex justify-end my-4">
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
        <div className="flex justify-end my-4">
          <Pagination type={'thread'} count={count} page={page} perPage={loggedIn?.postsPerPage} color={forum?.colorScheme} />
        </div>
      )}
      <div className="flex flex-row items-start">
        <PostList color={forum.colorScheme} posts={posts} />
      </div>
      {pages > 1 && (
        <div className="flex justify-end my-4">
          <Pagination type={'thread'} count={count} page={page} perPage={loggedIn?.postsPerPage} color={forum?.colorScheme} />
        </div>
      )}
      {loggedIn && canPost && !replyModalOpen && (
        <div className="flex justify-end my-4">
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
