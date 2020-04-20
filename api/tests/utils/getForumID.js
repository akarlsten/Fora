import { graphqlRequest } from '@keystonejs/test-utils'

export default function getForumID (keystone, name) {
  return graphqlRequest({
    keystone,
    query: `
      query($name: String) {
        allForums(
          where: {
            name: $name
          }
        ) {
          id
        }
      }
    `,
    variables: { name }
  }).then(({ data, error }) => {
    return data.allForums[0].id || {}
  })
}
