import React from 'react'
import NProgress from 'nprogress'
import Link from 'next/link'
import Router from 'next/router'
import { useUser } from './User'
import Signout from './Signout'

Router.onRouteChangeStart = () => {
  NProgress.start()
}
Router.onRouteChangeComplete = () => {
  NProgress.done()
}

Router.onRouteChangeError = () => {
  NProgress.done()
}

const Header = () => {
  const loggedIn = useUser()

  return (
    <div className="flex bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-100 h-16 items-center">
      <div className="flex items-center w-full max-w-screen-xl relative mx-auto px-6">
        <div className="w-1/4">
          <Link href="/">
            <a>
              <img className="h-10 w-auto" src="/fora.svg" alt="" />
            </a>
          </Link>
        </div>
        <div className="w-3/4 flex flex-grow">
          <div className="w-2/4"></div>
          <div className="w-2/4 items-center justify-end flex px-6">
            {loggedIn && (
              <React.Fragment>
                <p className="text-pink-400 mr-4">Hello {loggedIn.name}!</p>
                <Signout />
              </React.Fragment>
            )}
            {!loggedIn && (
              <Link href="/signin">
                <a className="font-medium text-gray-800">Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
