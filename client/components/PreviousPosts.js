import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'

import { useUser } from 'hooks/useUser'
import { postsPerPage } from 'config'
import Pagination from 'components/Pagination'
import LoadingSpinner from 'components/LoadingSpinner'
import Error from 'components/Error'
import PostWithThread from 'components/PostWithThread'

const USER_POSTS = gql`
query USER_POSTS($userID: ID!, $viewerIsAdmin: Boolean, $skip: Int = 0, $first: Int = ${postsPerPage}) {
  User(where: { id: $userID}) {
    id
    _postsMeta(where: {
      OR: [
        { thread: { forum: { isBanned: false } }},
        { thread: {forum: { isBanned: $viewerIsAdmin }}}
      ]
    }) {
      count
    }
    posts(first: $first, skip: $skip, orderBy: "createdAt_DESC", where: {
      OR: [
        { thread: { forum: { isBanned: false } }},
        { thread: {forum: { isBanned: $viewerIsAdmin }}}
      ]
      }) {
      id
      isEdited
      isDeleted
      content
      createdAt
      updatedAt
      postNumber
      thread {
        id
        title
        url
        _postsMeta {
          count
        }
        forum {
          id
          icon {
          publicUrlTransformed(transformation: {
            width:"200",
            height:"200",
            crop:"fill",
            gravity:"center"
          })
          }
          isBanned
          colorScheme
          name
          url
        }
      }
    }
  }
}
`

const PreviousPosts = ({ userID, userName }) => {
  const loggedIn = useUser()
  const router = useRouter()
  const { p } = router.query

  const viewingSelf = loggedIn?.id === userID

  const privateUrl = viewingSelf ? '/me' : '/u/[username]'
  const publicUrl = viewingSelf ? '/me' : `/u/${userName}`

  const page = +p || 1
  const perPage = postsPerPage

  const { data, loading, error } = useQuery(USER_POSTS, {
    variables: { userID, viewerIsAdmin: loggedIn?.isAdmin, first: perPage, skip: page * perPage - perPage },
    fetchPolicy: 'cache-and-network' // maybe change to cache-and-network
  })

  if (loading) {
    return <LoadingSpinner />
  } else if (data) {
    const user = data.User
    const count = user?._postsMeta.count
    const pages = Math.ceil(count / perPage)

    if (pages > 1 && page > pages) {
      router.push({
        pathname: privateUrl,
        query: { p: pages }
      },
      {
        pathname: publicUrl,
        query: { p: pages }
      })
    }
    return (
      <div className="flex flex-col mt-10">
        <div className="flex justify-between items-center my-4 max-w-6xl">
          <h1 className="text-2xl mr-4">Post History</h1>
          <Pagination count={count} page={page} perPage={perPage} privateUrl={privateUrl} publicUrl={publicUrl} />
        </div>
        {user?.posts.map(post => (
          <PostWithThread key={post.id} post={post} thread={post.thread} forum={post.thread.forum} perPage={perPage} />
        ))}
      </div>
    )
  } else {
    return <Error />
  }
}

export default PreviousPosts
