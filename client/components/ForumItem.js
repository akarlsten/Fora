import { format } from 'd3-format'
import Link from 'next/link'
import { useUser } from 'hooks/useUser'

import SubscribeButton from 'components/SubscribeButton'

const ForumItem = ({ id, icon, name, description, threadCount, userCount, colorScheme, url, isBanned, viewingSelf }) => {
  const color = colorScheme || 'pink'
  const loggedIn = useUser()

  return (
    <Link href="/f/[url]" as={`/f/${url}`}>
      <a className="max-w-sm w-full md:max-w-lg lg:max-w-full">
        <div className={`overflow-hidden h-full ${viewingSelf ? 'items-center' : 'divide-x'} shadow-md cursor-pointer hover:shadow-xl transition duration-100 ease-in-out transform hover:-translate-y-1 bg-white rounded ${viewingSelf ? 'p-2' : 'p-4'} flex flex-row justify-between`}>
          <div className="flex flex-col justify-between leading-normal pr-2 overflow-hidden">
            <div className={`flex items-center ${!viewingSelf && 'pb-1'}`}>
              {!isBanned && (
                icon ? (
                  <img className = "w-10 h-10 rounded-full mr-2" src = { icon.publicUrlTransformed } alt = "" />
                ) : (
                  <svg className = "w-10 h-10 rounded-full mr-2 fill-current" width = "159" height = "159" viewBox = "0 0 159 159" fill = "none" xmlns = "http://www.w3.org/2000/svg">
                    <circle className = {`text-${color}-400`} cx="79.5" cy="79.5" r="79.5" />
                    <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                    <circle cx="96" cy="59" r="43" fill="white" />
                  </svg>
                )
              )}
              {isBanned && (
                <svg className="h-10 w-10 text-red-500 rounded-full mr-2 fill-current" viewBox="0 0 20 20"><path d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              )}
              <div className={`text-gray-800 font-bold text-lg truncate xl:text-xl ${name.length > 18 ? 'md:text-base' : ''}`}>{name}</div>
            </div>
            {description && !isBanned && (
              <p className="text-gray-700 text-sm pt-1">
                {description}
              </p>
            )}
            {isBanned && (
              <p className="text-red-500 font-bold">BANNED!</p>
            )}
          </div>
          {!viewingSelf ? (
            <div className="flex flex-col justify-around leading-normal pl-2">
              <div className="flex flex-col align-middle justify-center text-center mb-1">
                <div className="flex flex-row self-center">
                  <span className="font-bold text-sm mr-1">{format('.3~s')(threadCount)}</span>
                  <svg className={`text-${color}-400 fill-current w-5`} viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>
                </div>
                <span className="text-xs font-semibold">THREADS</span>
              </div>
              <div className="flex flex-col align-middle justify-center text-center mt-1">
                <div className="flex flex-row self-center">
                  <span className="font-bold text-sm mr-1">{format('.3~s')(userCount)}</span>
                  <svg className={`text-${color}-400 fill-current w-5`} viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                </div>
                <span className="text-xs font-semibold">USERS</span>
              </div>
            </div>
          ) : (
            viewingSelf && (
              <div className="px-2">
                <SubscribeButton small={viewingSelf} forumID={id} color={color} />
              </div>
            )
          )}
        </div>
      </a>
    </Link>
  )
}

export default ForumItem
