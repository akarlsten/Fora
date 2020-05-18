import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useEffect } from 'react'

import { useUser } from 'hooks/useUser'
import { useTheme } from 'context/ColorContext'
import ForumItem from 'components/ForumItem'
import ForumList from 'components/ForumList'

import { createClient } from 'lib/withApollo'

const FORUM_QUERY = gql`
query FORUM_QUERY {
  allForums {
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
}
`

const Index = (/* data */) => {
  const loggedIn = useUser()
  const { data, loading } = useQuery(FORUM_QUERY)
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('pink')
  }, [])

  return (
    <div className="container mx-auto">
      <h1 className="font-sans text-gray-700 font-bold text-2xl mb-2">Forums</h1>
      <ForumList>
        {loading ? (
          <p>Loading forums..</p>
        )
          : data.allForums.map(forum => (
            <ForumItem key={forum.id} userCount={forum._subscribersMeta.count} threadCount={forum._threadsMeta.count} {...forum} />
          ))}
      </ForumList>
    </div>
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
