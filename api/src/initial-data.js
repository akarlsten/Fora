import { randomBytes } from 'crypto'
const randomString = () => randomBytes(6).hexSlice()

export default async keystone => {
  // Check the users list to see if there are any; if we find none, assume
  // it's a new database and initialise the demo data set.
  const users = await keystone.lists.User.adapter.findAll()
  if (!users.length) {
    // Drop the connected database to ensure no existing collections remain
    Object.values(keystone.adapters).forEach(async adapter => {
      await adapter.dropDatabase()
    })
    console.log('! Creating initial data...')
    // // Count existing users
    // const {
    //   data: {
    //     _allUsersMeta: { count }
    //   }
    // } = await keystone.executeQuery(
    // `query {
    //   _allUsersMeta {
    //     count
    //   }
    // }`
    // )

    // if (count === 0) {
    const password = process.env.ADMIN_PASSWORD
    const email = process.env.ADMIN_USER

    const { errors } = await keystone.executeQuery(
      `mutation initialUser($password: String, $email: String) {
            createUser(data: {name: "Admin", email: $email, isAdmin: true, password: $password}) {
              id
            }
          }`,
      {
        variables: {
          password,
          email
        }
      }
    )

    console.log(`

User created:
  email: ${email}
  password: ${password}
Please change these details after initial login.
`)
    console.log(!!errors && errors)
    // }
  }
}
