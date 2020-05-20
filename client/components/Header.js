import React, { useState } from 'react'
import NProgress from 'nprogress'
import Link from 'next/link'
import Router from 'next/router'
import { useUser } from 'hooks/useUser'
import SigninButton from 'components/SigninButton'
import SignoutButton from 'components/SignoutButton'
import UserBadge from 'components/UserBadge'
import NavSearch from 'components/NavSearch'
import NavMenu from 'components/NavMenu'

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
  const [sidebarOpen, setSidebar] = useState(false)
  const loggedIn = useUser()

  return (
    <div className="flex bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-50 h-12 items-center">
      <div className="flex items-center w-full max-w-screen-3xl relative mx-auto px-6">
        <div className="w-1/5 mr-6 flex-shrink-0">
          <Link href="/">
            <a>
              <img className="h-10" src="/fora.svg" alt="Fora | Go Home" />
            </a>
          </Link>
        </div>
        <div className="w-4/5 flex flex-grow justify-between">
          <div className="w-full lg:px-6 sm:w-4/5 xl:w-3/4 xl:px-12">
            <NavSearch />
          </div>
          <button onClick={() => setSidebar(true)} type="button" id="sidebar-open" className={`flex pl-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700 ${sidebarOpen && 'hidden'}`}>
            <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path></svg>
          </button>
          <button onClick={() => setSidebar(false)} type="button" id="sidebar-close" className={`flex pl-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700 ${!sidebarOpen && 'hidden'}`}>
            <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"></path></svg>
          </button>
          <div className={'hidden w-3/5 sm:w-2/5 lg:flex lg:items-center lg:justify-end px-6'}>
            {loggedIn && (
              <React.Fragment>
                <UserBadge name={loggedIn.name} avatar={loggedIn.avatar} />
                <SignoutButton />
              </React.Fragment>
            )}
            {!loggedIn && (
              <SigninButton />
            )}
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <NavMenu loggedIn={loggedIn} />
      )}
    </div>
  )
}

export default Header
