import Link from 'next/link'

const BackToForum = ({ url, iconUrl, color, name }) => {
  return (
    <Link href="/f/[url]" as={`/f/${url}`}>
      <div className="flex text-base items-center mb-8 cursor-pointer self-start">
        <svg className="w-8 h-8" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
        {iconUrl ? (
          <img className="w-8 h-8 rounded-full mr-1" src={iconUrl} alt="" />
        ) : (
          <svg className="w-8 h-8 rounded-full mr-1 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${color || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
        <div className="flex items-center justify-between w-full">
          <h1 className="font-bold text-lg">{name}</h1>
        </div>
      </div>
    </Link>
  )
}

export default BackToForum
