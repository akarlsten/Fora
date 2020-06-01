import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useTheme } from 'context/ColorContext'
import { useUser } from 'hooks/useUser'
import PleaseSignIn from './PleaseSignIn'
import Signin from 'components/Signin'
import ForumList from 'components/ForumList'
import ForumItem from 'components/ForumItem'
import LoadingSpinner from 'components/LoadingSpinner'
import PreviousPosts from 'components/PreviousPosts'

const UserDetails = ({ user }) => {
  const router = useRouter()
  const { setTheme } = useTheme()
  const me = useUser()

  useEffect(() => {
    setTheme('pink')
  }, [])

  const viewingSelf = me?.id === user?.id
  const canEditUser = me?.isAdmin || viewingSelf

  // if (!user || !me) {
  //   router.push('/signin')
  //   return <LoadingSpinner />
  // }

  return (
    <div className="flex flex-col max-w-full">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center mb-4">
          {user?.avatar ? (
            <img className={'my-2 bg-white rounded-full w-24 md:w-32 lg:w-40'} src={user.avatar.publicUrlTransformed} alt="" />
          ) : (
            <svg className={'my-2 rounded-full fill-current w-24 md:w-32 lg:w-40'} width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className={'text-pink-400'} cx="79.5" cy="79.5" r="79.5" />
              <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
              <circle cx="96" cy="59" r="43" fill="white" />
            </svg>
          )}
          <div className="flex flex-col ml-4">
            <h1 className="font-bold text-2xl">{user?.displayName}</h1>
            <h2 className="font-light text-xl">@{user?.name}</h2>
          </div>
        </div>
        {canEditUser && (
          <Link href="/u/[username]/edit" as={`/u/${user?.name}/edit`}>
            <a className={'p-2 rounded border border-pink-400 bg-pink-400 ml-4 flex items-center'}>
              <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  Edit Details
            </a>
          </Link>
        )}
      </div>
      {user?.isGlobalBanned && (
        <div className="my-8 font-bold text-red-500 text-2xl uppercase">
            This account has been banned from the entire website by the admins.
        </div>
      )}
      <div>
        <p>{user?.id === me?.id ? 'You have' : 'User has'}: <span className="font-bold">{user?._postsMeta.count} posts</span></p>
      </div>
      {canEditUser && user?.subscriptions?.length >= 1 && (
        <div className="flex flex-col mt-10">
          <h1 className="text-2xl mb-4">Subscriptions</h1>
          <ForumList>
            {user?.subscriptions.map(sub => (
              <ForumItem key={sub.id} url={sub.url} viewingSelf={viewingSelf} {...sub} />
            ))}
          </ForumList>
        </div>
      )}
      {user?._postsMeta.count >= 1 && (
        <PreviousPosts userID={user?.id} userName={user?.name} />
      )}
    </div>
  )
}

export default UserDetails
