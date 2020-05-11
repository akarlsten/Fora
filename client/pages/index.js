import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useUser } from '../hooks/useUser'
import ForumItem from '../components/ForumItem'
import ForumList from '../components/ForumList'

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

const Index = ({ query }) => {
  const loggedIn = useUser()
  const { data, loading } = useQuery(FORUM_QUERY)

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

export default Index
