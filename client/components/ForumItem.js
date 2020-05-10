import { format } from 'd3-format'

const ForumItem = ({ name, description, _threadsMeta: tc }) => {
  return (
    <div className="max-w-sm w-full lg:max-w-full">
      <div className="divide-x shadow-md cursor-pointer hover:shadow-xl transition duration-100 ease-in-out transform hover:-translate-y-1 bg-white rounded p-4 flex flex-row">
        <div className="flex flex-col justify-between leading-normal pr-2">
          <div className="text-gray-900 font-bold text-lg pb-1">{name}</div>
          <p className="text-gray-700 text-sm pt-1">
            {description ? (
              { description }
            ) : (
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis tellus non metus dapibus convallis. Pellentesque hendrerit odio.'
            )}
          </p>
        </div>
        <div className="flex flex-col justify-around leading-normal pl-4">
          <div className="flex flex-col align-middle justify-center text-center">
            <div className="flex flex-row self-center">
              <span className="font-bold text-sm mr-1">{format('.3~s')(tc.count)}</span>
              <svg className="text-pink-400 fill-current w-5" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>
            </div>
            <span className="text-xs font-semibold">THREADS</span>
          </div>
          <div className="flex flex-col align-middle justify-center text-center">
            <div className="flex flex-row self-center">
              <span className="font-bold text-sm mr-1">{format('.3~s')(tc.count)}</span>
              <svg className="text-pink-400 fill-current w-5" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
            </div>
            <span className="text-xs font-semibold">USERS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumItem
