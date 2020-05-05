import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const FORUM_QUERY = gql`
query FORUM_QUERY {
  allForums {
    id
    name
  }
}
`

const Index = ({ query }) => {
  const { data, loading } = useQuery(FORUM_QUERY)

  return (
    <div>
      <h1 className="font-sans text-gray-700 font-light text-5xl">Here are forums!</h1>
      {loading ? (
        <p>Loading forums..</p>
      )
        : data.allForums.map(forum => (
          <p key={forum.id}>{forum.name}</p>
        ))}
    </div>
  )
}

export default Index
