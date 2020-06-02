import { useContext, useEffect } from 'react'
import Link from 'next/link'

import ThreadList from 'components/ThreadList'
import ForumSidebar from 'components/ForumSidebar'
import SubscribeButton from 'components/SubscribeButton'
import Pagination from 'components/Pagination'

import { useTheme } from 'context/ColorContext'
import { useUser } from 'hooks/useUser'

const ForumContainer = (props) => {
  const {
    id,
    url,
    icon,
    name,
    threads,
    colorScheme,
    moderators,
    owner,
    bannedUsers,
    isBanned,
    count,
    page,
    pages
  } = props

  const loggedIn = useUser()

  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme(colorScheme)
  }, [])

  const canEditForum = loggedIn?.isAdmin || moderators?.some(mod => mod.id === loggedIn?.id) || owner?.id === loggedIn?.id
  const canPost = !loggedIn?.isGlobalBanned && !isBanned && !bannedUsers?.some(banned => banned.id === loggedIn?.id)

  return (
    <div className="flex flex-col max-w-full">
      <div className="flex items-center mb-8">
        {icon ? (
          <img className="w-10 h-10 sm:w-20 sm:h-20 rounded-full mr-4" src={icon.publicUrlTransformed} alt="" />
        ) : (
          <svg className="w-10 h-10 sm:w-20 sm:h-20  rounded-full mr-4 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${colorScheme || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
        <div className="flex items-center sm:justify-between w-full">
          <h1 className="font-bold text-2xl sm:text-4xl">{name}</h1>
          <div className="flex space-y-2 sm:space-y-0 transform scale-90 sm:scale-100 items-center justify-end flex-wrap">
            {canEditForum && (
              <Link href="/f/[url]/a/[action]" as={`/f/${url}/a/edit`}>
                <button className={`p-2 rounded border border-${colorScheme || 'pink'}-400 bg-${colorScheme || 'pink'}-400 ml-4 flex items-center`}>
                  <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  Edit Forum
                </button>
              </Link>
            )}
            {loggedIn && (
              <SubscribeButton forumID={id} color={colorScheme} />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap space-y-8 lg:flex-no-wrap lg:space-y-0 items-start">
        <div className="flex flex-col w-full">
          {pages > 1 && (
            <div className="flex justify-end mb-4">
              <Pagination count={count} page={page} perPage={loggedIn?.postsPerPage} color={colorScheme} />
            </div>
          )}
          <ThreadList url={url} color={colorScheme} threads={threads} />
          {loggedIn && canPost && (
            <div className="flex justify-end my-4">
              <Link href="/f/[url]/a/[action]" as={`/f/${url}/a/post`}>
                <button className={`p-2 rounded border border-${colorScheme || 'pink'}-400 bg-${colorScheme || 'pink'}-400 ml-4 flex items-center`}>
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
                Post
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center w-full lg:w-auto">
          <ForumSidebar color={colorScheme} {...props} />
        </div>
      </div>
    </div>
  )
}

export default ForumContainer
