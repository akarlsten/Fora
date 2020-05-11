import { format } from 'd3-format'

const ThreadItem = ({ title, count, color }) => {
  return (
    <div className="flex justify-between">
      <div className="px-4 py-2 font-semibold">{title}</div>
      <div>
        <div className="px-4 py-2 font-bold text-center items-center flex flex-row self-center">
          <span className="font-base text-lg mr-1">| {format('.3~s')(count)}</span>
          <svg className={`text-${color}-600 w-5`} viewBox="0 0 24 24"><path className="heroicon-ui" d="M2 15V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v15a1 1 0 0 1-1.7.7L16.58 17H4a2 2 0 0 1-2-2zM20 5H4v10h13a1 1 0 0 1 .7.3l2.3 2.29V5z" /></svg>
        </div>
      </div>
    </div>
  )
}

export default ThreadItem
