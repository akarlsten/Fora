import { format } from 'd3-format'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

const PostItem = ({ owner, content, color }) => {
  return (
    <div className={'flex'}>
      <div className={'px-4 py-2 justify-start items-center flex flex-col w-14 md:w-40 lg:w-56 flex-shrink-0'}>
        <span className="font-bold">
          {owner.name}
        </span>
        {owner.avatar ? (
          <img className={`my-2 w-12 md:w-32 lg:w-48 border border-${color || 'pink'}-200`} src={owner.avatar.publicUrlTransformed} alt="" />
        ) : (
          <svg className={`my-2 rounded-full border border-${color || 'pink'}-200 fill-current`} width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${color || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
      </div>
      <div className={`px-4 py-2 border-l border-${color || 'pink'}-200`}><ReactMarkdown source={content} /></div>
      <div className={`flex justify-center items-center divide-x divide-${color || 'pink'}-200`}>
      </div>
    </div>
  )
}

export default PostItem
