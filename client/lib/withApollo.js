import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/link-error'
import { getDataFromTree } from '@apollo/react-ssr'
import { createUploadLink } from 'apollo-upload-client'
import withApollo from 'next-with-apollo'
import { devEndpoint, testEndpoint, prodEndpoint } from 'config'

const endpoint = process.env.ENDPOINT === 'test' ? testEndpoint : process.env.NODE_ENV === 'production' ? prodEndpoint : devEndpoint
console.log(endpoint)
export function createClient ({ headers, initialState } = {}) {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            // console.log(
            //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            // )
          }
          )
        }
        if (networkError) {
          console.log(
            `[Network error]: ${networkError}. Backend is unreachable.`
          )
        }
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      createUploadLink({
        uri: endpoint,
        fetchOptions: {
          credentials: 'include'
        },
        // pass the headers along from this request. This enables SSR with logged in state
        headers
      })
    ]),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default withApollo(createClient, { getDataFromTree })
