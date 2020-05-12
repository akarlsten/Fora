import PostItem from './PostItem'

const PostList = ({ posts, color }) => {
  return (
    <div className={`w-full rounded bg-white border border-${color || 'pink'}-200 divide-y divide-${color || 'pink'}-200`}>
      {posts.map(post => (
        <PostItem key={post.id} owner={post.owner} content={post.content} color={color} />
      ))}
    </div>
  )
}

export default PostList
