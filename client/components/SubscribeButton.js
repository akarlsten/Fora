import { useMutation } from '@apollo/client'
import { useUser } from '../hooks/useUser'
import { useState } from 'react'
import gql from 'graphql-tag'

const SUBSCRIBE = gql`
mutation SUBSCRIBE($userID: ID!, $forumID: ID!) {
  updateUser(id: $userID, data: {
    subscriptions: {
      connect: { id: $forumID}
    }
  })
  {
    id
  }
}
`
const UNSUBSCRIBE = gql`
mutation UNSUBSCRIBE($userID: ID!, $forumID: ID!) {
  updateUser(id: $userID, data: {
    subscriptions: {
      disconnect: { id: $forumID}
    }
  })
  {
    id
  }
}
`

const SubscribeButton = ({ forumID, color, subscribed }) => {
  // bypassing the Apollo cache here, perhaps not the best idea..
  const [subbed, setSubbed] = useState(subscribed && subscribed.length >= 1)

  const user = useUser()

  if (!user) {
    return ''
  }

  const [setSubscribed] = useMutation(SUBSCRIBE, {
    variables: {
      userID: user.id,
      forumID
    }
  })

  const [setUnsubscribed] = useMutation(UNSUBSCRIBE, {
    variables: {
      userID: user.id,
      forumID
    }
  })

  return subbed ? (
    <button onClick={async e => {
      e.preventDefault()
      await setUnsubscribed()
      setSubbed(false)
    }} className={`p-2 rounded border border-${color || 'pink'}-200 ml-4 flex text-${color || 'pink'}-300 items-center`}>
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
    Subscribed!
    </button>
  ) : (
    <button onClick={async e => {
      e.preventDefault()
      await setSubscribed()
      setSubbed(true)
    }} className={`p-2 rounded bg-${color || 'pink'}-400 ml-4 flex items-center`}>
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" fillRule="evenodd"></path></svg>
    Subscribe</button>
  )
}

export default SubscribeButton
