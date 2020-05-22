import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import Head from 'next/head'

import ForumContainer from 'components/ForumContainer'
import NotFound from 'components/404'
import Error from 'components/Error'
import LoadingSpinner from 'components/LoadingSpinner'

export const FORUM_QUERY = gql`
query FORUM_QUERY($url: String) {
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
    threads(orderBy: "lastPost_DESC") {
      id
      title
      url
      lastPost
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
  }
}
`
const Forum = () => {
  const router = useRouter()

  const { url } = router.query
  const { data, loading, error } = useQuery(FORUM_QUERY, {
    variables: { url }
  })

  if (loading) {
    return <LoadingSpinner />
  } else if (error) {
    return <Error />
  } else if (data?.allForums?.length > 0) {
    const forum = data.allForums[0]
    return (
      <>
        <Head>
          <title>
            Fora | {forum.name}
          </title>
        </Head>
        <ForumContainer {...forum} />
      </>
    )
  } else {
    return <NotFound />
  }
}

export default Forum
