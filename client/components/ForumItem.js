
const ForumItem = ({ name, description, _threadsMeta: tc }) => (
  <div className="max-w-sm w-full lg:max-w-full">
    <div className="border border-pink-200 bg-white rounded p-4 flex flex-col justify-between leading-normal">
      <div className="mb-8">
        <div className="text-gray-900 font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">
          {description ? (
            { description }
          ) : (
            'Hello hello!'
          )}
        </p>
      </div>
    </div>
  </div>
)

export default ForumItem
