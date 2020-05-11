import ThreadItem from './ThreadItem'

const ThreadList = ({ threads, color }) => {
  if (!threads || threads.length < 1) {
    return (
      <div className="w-full lg:w-3/4 flex flex-col justify-center items-center mt-10">
        <img className="w-64 self-center mb-10" src="/happy_thing.svg" style={{ filter: 'grayscale(100%) opacity(40%)' }} alt=""/>
        <p className="text-3xl font-light text-gray-600">There are no threads yet, make one!</p>
      </div>
    )
  }

  return (
    <div className={`w-full lg:w-3/4 rounded bg-white border border-${color || 'pink'}-200 divide-y divide-${color || 'pink'}-200`}>
      {threads.map(thread => (
        <ThreadItem key={thread.id} title={thread.title} count={thread._postsMeta.count} color={color} />
      ))}
    </div>
  )
}

export default ThreadList
