import Link from 'next/link'

const CreateForumButton = () => (
  <div className="flex justify-end items-center">
    <Link href="/create">
      <button className={'transition duration-100 ease-in-out transform hover:-translate-y-1 hover:shadow-lg p-2 rounded border border-pink-200 bg-white hover:bg-pink-400 hover:border-pink-300 ml-4 flex flex-col items-center'}>
        <div className="flex items-center">
          <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          <span className="font-display">Create Forum</span>
        </div>
        <span className="text-xs">Create your own community.</span>
      </button>
    </Link>
  </div>
)

export default CreateForumButton
