import React from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'

const ForumSidebar = ({ name, color, description, owner, createdAt, moderators }) => {
  return (
    <div className={`w-full lg:w-1/4 flex flex-col items-center bg-white rounded p-4 lg:ml-4 divide-x-0 border border-${color || 'pink'}-200`}>
      <h2 className="font-bold text-xl">{name}</h2>
      <div className="my-4 flex flex-col items-center">
        {description ? (
          <p>{description}</p>
        ) : (
          <>
            <p>A forum without a description.</p>
            <img className="mt-4" src="/mystery.gif" alt=""/>
          </>
        )}
      </div>
      <p className="text-sm">Created by <span className="font-bold">{owner.name}</span> {createdAt && `${formatDistanceToNow(parseISO(createdAt))} ago.`}</p>
      {moderators?.length > 0 && (
        <div className="flex flex-col self-start mt-4">
          <p className="font-bold">Moderators</p>
          {moderators.map(mod => (
            <p key={mod.id} className="font-medium">{mod.name}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default ForumSidebar
