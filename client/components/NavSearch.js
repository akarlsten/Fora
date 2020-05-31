import { useRouter } from 'next/router'
import useSimpleForm from 'hooks/useSimpleForm'

const NavSearch = () => {
  const router = useRouter()
  const { inputs, handleChange, clearForm } = useSimpleForm({
    searchQuery: ''
  })

  return (
    <div className="relative">
      <form method="post"
        onSubmit={async e => {
          e.preventDefault()
          if (inputs.searchQuery.trim().length > 0) {
            router.push({
              pathname: '/search',
              query: { q: inputs.searchQuery.trim() }
            })
            clearForm()
          }
        }}
      >
        <input value={inputs.searchQuery}
          onChange={handleChange}
          type="text"
          name="searchQuery"
          placeholder="Search!"
          className="transition-colors duration-100 ease-in-out focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-600 rounded-lg bg-gray-200 py-1 pr-4 pl-10 block w-full appearance-none leading-normal ds-input"
        />
      </form>
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
        <svg className="fill-current pointer-events-none text-gray-600 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path></svg>
      </div>
    </div>
  )
}

export default NavSearch
