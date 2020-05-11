import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useUser } from '../../hooks/useUser'
import gql from 'graphql-tag'

import ForumContainer from '../../components/ForumContainer'

const FORUM_QUERY = gql`
query FORUM_QUERY($url: String, $userID: ID) {
  allForums(where: {
    url: $url
  }) {
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
    threads {
      id
      title
      _postsMeta {
        count
      }
      updatedAt
    }
    _threadsMeta {
      count
    }
    _subscribersMeta {
      count
    }
    subscribers(where: {
      id: $userID
    }) {
      id
    }
  }
}
`
const Forum = () => {
  const router = useRouter()
  const user = useUser()

  const { url } = router.query
  const { data, loading } = useQuery(FORUM_QUERY, {
    variables: { url, userID: user && user.id }
  })

  return (
    <div>
      {loading ? (
        <p>Loading forum..</p>
      )
        : (
          <ForumContainer {...data.allForums[0]} />
        )}
    </div>
  )
}

export default Forum
