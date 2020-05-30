import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../hooks/useUser'
import gql from 'graphql-tag'

import NotFound from 'components/404'
import Error from 'components/Error'
import LoadingSpinner from 'components/LoadingSpinner'
import ThreadContainer from 'components/ThreadContainer'

import { postsPerPage } from 'config'

export const THREAD_QUERY = gql`
query THREAD_QUERY($slug: String, $skip: Int = 0, $first: Int = ${postsPerPage}) {
  allThreads(where: {url: $slug }) {
    id
    url
    title
    state
    isStickied
    isDeleted
    forum {
      id
      name
      url
      colorScheme
      bannedUsers {
        id
      }
      owner {
        id
      }
      moderators {
        id
      }
      isBanned
      icon {
        publicUrlTransformed(transformation: {
          width:"200",
          height:"200",
          crop:"fill",
          gravity:"center"
      })
    }
    }
    _postsMeta { 
      count
    }
    posts(first: $first, skip: $skip, orderBy: "createdAt_ASC") {
      id
      owner {
        id
        name
        displayName
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
      isEdited
      isDeleted
      content
      createdAt
      updatedAt
    }
  }
}
`

const Thread = ({ query }) => {
  const router = useRouter()
  const user = useUser()

  const { url, tid, p } = router.query

  // cast p to number
  const page = +p || 1
  const perPage = user?.postsPerPage || postsPerPage

  const { data, loading, error } = useQuery(THREAD_QUERY, {
    variables: { slug: tid, first: perPage, skip: page * perPage - perPage },
    fetchPolicy: 'network-only' // maybe change to cache-and-network
  })

  if (loading) {
    return <LoadingSpinner />
  } else if (error) {
    return <Error />
  } else if (data && data.allThreads.length > 0) {
    const thread = data.allThreads[0]
    const count = thread._postsMeta.count
    const pages = Math.ceil(count / perPage)

    if (pages > 1 && page > pages) {
      router.push({
        pathname: '/f/[url]/[tid]',
        query: { p: pages }
      },
      {
        pathname: `/f/${url}/${tid}`,
        query: { p: pages }
      })
    }

    return (
      <>
        <Head>
          <title>
          Fora | {thread.forum.name} | {thread.title}
          </title>
        </Head>
        <ThreadContainer perPage={perPage} page={page} pages={pages} count={count} {...thread} />
      </>
    )
  } else {
    return <NotFound />
  }
}

export default Thread
