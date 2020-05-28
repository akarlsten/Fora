import Select from 'react-select'
import Async, { makeAsyncSelect } from 'react-select/async'
import { useState, useEffect } from 'react'
import { useLazyQuery, useMutation, gql } from '@apollo/client'
import colorConverter from 'lib/colorConverter'

const USERNAME_QUERY = gql`
query USERNAME_QUERY($name: String!) {
  allUsers(first: 5, where: {    OR: [
      {name_contains_i: $name},
      {displayName_contains_i: $name}
    ]}) {
    id
    name
    displayName
  }
}
`

const mapUserToLabel = (item) => {
  const label = item.displayName === item.name ? `@${item.name}` : `${item.displayName} | @${item.name}`

  return { value: item.id, label }
}

const ModsBansForm = ({ mods, banned, color }) => {
  const previousBanned = banned.map(mapUserToLabel)
  const previousMods = mods.map(mapUserToLabel)
  const [bannedUsers, setBannedUsers] = useState(previousBanned)
  const [moderators, setModerators] = useState(previousMods)

  // very annoying styling rules
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem',
      borderRadius: '0.25rem',
      border: `1px solid ${colorConverter(color, true)}`
    }),
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: `${colorConverter(color)}`,
        borderRadius: '0.25rem',
        fontWeight: '600',
        padding: '0.1rem'
      }
    },
    multiValueRemove: (styles, state) => ({
      ...styles
    }),
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink'
    }),
    container: (provided, state) => ({
      ...provided,
      borderRadius: '0.25rem',
      minWidth: '70vw',
      width: '100%'
    })
  }

  const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: `${colorConverter(color)}`,
      primary75: `${colorConverter(color)}75`,
      primary50: `${colorConverter(color)}50`,
      primary25: `${colorConverter(color)}25`,
      danger: `${colorConverter('red', true)}`,
      dangerLight: `${colorConverter('red')}`
    }
  })

  const [nameCheck, { data: nameData, loading }] = useLazyQuery(USERNAME_QUERY)

  const fetchUsers = async inputValue => {
    await nameCheck({ variables: { name: inputValue } })

    if (nameData?.allUsers?.length > 0) {
      return nameData.allUsers.map(mapUserToLabel)
    }
  }

  const handleBannedChange = (e) => {
    setBannedUsers(e)
  }

  useEffect(() => {
    console.log(bannedUsers)
  }, [bannedUsers])

  return (
    <div className="mt-20">
      <h1 className="text-3xl mb-4 text-gray-800"><span className="font-semibold">Moderators & Bans</span></h1>
      <form className="w-full p-2" onSubmit={() => {}}>
        <fieldset disabled={false} aria-busy={false}>
          <Async
            styles={customStyles}
            value={bannedUsers}
            loadOptions={fetchUsers}
            isLoading={loading}
            onChange={handleBannedChange}
            isMulti
            name="banned"
            theme={customTheme}
          />
          <button onClick={(e) => { e.preventDefault(); setBannedUsers(previousBanned) }}>Reset</button>
        </fieldset>
      </form>
    </div>
  )
}

export default ModsBansForm
