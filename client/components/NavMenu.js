import UserBadge from 'components/UserBadge'
import SignoutButton from 'components/SignoutButton'
import SigninButton from 'components/SigninButton'

const NavMenu = ({ loggedIn }) => {
  return (
    <div className="border-b border-l border-t border-gray-200 absolute right-0 mt-20 py-4 z-20 px-10 bg-white flex flex-col rounded-l-lg">
      {loggedIn && (
        <>
          <div className="flex flex-col space-y-2">
            <UserBadge name={loggedIn.name} avatar={loggedIn.avatar} />
            <div className="border-b border-gray-300 mt-6"></div>
            <SignoutButton />
          </div>
        </>
      )}
      {!loggedIn && (
        <SigninButton />
      )}
    </div>
  )
}

export default NavMenu
