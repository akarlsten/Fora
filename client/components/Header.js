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
  <div>
    <Link href="/">
      <h1>Hello thsi is the header</h1>
    </Link>
  </div>
)

export default Header
