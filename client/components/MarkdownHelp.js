
const MarkdownHelp = ({ color }) => {
  return (
    <a rel="noopener noreferrer" target="_blank" href="https://commonmark.org/help/">
      <button className={`self-end cursor-pointer mr-1 mb-1 px-1 font-bold py-1 rounded bg-${color || 'pink'}-400 hover:bg-${color || 'pink'}-600`}>
        <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" fillRule="evenodd"></path></svg>
      </button>
    </a>
  )
}

export default MarkdownHelp
