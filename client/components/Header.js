import React from 'react'
import NProgress from 'nprogress'
import Link from 'next/link'
import Router from 'next/router'
import { useUser } from '../hooks/useUser'
import Signout from './Signout'
import NavSearch from './NavSearch'

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
    <div className="flex bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-100 h-12 items-center">
      <div className="flex items-center w-full max-w-screen-xl relative mx-auto px-6">
        <div className="w-1/5 mr-6 flex-shrink-0">
          <Link href="/">
            <a>
              <img className="h-10 w-full" src="/fora.svg" alt="" />
            </a>
          </Link>
        </div>
        <div className="w-4/5 flex flex-grow">
          <div className="w-full lg:px-6 xl:w-2/4 xl:px-12">
            <NavSearch />
          </div>
          <button type="button" id="sidebar-open" className="flex pl-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700">
            <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path></svg>
          </button>
          <button type="button" id="sidebar-close" className="flex pl-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700 hidden">
            <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"></path></svg>
          </button>
          <div className="hidden lg:flex lg:items-center lg:justify-end w-2/5 px-6">
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
