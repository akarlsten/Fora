import React from 'react'
import Meta from './Meta'
import Header from './Header'

const Page = ({ children }) => {
  return (
    <React.Fragment>
      <Meta />
      <Header />
      <div className="container mx-auto px-6 p-20">{children}</div>
    </React.Fragment>
  )
}

export default Page
