import { format } from 'd3-format'
import Link from 'next/link'

const PostItem = ({ owner, content, color }) => {
  return (
    <div className={`flex items-center divide-x divide-${color || 'pink'}-200`}>
      <div className="px-4 py-2 font-bold justify-center items-center flex flex-row self-center w-48">
        {owner.name}
      </div>
      <div className="px-4 py-2">{content}</div>
      <div className={`flex justify-center items-center divide-x divide-${color || 'pink'}-200`}>
      </div>
    </div>
  )
}

export default PostItem
