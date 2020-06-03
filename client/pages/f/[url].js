import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import Head from 'next/head'

import { useUser } from 'hooks/useUser'
import ForumContainer from 'components/ForumContainer'
import NotFound from 'components/404'
import Error from 'components/Error'
import LoadingSpinner from 'components/LoadingSpinner'

import { threadsPerPage } from 'config'

export const FORUM_QUERY = gql`
query FORUM_QUERY($url: String, $skip: Int = 0, $first: Int = ${threadsPerPage}) {
  allForums(where: {
    url: $url
  }) {
    id
    name
    url
    description
    colorScheme
    createdAt
    isBanned
    bannedUsers {
      id
    }
    icon {
      publicUrlTransformed(transformation: {
        width:"200",
        height:"200",
        crop:"fill",
        gravity:"center"
      })
    }
    threads(skip: $skip, first: $first, sortBy: [isStickied_DESC, lastPost_DESC]) {
      id
      title
      url
      lastPost
      lastPoster {
        name
        displayName
        isAdmin
        avatar {
          publicUrlTransformed(transformation: {
            width:"300",
            height:"300",
            crop:"fill",
            gravity:"center"
          })
        }
      }
      _postsMeta {
        count
      }
      updatedAt
      state
      isStickied
      isDeleted
    }
    _threadsMeta {
      count
    }
    _subscribersMeta {
      count
    }
    owner {
      id
      name
      displayName
      isAdmin
      avatar {
        publicUrlTransformed(transformation: {
          width:"300",
          height:"300",
          crop:"fill",
          gravity:"center"
        })
      }
    }
    moderators {
      id
      name
      displayName
      isAdmin
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
}
`

const Forum = () => {
  const user = useUser()
  const router = useRouter()

  const { url, p } = router.query

  // cast p to number
  const page = +p || 1
  const perPage = user?.postsPerPage || threadsPerPage

  const { data, loading, error, refetch } = useQuery(FORUM_QUERY, {
    variables: { url, first: perPage, skip: page * perPage - perPage },
    fetchPolicy: 'cache-and-network' // maybe cache-and-network
    // pollInterval: 25000 // poll the server for updates every 10 secs
  })

  if (loading && !data) {
    return <LoadingSpinner />
  } else if (error) {
    return <Error />
  } else if (data?.allForums?.length > 0) {
    const forum = data.allForums[0]
    const count = forum._threadsMeta.count
    const pages = Math.ceil(count / perPage)

    if (pages > 1 && page > pages) {
      router.push({
        pathname: '/f/[url]',
        query: { p: pages }
      },
      {
        pathname: `/f/${url}`,
        query: { p: pages }
      })
    }

    return (
      <>
        <Head>
          <title>
            Fora | {forum.name}
          </title>
          <meta name="description" content={`${forum.name} - ${forum.description}`} />
        </Head>
        <ForumContainer page={page} pages={pages} count={count} {...forum} />
      </>
    )
  } else {
    return <NotFound />
  }
}

export default Forum
