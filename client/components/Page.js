import React, { useContext, useState, useEffect } from 'react'

import Meta from 'components/Meta'
import Header from 'components/Header'
import { useTheme } from 'context/ColorContext'

const Page = ({ children }) => {
  const { theme } = useTheme()
  const [color, setColor] = useState(theme)

  // TODO:fix this shit, it breaks if you log out while viewing a forum
  // Look into ditching context for graphql stuff
  useEffect(() => {
    setColor(theme)
  }, [theme])

  return (
    <React.Fragment>
      <Meta />
      <div className={`w-screen h-screen overflow-x-hidden bg-${color === 'black' ? 'gray' : color}-100`}>
        <Header />
        <div className="container mx-auto px-6 p-20">{children}</div>
      </div>
    </React.Fragment>
  )
}

export default Page
