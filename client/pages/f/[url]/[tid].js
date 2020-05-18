import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../hooks/useUser'
import gql from 'graphql-tag'

import NotFound from 'components/404'
import Error from 'components/Error'
import LoadingSpinner from 'components/LoadingSpinner'
import ThreadContainer from 'components/ThreadContainer'

const THREAD_QUERY = gql`
query THREAD_QUERY($slug: String) {
  allThreads(where: {url: $slug }) {
    id
    url
    title
    state
    forum {
      name
      url
      colorScheme
      icon {
        publicUrlTransformed(transformation: {
          width:"100",
          height:"100",
          crop:"fill",
          gravity:"center"
      })
    }
    }
    posts {
      id
      owner {
        name
        avatar {
        publicUrlTransformed(transformation: {
          width:"150",
          height:"150",
          crop:"fill",
          gravity:"center"
        })
        }
      }
      content
      createdAt
      updatedAt
    }
  }
}
`

const Thread = () => {
  const router = useRouter()
  const user = useUser()

  const { url, tid } = router.query

  console.log(url, tid)

  const { data, loading, error } = useQuery(THREAD_QUERY, {
    variables: { slug: tid }
  })

  console.log(data)

  if (loading) {
    return <LoadingSpinner />
  } else if (error) {
    return <Error />
  } else if (data && data.allThreads.length > 0) {
    return <ThreadContainer {...data.allThreads[0]} />
  } else {
    return <NotFound />
  }
}

export default Thread
