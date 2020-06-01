import gql from 'graphql-tag'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Head from 'next/head'

import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'
import ForumList from 'components/ForumList'
import ForumItem from 'components/ForumItem'
import ThreadItem from 'components/ThreadItem'
import { useUser } from 'hooks/useUser'
import { postsPerPage } from 'config'
import { useTheme } from 'context/ColorContext'
import UserSearchResult from 'components/UserSearchResult'

const SEARCH_QUERY = gql`
query SEARCH_QUERY($query: String, $isAdmin: Boolean!) {
  allForums(where: {
    OR: [
      {name_contains_i: $query},
      {description_contains_i: $query}
    ],
    AND: [
      {isBanned: false}
    ]
  }, first: 9 ) {
    id
    name
    url
    description
    colorScheme
    icon {
      publicUrlTransformed(transformation: {
        width:"200",
        height:"200",
        crop:"fill",
        gravity:"center"
      })
    }
    _threadsMeta {
      count
    }
    _subscribersMeta {
      count
    }
  }
  allThreads(where: {
    OR: [
      {title_contains_i: $query},
      {url_contains_i: $query}
    ],
    AND: [
      {forum: { isBanned: $isAdmin }}
    ]
  }, first: 20) {
    id
    title
    url
    forum {
      id
      icon {
      publicUrlTransformed(transformation: {
        width:"200",
        height:"200",
        crop:"fill",
        gravity:"center"
      })
      }
      isBanned
      colorScheme
      name
      url
    }
    lastPost
    lastPoster {
      name
    }
    _postsMeta {
      count
    }
  }
  allUsers(where: {
    OR: [
      {name_contains_i: $query},
      {displayName_contains_i: $query}
    ]
  }, first: 10) {
    id
    name
    displayName
    isAdmin
    isGlobalBanned
    avatar {
      publicUrlTransformed(transformation: {
      width:"300",
      height:"300",
      crop:"fill",
      gravity:"center"
    })
    }
  }
}
`

const Search = () => {
  const router = useRouter()
  const { q } = router.query
  const user = useUser()
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('pink')
  }, [])

  const perPage = user?.postsPerPage || postsPerPage

  const { data, loading } = useQuery(SEARCH_QUERY, {
    variables: { query: q, isAdmin: !!user?.isAdmin }
  })

  if (loading) {
    return <LoadingSpinner />
  } else if (data) {
    const forums = data.allForums
    const threads = data.allThreads.filter(thread => thread.forum)
    const users = data.allUsers

    console.log(data)

    return (
      <>
        <Head>
          <title>
          Fora | Searching for {q}
          </title>
        </Head>
        <h1 className="font-sans font-medium text-2xl mb-8">Search results for <span className="text-3xl font-bold">{q}</span>:</h1>
        {users.length < 1 && threads.length < 1 && forums.length < 1 && (
          <div className="w-full flex flex-col justify-center items-center mt-10">
            <img className="w-64 self-center mb-10" src="/ufo.svg" style={{ filter: 'grayscale(0%) opacity(100%)' }} alt="" />
            <p className="text-3xl font-light text-gray-600">Sorry, we couldn&apos;t find anything!</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col sm:w-3/4">
            {forums.length >= 1 && (
              <div className="mb-8">
                <h1 className="font-sans font-semibold text-xl mb-2">Forums:</h1>
                <ForumList>
                  {forums.map(forum => (
                    <ForumItem key={forum.id} userCount={forum._subscribersMeta.count} threadCount={forum._threadsMeta.count} {...forum} />
                  ))}
                </ForumList>
              </div>
            )}
            {threads.length >= 1 && (
              <>
                <h1 className="font-sans font-semibold text-xl mb-2">Threads:</h1>
                {threads.map(thread => (
                  <div key={thread?.id} className={`bg-white max-w-6xl mb-2 p-2 rounded border border-${thread.forum?.colorScheme || 'pink'}-200`}>
                    <div className={`w-full rounded bg-white border border-${thread.forum?.colorScheme || 'pink'}-200 divide-y divide-${thread.forum?.colorScheme || 'pink'}-200`}>
                      <ThreadItem lastPoster={thread?.lastPoster} perPage={perPage} forumUrl={thread?.forum?.url} url={thread?.url} title={thread?.title} count={thread?._postsMeta.count} color={thread?.forum?.colorScheme} />
                    </div>
                    <div className="flex items-center mt-2">
                      {thread?.forum?.icon ? (
                        <img className="w-6 h-6 rounded-full mr-1" src={thread.forum.icon.publicUrlTransformed} alt="" />
                      ) : (
                        <svg className="w-6 h-6 rounded-full mr-1 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle className={`text-${thread?.forum?.colorScheme || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
                          <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                          <circle cx="96" cy="59" r="43" fill="white" />
                        </svg>
                      )}
                      <div className="flex items-center justify-between w-full">
                        <h1 className="font-bold text-md">{thread?.forum?.name}</h1>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="sm:ml-4 flex flex-col sm:w-1/4">
            {users.length >= 1 && (
              <>
                <h1 className="font-sans font-semibold text-xl mb-2">Users:</h1>
                <div className="flex flex-col items-start space-y-2">
                  {users.map(user => (
                    <UserSearchResult key={user.id} name={user.name} displayName={user.displayName} avatar={user.avatar} isAdmin={user.isAdmin} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    )
  } else {
    return <Error />
  }
}

export default Search
