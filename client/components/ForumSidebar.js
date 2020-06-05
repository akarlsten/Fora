import React from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import UserBadge from 'components/UserBadge'

const ForumSidebar = ({ name, icon, color, description, owner, createdAt, moderators }) => {
  return (
    <div className={`px-4 w-72 lg:w-full flex flex-col bg-white rounded p-4 lg:ml-4 border border-${color || 'pink'}-200`}>
      <div className="flex items-center flex-wrap">
        {icon ? (
          <img className="w-8 h-8 rounded-full mr-2" src={icon.publicUrlTransformed} alt="" />
        ) : (
          <svg className="w-8 h-8 rounded-full mr-2 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${color}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
        <h2 className="font-bold text-xl">{name}</h2>
      </div>

      <div className={`my-4 flex flex-col p-2 rounded border border-${color || 'pink'}-200 text-sm`}>
        {description ? (
          <div>
            {description}
          </div>
        ) : (
          <>
            <p>A forum without a description.</p>
            <img className="mt-4" src="/mystery.gif" alt=""/>
          </>
        )}
      </div>
      <div className="flex items-center lg:items-start lg:flex-col text-xs flex-wrap">
        <p className="lg:self-start font-semibold mr-2 lg:mb-2">Created by</p>
        <div className="flex flex-col items-center">
          <UserBadge color={color} name={owner?.name} displayName={owner?.displayName} avatar={owner?.avatar} isAdmin={owner?.isAdmin} />
          {createdAt && (
            <div className="flex items-center justify-center mt-1 text-xs">
              <svg className="fill-current h-4 w-4 mr-1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
              <span>{formatDistanceToNow(parseISO(createdAt))} ago.</span>
            </div>
          )}
        </div>
      </div>

      {moderators?.length > 0 && (
        <div className="flex flex-col self-start mt-4 space-y-2">
          <p className="font-semibold text-xs">Moderators</p>
          {moderators.map(mod => (
            <UserBadge color={color} key={mod.id} name={mod?.name} displayName={mod?.displayName} avatar={mod?.avatar} isAdmin={mod?.isAdmin} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ForumSidebar
