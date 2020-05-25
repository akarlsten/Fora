import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useEffect } from 'react'

import { useUser } from 'hooks/useUser'
import { useTheme } from 'context/ColorContext'
import ForumItem from 'components/ForumItem'
import ForumList from 'components/ForumList'
import Landing from 'components/Landing'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'

import { createClient } from 'lib/withApollo'

export const FORUM_QUERY = gql`
query FORUM_QUERY {
  allForums(orderBy: "subscribers_DESC", first: 9) {
    id
    name
    url
    description
    colorScheme
    isBanned
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
}
`

export const SUBSCRIBED_QUERY = gql`
query SUBSCRIBED_QUERY {
  authenticatedUser {
    id
    subscriptions {
      id
      name
      url
      description
      colorScheme
      isBanned
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
  }
}
`

const Index = (/* data */) => {
  const loggedIn = useUser()
  const { data, loading, error } = useQuery(FORUM_QUERY)
  const { data: subData, loading: subLoading, error: subError } = useQuery(SUBSCRIBED_QUERY)
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('pink')
  }, [])

  // TODO: Try to do this in the request to server, we need orderBy on the nested field _subscribersMeta, which doesnt work?
  const sorted = data?.allForums && [...data.allForums]
    .filter(forum => !subData?.authenticatedUser?.subscriptions.some(a => a.id === forum.id))
    .sort((a, b) => b._subscribersMeta.count - a._subscribersMeta.count)

  const subSorted = subData?.authenticatedUser?.subscriptions && [...subData.authenticatedUser.subscriptions].sort((a, b) => b._subscribersMeta.count - a._subscribersMeta.count)

  if (error || subError) return <Error />

  return (
    <>
      {!loggedIn && (
        <Landing />
      )}
      <div className="container mx-auto">
        {loggedIn && (
          subLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="mb-8">
              <h1 className="font-sans font-bold text-2xl mb-2">Your subscriptions</h1>
              <ForumList>
                {subData && (
                  subSorted.map(forum => (
                    <ForumItem key={forum.id} userCount={forum._subscribersMeta.count} threadCount={forum._threadsMeta.count} {...forum} />
                  ))
                )}
              </ForumList>
            </div>
          )
        )}
        {sorted?.length >= 1 && (
          <>
            <h1 className="font-sans font-bold text-2xl mb-2">Popular Forums</h1>
            <ForumList>
              {loading ? (
                <LoadingSpinner />
              )
                : (sorted.map(forum => (
                  <ForumItem key={forum.id} userCount={forum._subscribersMeta.count} threadCount={forum._threadsMeta.count} {...forum} />
                )))}
            </ForumList>
          </>
        )}
      </div>
    </>
  )
}

// SSR pattern
// export const getServerSideProps = async (context) => {
//   const apolloClient = createClient()

//   const { data } = await apolloClient.query({
//     query: FORUM_QUERY
//   })

//   return { props: data }
// }

export default Index
