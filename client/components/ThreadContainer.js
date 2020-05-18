import Link from 'next/link'
import PostList from 'components/PostList'

const ThreadContainer = (props) => {
  const { title, forum, posts } = props

  return (
    <div className="flex flex-col max-w-full">
      <Link href="/f/[url]" as={`/f/${forum.url}`}>
        <div className="flex items-center mb-8 cursor-pointer">
          <svg className="w-6 h-6" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          {forum.icon ? (
            <img className="w-8 h-8 rounded-full mr-1" src={forum.icon.publicUrlTransformed} alt="" />
          ) : (
            <svg className="w-8 h-8 rounded-full mr-1 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className={`text-${forum.colorScheme || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
              <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
              <circle cx="96" cy="59" r="43" fill="white" />
            </svg>
          )}
          <div className="flex items-center justify-between w-full">
            <h1 className="font-bold text-lg">{forum.name}</h1>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-4xl">{title}</h1>
      </div>
      <div className="flex flex-row items-start">
        <PostList color={forum.colorScheme} posts={posts} />
      </div>
    </div>
  )
}

export default ThreadContainer
