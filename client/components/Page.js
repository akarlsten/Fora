import React from 'react'
import Meta from './Meta'
import Header from './Header'

const Page = ({ children }) => {
  return (
    <React.Fragment>
      <Meta />
      <Header />
      <div>{children}</div>
    </React.Fragment>
  )
}

export default Page
