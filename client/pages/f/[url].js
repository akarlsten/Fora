import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const FORUM_QUERY = gql`
query FORUM_QUERY($url: String) {
  allForums(where: {
    url: $url
  }) {
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
  }
}
`
const Forum = () => {
  const router = useRouter()
  const { url } = router.query
  const { data, loading } = useQuery(FORUM_QUERY, {
    variables: { url }
  })

  return (
    <div>
      {loading ? (
        <p>Loading forum..</p>
      )
        : (
          <React.Fragment>
            <h1>{data.allForums[0].title}</h1>
            <p>{data.allForums[0]._threadsMeta.count}</p>
            {data.allForums[0].threads.map(thread => (
              <div key={thread.id}>
                <p>{thread.title}</p>
                <p>{thread._postsMeta.count}</p>
              </div>
            ))}
          </React.Fragment>
        )}

    </div>
  )
}

export default Forum
