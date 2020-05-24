import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'
import ForumList from 'components/ForumList'
import ForumItem from 'components/ForumItem'
import ThreadList from 'components/ThreadList'
import ThreadItem from 'components/ThreadItem'
import { useUser } from 'hooks/useUser'
import { postsPerPage } from 'config'

const SEARCH_QUERY = gql`
query SEARCH_QUERY($query: String) {
  allForums(where: {
    OR: [
      {name_contains_i: $query},
      {description_contains_i: $query}
    ]
  }, first: 9 ) {
    id
    name
    url
    description
    colorScheme
    icon {
      publicUrlTransformed(transformation: {
        width:"100",
        height:"100",
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
    title_contains_i: $query
  }, first: 20) {
    id
    title
    url
    forum {
      id
      icon {
      publicUrlTransformed(transformation: {
        width:"100",
        height:"100",
        crop:"fill",
        gravity:"center"
      })
    }
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
}
`

const Search = () => {
  const router = useRouter()
  const { q } = router.query
  const user = useUser()

  const perPage = user?.postsPerPage || postsPerPage

  const { data, loading } = useQuery(SEARCH_QUERY, {
    variables: { query: q }
  })

  if (loading) {
    return <LoadingSpinner />
  } else if (data) {
    const forums = data.allForums
    const threads = data.allThreads

    return (
      <div className="container mx-auto">
        <h1 className="font-sans font-bold text-2xl mb-8">Search results for &lsquo;{q}&rsquo;:</h1>
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
              <div key={thread.id} className={`bg-white p-2 rounded border border-${thread.forum.colorScheme || 'pink'}-200`}>
                <div className="flex items-center mb-2">
                  {thread.forum.icon ? (
                    <img className="w-8 h-8 rounded-full mr-1" src={thread.forum.icon.publicUrlTransformed} alt="" />
                  ) : (
                    <svg className="w-8 h-8 rounded-full mr-1 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className={`text-${thread.forum.colorScheme || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
                      <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                      <circle cx="96" cy="59" r="43" fill="white" />
                    </svg>
                  )}
                  <div className="flex items-center justify-between w-full ml-1">
                    <h1 className="font-bold text-lg">{thread.forum.name}</h1>
                  </div>
                </div>
                <div className={`w-full rounded bg-white border border-${thread.forum.colorScheme || 'pink'}-200 divide-y divide-${thread.forum.colorScheme || 'pink'}-200`}>
                  <ThreadItem lastPoster={thread.lastPoster} perPage={perPage} forumUrl={thread.forum.url} url={thread.url} title={thread.title} count={thread._postsMeta.count} color={thread.forum.colorScheme} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    )
  } else {
    return <Error />
  }
}

export default Search
