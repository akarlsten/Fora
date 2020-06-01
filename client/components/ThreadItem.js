import { format } from 'd3-format'
import Link from 'next/link'
import UserBadge from 'components/UserBadge'

const ThreadItem = ({ forumUrl, url, title, count, color, perPage, lastPoster, state, isStickied }) => {
  const pages = Math.ceil(count / (perPage))

  const pageArray = [...Array(pages).keys()].map(page => page + 1)

  return (

    <div className={`flex justify-between items-center text-xs xs:text-sm sm:text-base ${state === 'closed' && 'opacity-50'}`}>
      <Link href="/f/[url]/[tid]" as={`/f/${forumUrl}/${url}`}>
        <a className="px-4 py-2 font-semibold flex-grow truncate">{title}</a>
      </Link>
      <div className={'flex justify-end items-center flex-grow'}>
        {pages > 1 && (
          <div className="px-4 font-bold space-x-1">
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
