import dynamic from 'next/dynamic'

import SigninButton from 'components/SigninButton'
import SignupButton from 'components/SignupButton'

const SignoutButton = dynamic(() => import('components/SignoutButton'))
const UserBadge = dynamic(() => import('components/UserBadge'))

const NavMenu = ({ loggedIn, setSidebar }) => {
  return (
    <div onClick={() => setSidebar(false)} className="lg:hidden border-b border-l border-t border-gray-200 absolute right-0 mt-20 py-4 z-20 px-10 bg-white flex flex-col rounded-l-lg">
      {loggedIn && (
        <div className="flex flex-col items-center space-y-2">
          <UserBadge name={loggedIn.name} displayName={loggedIn.displayName} avatar={loggedIn.avatar} />
          <div className="border-b border-gray-300 mt-6"></div>
          <SignoutButton />
        </div>
      )}
      {!loggedIn && (
        <div className="flex flex-col items-center space-y-2">
          <SigninButton />
          <SignupButton />
        </div>
      )}
    </div>
  )
}

export default NavMenu
