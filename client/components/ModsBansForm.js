import Select, { components } from 'react-select'
import Async, { makeAsyncSelect } from 'react-select/async'
import { useState, useEffect } from 'react'
import { useLazyQuery, useMutation, gql } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'

import colorConverter from 'lib/colorConverter'

import { EDIT_FORUM_QUERY } from 'components/EditForum'

// Styling crap
const MultiValue = props => {
  const color = props?.selectProps?.color

  return (
    <components.MultiValue {...props}>
      <div className="flex items-center">
        {props.data.avatar ? (
          <img className={'w-8 h-8 rounded-full mr-2 bg-white border border-white'} src={props.data.avatar} alt="" />
        ) : (
          <svg className="w-8 h-8 rounded-full mr-2 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${color}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
        <p className="text-md mr-2">{props.data.displayName}</p>
        <div className="text-xs bg-white rounded px-1 flex items-center">
          @{props.children}
        </div>
      </div>
    </components.MultiValue>)
}

const Option = props => {
  const color = props?.selectProps?.color

  return (
    <components.Option {...props}>
      <div className="flex items-center font-medium">
        {props.data.avatar ? (
          <img className={'w-8 h-8 rounded-full mr-2 bg-white border border-white'} src={props.data.avatar} alt="" />
        ) : (
          <svg className="w-8 h-8 rounded-full mr-2 fill-current" width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`text-${color}-400`} cx="79.5" cy="79.5" r="79.5" />
            <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
            <circle cx="96" cy="59" r="43" fill="white" />
          </svg>
        )}
        <p className="text-md font-bold mr-2">{props.data.displayName}</p>
        <div className="text-sm text-gray-700">
        @{props.children}
        </div>
      </div>
    </components.Option>
  )
}

const mapUserToLabel = (item) => {
  return { value: item.id, label: item.name, displayName: item.displayName, avatar: item.avatar.publicUrlTransformed }
}

// end styling crap

const USERNAME_QUERY = gql`
query USERNAME_QUERY($name: String!) {
  allUsers(first: 5, where: {    OR: [
      {name_contains_i: $name},
      {displayName_contains_i: $name}
    ]}) {
    id
    name
    displayName
    avatar {
      publicUrlTransformed(transformation: {
        width:"300",
        height:"300",
        crop:"fill",
        gravity:"center"
      })
    }
  }
}
`

const UPDATE_MODS_BANS = gql`
mutation UPDATE_MODS_BANS($forumID: ID!, $data: ForumUpdateInput!) {
  updateForum(id: $forumID, data: $data) {
    id
    bannedUsers {
      id
    }
    moderators {
      id
    }
  }
}
`

const ModsBansForm = ({ id, mods, banned, color, url }) => {
  // begin styling crap (again)
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
        paddingTop: '0.1rem',
        paddingBottom: '0.1rem'
      }
    },
    multiValueRemove: (styles, state) => ({
      ...styles
    }),
    option: (provided, state) => ({
      ...provided
    }),
    container: (provided, state) => ({
      ...provided,
      borderRadius: '0.25rem',
      paddingLeft: '0',
      width: '80vw',
      maxWidth: '900px'
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
      danger: `${colorConverter('black', true)}`,
      dangerLight: `${colorConverter('red')}`
    }
  })
  // end styling crap

  const { addToast } = useToasts()
  const previousBanned = banned.map(mapUserToLabel)
  const previousMods = mods.map(mapUserToLabel)
  const [bannedUsers, setBannedUsers] = useState(previousBanned)
  const [moderators, setModerators] = useState(previousMods)

  const [nameCheck, { data: nameData, loading }] = useLazyQuery(USERNAME_QUERY)

  const [updateBanned, { loading: bannedLoading }] = useMutation(UPDATE_MODS_BANS, {
    refetchQueries: [{ query: EDIT_FORUM_QUERY, variables: { url } }],
    onCompleted: () => { addToast('Successfully changed banned users!', { appearance: 'success' }) },
    onError: () => addToast('Couldn\'t change banned users, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const [updateMods, { loading: modsLoading }] = useMutation(UPDATE_MODS_BANS, {
    refetchQueries: [{ query: EDIT_FORUM_QUERY, variables: { url } }],
    onCompleted: () => { addToast('Successfully changed moderators!', { appearance: 'success' }) },
    onError: () => addToast('Couldn\'t change moderators, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const fetchUsers = async inputValue => {
    await nameCheck({ variables: { name: inputValue } })

    if (nameData?.allUsers?.length > 0) {
      return nameData.allUsers.map(mapUserToLabel)
    }
  }

  const handleBannedChange = (e) => {
    setBannedUsers(e)
  }

  const handleModChange = (e) => {
    setModerators(e)
  }

  const submitBanned = () => {
    const formattedBanList = bannedUsers?.map(user => ({ id: user.value }))
    updateBanned({
      variables: {
        forumID: id,
        data: {
          bannedUsers: {
            disconnectAll: true,
            connect: formattedBanList
          }
        }
      }
    })
  }

  const submitMods = () => {
    const formattedModList = moderators?.map(user => ({ id: user.value }))
    updateMods({
      variables: {
        forumID: id,
        data: {
          moderators: {
            disconnectAll: true,
            connect: formattedModList
          }
        }
      }
    })
  }

  return (
    <div className="mt-20 flex flex-col items-center">
      <h1 className="text-3xl text-gray-800"><span className="font-semibold">Moderators & Bans</span></h1>
      <span className="mb-4 text-sm text-gray-700">Change the modlist or ban/unban users here.</span>
      <form className="w-full p-2" onSubmit={() => {}}>
        <fieldset disabled={bannedLoading} aria-busy={bannedLoading}>
          <h2 className="text-xl font-bold mt-4">Banned Users</h2>
          <p className="text-xs text-gray-700 mb-4">Type to search for users.</p>
          <Async
            styles={customStyles}
            value={bannedUsers}
            components={{ MultiValue, Option }}
            loadOptions={fetchUsers}
            isLoading={loading}
            onChange={handleBannedChange}
            backspaceRemovesValue={false}
            isMulti
            name="banned"
            theme={customTheme}
            color={color}
          />
          <div className="flex mt-2 space-x-2 justify-end items-center">
            <span className="text-xs text-gray-700">This will reset the list to the currently saved values.</span>
            <button className={`bg-${color}-400 rounded p-1 font-semibold flex items-center text-sm`} onClick={(e) => { e.preventDefault(); setBannedUsers(previousBanned) }}>
              <svg className="h-4 w-4 fill-current mr-1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path></svg>
              Reset
            </button>
            <button disabled={bannedLoading} className={'bg-green-400 rounded p-1 font-semibold flex items-center text-sm'} onClick={(e) => { e.preventDefault(); submitBanned() }}>
              <svg className="h-4 w-4 fill-current mr-1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              Save
            </button>
          </div>
        </fieldset>
        <fieldset disabled={modsLoading} aria-busy={modsLoading}>
          <h2 className="text-xl font-bold mt-10">Moderators</h2>
          <p className="text-xs text-gray-700 mb-4">Type to search for users.</p>
          <Async
            styles={customStyles}
            value={moderators}
            components={{ MultiValue, Option }}
            loadOptions={fetchUsers}
            isLoading={loading}
            onChange={handleModChange}
            backspaceRemovesValue={false}
            isMulti
            name="mods"
            theme={customTheme}
            color={color}
          />
          <div className="flex mt-2 space-x-2 justify-end items-center">
            <span className="text-xs text-gray-700">This will reset the list to the currently saved values.</span>
            <button className={`bg-${color}-400 rounded p-1 font-semibold flex items-center text-sm`} onClick={(e) => { e.preventDefault(); setModerators(previousMods) }}>
              <svg className="h-4 w-4 fill-current mr-1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path></svg>
              Reset
            </button>
            <button disabled={modsLoading} className={'bg-green-400 rounded p-1 font-semibold flex items-center text-sm'} onClick={(e) => { e.preventDefault(); submitMods() }}>
              <svg className="h-4 w-4 fill-current mr-1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              Save
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default ModsBansForm
