import NProgress from 'nprogress'
import Link from 'next/link'
import Router from 'next/router'

Router.onRouteChangeStart = () => {
  NProgress.start()
}
Router.onRouteChangeComplete = () => {
  NProgress.done()
}

Router.onRouteChangeError = () => {
  NProgress.done()
}

const Header = () => (
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
        <div className="w-2/4 items-center justify-between flex px-6">
          <Link href="/signup">
            <a className="font-medium text-gray-800">Sign up</a>
          </Link>
          <p className="font-bold">Hello 2</p>
          <p className="font-bold">Test</p>
        </div>
      </div>
    </div>
  </div>
)

export default Header
