import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'
import Loader from 'react-loader-spinner'

import colorConverter from 'lib/colorConverter'

const FORUM_BAN_USER = gql`
mutation FORUM_BAN_USER($userID: ID!, $forumID: ID!) {
  updateForum(id: $forumID, data: { 
    bannedUsers: { 
      connect: [{id: $userID}] 
      }
    }) {
    bannedUsers(where: {id: $userID}) {
      id
      displayName
      name
    }
  }
}
`

const BANNED_FORUM_USERS = gql`
query BANNED_FORUM_USERS($forumID: ID!) {
  Forum(where: {id: $forumID}) {
    bannedUsers {
      id
    }
  }
}
`

const BanButton = ({ userID, forumID, color }) => {
  const { addToast } = useToasts()
  const [confirmBan, setConfirmBan] = useState(false)

  const { data, loading, error } = useQuery(BANNED_FORUM_USERS, {
    variables: { forumID }
  })

  const [banUser, { loading: mutationLoading }] = useMutation(FORUM_BAN_USER, {
    refetchQueries: [{ query: BANNED_FORUM_USERS, variables: { forumID } }],
    onCompleted: ({ updateForum: { bannedUsers } }) => {
      addToast(`${bannedUsers[0].displayName} (@${bannedUsers[0].name}) banned!`, { appearance: 'success' })
      setConfirmBan(false)
    },
    onError: () => addToast('Couldn\'t update post, cannot connect to backend. Try again in a while!', { appearance: 'error', autoDismiss: true })
  })

  const handleClick = () => {
    banUser({ variables: { forumID: forumID, userID: userID } })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center -mr-2">
        <Loader type="ThreeDots" color={colorConverter(color)} width={30} height={30} />
      </div>
    )
  }

  const userIsBanned = data?.Forum?.bannedUsers?.some(banned => banned.id === userID)

  return (
    <div className="sm:mb-2">
      {confirmBan
        ? (
          <div className="flex sm:-mr-2">
            <button disabled={mutationLoading || userIsBanned} onClick={handleClick} style={{ padding: '0.15rem' }} className={'self-end mr-1 font-bold rounded bg-green-400 hover:bg-green-600'}>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            </button>
            <button onClick={() => setConfirmBan(false)} style={{ padding: '0.15rem' }} className={'self-end font-bold rounded bg-red-400 hover:bg-red-600'}>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            </button>
          </div>
        )
        : (
          <a onClick={() => !userIsBanned && setConfirmBan(true)} className={`px-2 ${!userIsBanned && 'cursor-pointer'} -mr-2 font-bold py-1 rounded bg-red-400 ${!userIsBanned && 'hover:bg-red-600'} ${userIsBanned && 'opacity-50'}`}>Ban</a>
        )}
    </div>
  )
}

export default BanButton
