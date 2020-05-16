import gql from 'graphql-tag'
import { useRouter } from 'next/router'

const SEARCH_QUERY = gql`
query SEARCH_QUERY($query: String) {
  allForums(search: $query ) {
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
  allThreads {
    id
  }
}
`

const Search = () => {
  const router = useRouter()
  const { q } = router.query

  return (
    <div>
      <div>Search results here!</div>
      <div>Search term: {q}</div>
    </div>
  )
}

export default Search
