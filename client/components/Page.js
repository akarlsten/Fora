import React, { useContext, useState, useEffect } from 'react'
import Meta from './Meta'
import Header from './Header'
import { useTheme } from '../context/ColorContext'

const Page = ({ children }) => {
  const { theme } = useTheme()

  return (
    <React.Fragment>
      <Meta />
      <div className={`w-screen h-screen bg-${theme === 'black' ? 'gray' : theme}-100`}>
        <Header />
        <div className="container mx-auto px-6 p-20">{children}</div>
      </div>
    </React.Fragment>
  )
}

export default Page
