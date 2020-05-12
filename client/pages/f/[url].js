import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useUser } from '../../hooks/useUser'
import gql from 'graphql-tag'

import ForumContainer from '../../components/ForumContainer'
import NotFound from '../../components/404'

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
    createdAt
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
      url
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
    owner {
      id
      name
    }
    moderators {
      id
      name
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

  // TODO: ADD 404 PAGE, check if data.allforums is empty!!!!!!!!!

  if (loading) {
    return <p>Loading forum..</p>
  } else if (data && data.allForums.length > 0) {
    return <ForumContainer {...data.allForums[0]} />
  } else {
    return <NotFound />
  }
}

export default Forum
