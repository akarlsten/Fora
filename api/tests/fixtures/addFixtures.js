export default async create => {
  const users = await Promise.all([
    create('User', { name: 'Jess', favNumber: 1 }),
    create('User', { name: 'Johanna', favNumber: 8 }),
    create('User', { name: 'Sam', favNumber: 5 })
  ])

  const posts = await Promise.all([
    create('Post', { author: [users[0].id], title: 'One author' }),
    create('Post', { author: [users[0].id, users[1].id], title: 'Two authors' }),
    create('Post', {
      author: [users[0].id, users[1].id, users[2].id],
      title: 'Three authors'
    })
  ])

  return { users, posts }
}
