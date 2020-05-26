import ReactMarkdown from 'react-markdown'
import { useState } from 'react'

import emoji from 'remark-emoji'

const Image = (props) => {
  const [fullSize, setFullSize] = useState(false)
  return (
    <img onClick={() => setFullSize(prev => !prev)} className={`${!fullSize && 'max-w-sm max-h-sm'}`} src={props.src} alt={props} />
  )
}

const RenderMarkdown = ({ content, color }) => {
  // gross defining components inside this component but that is what is recommended
  // https://github.com/rexxars/react-markdown/issues/257
  // https://github.com/rexxars/react-markdown/issues/284

  const Link = (props) => (
    <a href={props.href} target="_blank" rel="nofollow noopener noreferrer" className={`underline text-${color || 'pink'}-500 hover:text-${color || 'pink'}-700 `}>{props.children}</a>
  )

  const BlockQuote = (props) => (
    <blockquote className={`border-l-4 border-${color || 'pink'}-400 pl-4 m-4`}>{props.children}</blockquote>
  )

  const Emphasis = (props) => (
    <span className="italic">{props.children}</span>
  )

  const Strong = (props) => (
    <span className="font-bold">{props.children}</span>
  )

  const Heading = (props) => {
    switch (props.level) {
      case 1:
        return <h1 className="text-4xl font-bold my-4">{props.children}</h1>
      case 2:
        return <h2 className="text-3xl font-bold my-2">{props.children}</h2>
      case 3:
        return <h3 className="text-2xl font-bold my-1">{props.children}</h3>
      case 4:
        return <h4 className="text-xl font-bold">{props.children}</h4>
      case 5:
        return <h5 className="text-lg font-bold">{props.children}</h5>
      case 6:
        return <h6 className="text-md font-bold">{props.children}</h6>
    }
  }

  const InlineCode = (props) => (
    <code className={`p-1 rounded bg-gray-800 font-mono text-${color || 'pink'}-400`}>{props.children}</code>
  )

  const CodeBlock = (props) => {
    return (
      <pre className={`bg-gray-800 text-${color || 'pink'}-400 rounded language-${props.language}`}><code className={`inline-block p-4 language-${props.language}`}>{props.value}</code></pre>
    )
  }

  const ThematicBreak = (props) => (
    <hr className={`my-2 w-full border-b border-${color || 'pink'}-400 `}></hr>
  )

  const Table = (props) => (
    <table className="table-auto my-4">{props.children}</table>
  )

  const TableCell = ({ isHeader, align, children }) => {
    if (isHeader) {
      return <th className="px-4 py-2">{children}</th>
    } else {
      return <td className={`border border-${color || 'pink'}-400 px-4 py-2 ${align && (align === 'left' ? 'text-left' : 'text-right')}`}>{children}</td>
    }
  }

  // const TableBody = (props) => (
  //   <tbody className={`bg-white even:bg-${color || 'pink'}-200`}>{props.children}</tbody>
  // )

  const TableRow = (props) => (
    <tr className={`even:bg-${color || 'pink'}-200`}>{props.children}</tr>
  )

  const List = ({ start, ordered, tight, depth, children }) => {
    if (ordered) {
      return <ol className="m-4 list-decimal">{children}</ol>
    } else {
      return <ul className="m-4 list-disc">{children}</ul>
    }
  }

  const disallowedTypes = [
    'html',
    'definition',
    'virtualHtml',
    'parsedHtml',
    'linkReference',
    'imageReference'
  ]

  return (
    <ReactMarkdown source={content}
      disallowedTypes={disallowedTypes}
      renderers={{
        link: Link,
        blockquote: BlockQuote,
        emphasis: Emphasis,
        strong: Strong,
        heading: Heading,
        inlineCode: InlineCode,
        code: CodeBlock,
        thematicBreak: ThematicBreak,
        image: Image,
        table: Table,
        tableCell: TableCell,
        tableRow: TableRow,
        list: List
      }}
      plugins={[emoji]}
    />
  )
}

export default RenderMarkdown
