import { multiAdapterRunners, graphqlRequest } from '@keystonejs/test-utils'
import setupTest from '../setupTest'

multiAdapterRunners('mongoose').map(({ runner, adapterName }) => {
  test('test', runner(setupTest, async ({ keystone, create }) => {
    const users = await Promise.all([
      create('User', {
        name: 'Adde C',
        email: 'adam@wow.com',
        password: 'awoo1234'
      }),
      create('User', {
        name: 'User 2',
        email: 'test@wow.com',
        password: 'awoo1234'
      })
    ])
    const forum = await create('Forum', { name: 'Hej Hopp', owner: users[0].id })

    const { data, errors } = await graphqlRequest({
      keystone,
      query: `
      query {
        allForums {
          name
          owner {
            name
          }
        }
      }
      `
    })

    console.log(JSON.stringify(data))
    console.log(JSON.stringify(errors))
  }))
})
