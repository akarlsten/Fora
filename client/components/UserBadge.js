import Link from 'next/link'

const UserBadge = ({ name, displayName, avatar, isAdmin, color }) => {
  return (
    <Link href='/u/[username]' as={`/u/${name}`}>
      <a title={`${displayName} - @${name}`} className={`flex items-center text-gray-800 hover:text-${color || 'pink'}-400`}>
        {avatar ? (
          <img loading="lazy" className={'w-8 h-8 border border-gray-400 rounded-full mr-2'} src={avatar.publicUrlTransformed} alt="" />
        ) : (
          <svg className="w-8 h-8 rounded-full mr-2 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${color || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
        <div className="flex flex-col items-start">
          <p className={`text-sm leading-tight font-bold ${isAdmin && 'text-red-400'}`}>{displayName}</p>
          <div className="text-xs leading-tight text-gray-700">
            @{name}
          </div>
        </div>
      </a>
    </Link>
  )
}

//         <svg className="h-5 w-5 fill-current pl-2" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>

export default UserBadge
