import Link from 'next/link'

const SignupButton = () => {
  return (
    <Link href="/signup">
      <button className="flex items-center font-medium text-gray-800 transition duration-100 ease-in-out transform hover:scale-105">
        <svg className="text-green-700 w-5 h-5 mr-1 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path className="heroicon-ui" d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z" /></svg>
                  Sign up
      </button>
    </Link>
  )
}

export default SignupButton
