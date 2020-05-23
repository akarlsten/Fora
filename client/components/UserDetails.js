import Link from 'next/link'
import { useEffect } from 'react'

import { useTheme } from 'context/ColorContext'
import { useUser } from 'hooks/useUser'

const UserDetails = ({ user }) => {
  const { setTheme } = useTheme()
  const me = useUser()

  useEffect(() => {
    setTheme('pink')
  }, [])

  const canEditUser = me?.isAdmin || me?.id === user.id

  return (
    <div className="flex flex-col max-w-full">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center mb-4">
          {user.avatar ? (
            <img className={'my-2 rounded-full w-24 md:w-32 lg:w-40'} src={user.avatar.publicUrlTransformed} alt="" />
          ) : (
            <svg className={'my-2 rounded-full border border-pink-200 fill-current w-24 md:w-32 lg:w-40'} width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className={'text-pink-400'} cx="79.5" cy="79.5" r="79.5" />
              <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
              <circle cx="96" cy="59" r="43" fill="white" />
            </svg>
          )}
          <div className="flex flex-col ml-4">
            <h1 className="font-bold text-2xl">{user.displayName}</h1>
            <h2 className="font-light text-xl">@{user.name}</h2>
          </div>
        </div>
        {canEditUser && (
          <Link href="/f/[url]/a/[action]">
            <button className={'p-2 rounded border border-pink-400 bg-pink-400 ml-4 flex items-center'}>
              <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  Edit Details
            </button>
          </Link>
        )}
      </div>
      <div>
        <p>You have: {user._postsMeta.count} posts.</p>
      </div>
      <div className="flex flex-col mt-4">
        <p className="font-bold">Subscriptions:</p>
        {user.subscriptions.map(sub => (
          <div className="mt-2 font-semibold" key={sub.id}>{sub.name}</div>
        ))}
      </div>
    </div>
  )
}

export default UserDetails
