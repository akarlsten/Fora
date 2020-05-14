import { useContext, useEffect } from 'react'

import ThreadList from './ThreadList'
import ForumSidebar from './ForumSidebar'
import SubscribeButton from './SubscribeButton'
import { useTheme } from '../context/ColorContext'
import { useUser } from '../hooks/useUser'

const ForumContainer = (props) => {
  const { id, url, icon, name, threads, colorScheme, moderators, owner } = props

  const loggedIn = useUser()

  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme(colorScheme)
  }, [])

  const canEditForum = (loggedIn && loggedIn.isAdmin) ||
  (moderators && moderators.some(mod => mod.id === loggedIn.id)) ||
  (owner && owner.id === loggedIn.id)

  return (
    <div className="flex flex-col max-w-full">
      <div className="flex items-center mb-8">
        {icon ? (
          <img className="w-20 h-20 rounded-full mr-4" src={icon.publicUrlTransformed} alt="" />
        ) : (
          <svg className="w-20 h-20 rounded-full mr-4 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${colorScheme || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
        <div className="flex items-center justify-between w-full">
          <h1 className="font-bold text-4xl">{name}</h1>
          <div className="flex items-center">
            {canEditForum && (
              <div>Edit Forum Button</div>
            )}
            {loggedIn && (
              <SubscribeButton forumID={id} color={colorScheme} />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap space-y-8 lg:flex-no-wrap lg:space-y-0 items-start">
        <div className="flex flex-col w-full">
          <ThreadList url={url} color={colorScheme} threads={threads} />
          {loggedIn && (
            <div className="flex justify-end my-4">
              <button className={`p-2 rounded border border-${colorScheme || 'pink'}-400 bg-${colorScheme || 'pink'}-400 ml-4 flex items-center`}>
                <svg className="h-6 w-6 fill-current mr-1" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                Post
              </button>
            </div>
          )}
        </div>
        <ForumSidebar color={colorScheme} {...props} />
      </div>
    </div>
  )
}

export default ForumContainer
