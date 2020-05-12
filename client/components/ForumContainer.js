import { useContext, useEffect } from 'react'

import ThreadList from './ThreadList'
import ForumSidebar from './ForumSidebar'
import SubscribeButton from './SubscribeButton'
import { useTheme } from '../context/ColorContext'

const ForumContainer = (props) => {
  const { id, url, icon, name, threads, colorScheme, subscribers } = props

  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme(colorScheme)
  }, [])

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
          <SubscribeButton forumID={id} color={colorScheme} subscribed={subscribers} />
        </div>
      </div>
      <div className="flex flex-row items-start">
        <ThreadList url={url} color={colorScheme} threads={threads} />
        <ForumSidebar color={colorScheme} {...props} />
      </div>
    </div>
  )
}

export default ForumContainer
