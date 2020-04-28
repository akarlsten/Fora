/* export default async create => {
  const users = await Promise.all([
    create('User', {
      name: 'Adde C',
      email: 'adam@wow.com',
      password: 'awoo1234',
      isAdmin: true
    }),
    create('User', {
      name: 'User Pepp',
      email: 'test@wow.com',
      password: 'awoo1234'
    }),
    create('User', {
      name: 'User Bepp',
      email: 'test2@wow.com',
      password: 'awoo1234'
    })
  ])

  const forums = await Promise.all([
    create('Forum', { name: 'Hej Hopp', url: 'hejhopp', owner: users[1].id, threads: [], moderators: [] }),
    create('Forum', { name: 'test2', url: 'test2', owner: users[0].id, threads: [], moderators: [] })
  ])

  return { users, forums }
} */

export const users = [
  {
    name: 'Adde C',
    email: 'adam@wow.com',
    password: 'awoo1234',
    isAdmin: true
  }, {
    name: 'User Pepp',
    email: 'test@wow.com',
    password: 'awoo1234'
  }, {
    name: 'User Bepp',
    email: 'test2@wow.com',
    password: 'awoo1234'
  },
  {
    name: 'A fourth user',
    email: 'test3@wow.com',
    password: 'awoo1234'
  },
  {
    name: 'Fifth user',
    email: 'test4@wow.com',
    password: 'awoo1234'
  },
  {
    name: 'Banned',
    email: 'banned@wow.com',
    password: 'awoo1234'
  }
]

export const forums = [
  { name: 'Hej Hopp', url: 'hejhopp', owner: { where: { email: 'adam@wow.com' } }, threads: [], moderators: [], isBanned: false },
  { name: 'test2', url: 'test2', owner: { where: { email: 'test@wow.com' } }, threads: [], bannedUsers: [{ where: { email: 'banned@wow.com' } }], moderators: [{ where: { email: 'test3@wow.com' } }, { where: { email: 'test4@wow.com' } }], isBanned: false },
  { name: 'bannedforum', url: 'bannedforum', owner: { where: { email: 'adam@wow.com' } }, threads: [], moderators: [], isBanned: true }
]

export default {
  User: users,
  Forum: forums
}
