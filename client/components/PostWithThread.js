import { formatDistanceToNow, parseISO } from 'date-fns'
import Link from 'next/link'

import ThreadItem from 'components/ThreadItem'
import RenderMarkdown from 'components/RenderMarkdown'

const PostWithThread = ({ post, thread, forum, perPage }) => {
  const pagePostIsOn = Math.ceil(post?.postNumber / perPage) || 1

  return (
    <div key={thread?.id} className={`bg-white max-w-6xl mb-2 p-2 rounded border border-${thread.forum?.colorScheme || 'pink'}-200`}>
      <Link
        href={{ pathname: '/f/[url]/[tid]', query: { p: pagePostIsOn, post: post.id } }}
        as={{
          pathname: `/f/${forum.url}/${thread.url}`, query: { p: pagePostIsOn, post: post.id }
        }}>
        <a>
          <div className="flex items-center mb-2">
            {thread?.forum?.icon ? (
              <img className="w-5 h-5 rounded-full mr-1" src={thread.forum.icon.publicUrlTransformed} alt="" />
            ) : (
              <svg className="w-5 h-5 rounded-full mr-1 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className={`text-${thread?.forum?.colorScheme || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
                <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
                <circle cx="96" cy="59" r="43" fill="white" />
              </svg>
            )}
            <div className="flex items-center justify-between w-full">
              <h1 className="font-bold text-sm">{thread?.forum?.name}</h1>
            </div>
          </div>
          <div className="flex justify-between items-center my-2">
            <h2 className="font-medium ml-1">{thread?.title}</h2>
            <p title={parseISO(post.createdAt)} className="text-gray-600 text-xs flex items-center">
              <svg className="fill-current h-4 w-4 mr-1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
              {formatDistanceToNow(parseISO(post.createdAt))} ago
            </p>
          </div>
        </a>
      </Link>
      <div className={`w-full p-2 rounded bg-white border border-${thread?.forum?.colorScheme || 'pink'}-200`}>
        <RenderMarkdown content={post?.content} color={thread?.forum?.colorScheme} />
      </div>
    </div>
  )
}

export default PostWithThread
