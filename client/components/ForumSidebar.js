import React from 'react'

const ForumSidebar = ({ name, color, description, owner, createdAt }) => {
  return (
    <div className={`w-full lg:w-1/4 flex flex-col items-center bg-white rounded p-4 ml-4 divide-x-0 border border-${color || 'pink'}-200`}>
      <h2 className="font-bold text-xl">{name}</h2>
      <div className="my-4 flex flex-col items-center">
        {description ? (
          <p>{description}</p>
        ) : (
          <React.Fragment>
            <p>A forum without a description.</p>
            <img className="mt-4" src="/mystery.gif" alt=""/>
          </React.Fragment>
        )}
      </div>
      <p>Created by {owner.name} {createdAt && `on ${createdAt}`}</p>
    </div>
  )
}

export default ForumSidebar
