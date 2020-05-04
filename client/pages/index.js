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
  if (loading) return 'Loading..'

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl">Here are forums!</h1>
      {data.allForums.map(forum => (
        <p key={forum.id}>{forum.name}</p>
      ))}
    </div>
  )
}

export default Index
