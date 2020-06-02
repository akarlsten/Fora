import { format } from 'd3-format'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import UserBadge from 'components/UserBadge'
import { useUser } from 'hooks/useUser'

const ThreadItem = ({ id, forumUrl, url, title, count, color, perPage, lastPoster, state, isStickied }) => {
  const loggedIn = useUser()
  const pages = Math.ceil(count / (perPage))

  const pageArray = [...Array(pages).keys()].map(page => page + 1)

  const [lastRead, setLastRead] = useState(null)

  useEffect(() => {
    if (window.localStorage) {
      const threadReadData = JSON.parse(window.localStorage.getItem(`${id}/${loggedIn?.id || 'anon'}`))
      setLastRead(threadReadData)
    }
  }, [loggedIn])

  const pagePostIsOn = Math.ceil(lastRead?.postNumber / perPage) || 1
  const wasLastPostOnPage = lastRead?.postNumber / (perPage * pagePostIsOn) === 1

  const calculatedQueryString = !wasLastPostOnPage ? {
    p: pagePostIsOn,
    post: lastRead?.postID
  } : {
    p: pagePostIsOn + 1
  }

  const handleForget = (e) => {
    e.preventDefault()
    window.localStorage.removeItem(`${id}/${loggedIn?.id || 'anon'}`)
    setLastRead(null)
  }

  return (
    <div className={`flex justify-between items-center text-xs xs:text-sm sm:text-base ${state === 'closed' && 'opacity-50'}`}>
      <Link href="/f/[url]/[tid]" as={`/f/${forumUrl}/${url}`}>
        <a className={`px-4 py-2 flex font-semibold items-center flex-grow truncate ${isStickied && 'text-green-500'}`}>
          {isStickied && (
            <svg className="-ml-2 mr-1 fill-current h-4 w-4" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd"></path></svg>
          )}
          {title}
        </a>
      </Link>
      <div className={'flex justify-end items-center flex-grow'}>
        {/* This will ensure lastRead.postNumber exists and is > 0 */}
        {lastRead?.postNumber - count < 0 && (
          <div className={'px-4 flex items-center text-orange-400'}>
            <Link
              href={{ pathname: '/f/[url]/[tid]', query: calculatedQueryString }}
              as={{
                pathname: `/f/${forumUrl}/${url}`, query: calculatedQueryString
              }}>
              <a className="flex items-center transition duration-100 ease-in-out transform hover:scale-105" title={`${count - lastRead.postNumber} new posts`}>
                <svg className=" fill-current h-5 w-5" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path></svg>
                <div className="font-bold">
                  {count - lastRead.postNumber}
                </div>
              </a>
            </Link>
            <a title="Forget this thread" onClick={handleForget} className="p-1 cursor-pointer rounded text-red-400 hover:text-red-600">
              <svg className="fill-current h-5 w-5" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            </a>
          </div>
        )}
        {pages > 1 && (
          <div className="pr-4 font-bold space-x-1">
            {pages <= 5 && (
              pageArray.map(page => (
                <Link
                  key={`${url}-${page}-link`}
                  href={{
                    pathname: '/f/[url]/[tid]',
                    query: { p: page }
                  }}

                  as={{
                    pathname: `/f/${forumUrl}/${url}`,
                    query: { p: page }
                  }}
                >
                  <a className={`px-1 rounded bg-${color}-400 hover:bg-${color}-600`}>{page}</a>
                </Link>
              ))
            )}
            {pages > 5 && (
              pageArray.slice(0, 3).map(page => (
                <Link
                  key={`${url}-${page}-link`}
                  href={{
                    pathname: '/f/[url]/[tid]',
                    query: { p: page }
                  }}

                  as={{
                    pathname: `/f/${forumUrl}/${url}`,
                    query: { p: page }
                  }}
                >
                  <a key={`${url}-${page}`} className={`px-1 rounded bg-${color}-400 hover:bg-${color}-600`}>{page}</a>
                </Link>
              )))}
            {pages > 6 && (
              <span>...</span>
            )}
            {pages > 5 && (
              pageArray.slice(-3).map(page => (
                <Link
                  key={`${url}-${page}-link`}
                  href={{
                    pathname: '/f/[url]/[tid]',
                    query: { p: page }
                  }}

                  as={{
                    pathname: `/f/${forumUrl}/${url}`,
                    query: { p: page }
                  }}
                >
                  <a key={`${url}-${page}`} className={`px-1 rounded bg-${color}-400 hover:bg-${color}-600`}>{page}</a>
                </Link>
              )))}
          </div>
        )}
        <div className={`sm:border-l border-${color || 'pink'}-200 hidden sm:block px-2 py-1 text-center w-18 sm:w-32 md:w-48 lg:w-56 xl:w-64 text-gray-700 text-sm truncate`}>
          <UserBadge name={lastPoster?.name} displayName={lastPoster?.displayName} avatar={lastPoster?.avatar} isAdmin={lastPoster?.isAdmin} color={color} />
        </div>
        <div className={`sm:border-l border-${color || 'pink'}-200 hidden sm:flex px-4 py-2 font-bold justify-center items-center flex-row self-center w-18 sm:w-24`}>
          <span className="font-base mr-1">{format('.3~s')(count)}</span>
          <svg className={`text-${color}-600 w-5`} viewBox="0 0 24 24"><path className="heroicon-ui" d="M2 15V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v15a1 1 0 0 1-1.7.7L16.58 17H4a2 2 0 0 1-2-2zM20 5H4v10h13a1 1 0 0 1 .7.3l2.3 2.29V5z" /></svg>
        </div>
      </div>
    </div>
  )
}

export default ThreadItem
