import PostItem from 'components/PostItem'

const PostList = ({ posts, color, canEditAll, forum, threadID }) => {
  return (
    <div className={`w-full rounded bg-white border border-${color || 'pink'}-200 divide-y divide-${color || 'pink'}-200`}>
      {posts.map(post => (
        <PostItem key={post.id} forum={forum} threadID={threadID} canEditAll={canEditAll} color={color} {...post} />
      ))}
    </div>
  )
}

export default PostList
