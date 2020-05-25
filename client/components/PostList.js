import PostItem from 'components/PostItem'

const PostList = ({ posts, color, canEditAll }) => {
  return (
    <div className={`w-full rounded bg-white border border-${color || 'pink'}-200 divide-y divide-${color || 'pink'}-200`}>
      {posts.map(post => (
        <PostItem key={post.id} canEditAll={canEditAll} owner={post.owner} content={post.content} color={color} />
      ))}
    </div>
  )
}

export default PostList
