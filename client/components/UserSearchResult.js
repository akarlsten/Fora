import UserBadge from 'components/UserBadge'

const UserSearchResult = (props) => {
  return (
    <div className="bg-white w-full p-2 rounded shadow-md hover:shadow-xl transition duration-100 ease-in-out transform hover:-translate-y-1">
      <UserBadge {...props} />
    </div>
  )
}

export default UserSearchResult
