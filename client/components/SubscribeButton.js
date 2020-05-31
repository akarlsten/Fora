import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import gql from 'graphql-tag'
import { useToasts } from 'react-toast-notifications'

import { useUser } from 'hooks/useUser'
import { SUBSCRIBED_QUERY } from 'pages/index'

// const SUBSCRIBED_QUERY = gql`
// query SUBSCRIBED_QUERY($userID: ID!, $forumID: ID!) {
//   User(where: { id: $userID }) {
//     subscriptions(where: { id: $forumID }) {
//       id
//     }
//   }
// }
// `

const SUBSCRIBED_FRAGMENT = gql`
fragment myForum on Forum {
    _subscribersMeta {
      count
    }
  }
`

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

const SubscribeButton = ({ forumID, color, small }) => {
  const user = useUser()
  const { addToast } = useToasts()
  // const { data, loading } = useQuery(SUBSCRIBED_QUERY, {
  //   variables: { userID: user.id, forumID }
  // })

  const { data, loading } = useQuery(SUBSCRIBED_QUERY)

  const [setSubscribed] = useMutation(SUBSCRIBE, {
    variables: {
      userID: user?.id,
      forumID
    },
    refetchQueries: [{ query: SUBSCRIBED_QUERY, variables: { userID: user?.id, forumID } }],
    update (cache) {
      const { _subscribersMeta: { count } } = cache.readFragment({ id: `Forum:${forumID}`, fragment: SUBSCRIBED_FRAGMENT })
      cache.writeFragment({
        id: `Forum:${forumID}`,
        fragment: SUBSCRIBED_FRAGMENT,
        data: { _typeName: 'Forum', _subscribersMeta: { count: count + 1 } }
      })
    }
  })

  const [setUnsubscribed] = useMutation(UNSUBSCRIBE, {
    variables: {
      userID: user?.id,
      forumID
    },
    refetchQueries: [{ query: SUBSCRIBED_QUERY, variables: { userID: user?.id, forumID } }],
    onCompleted: () => { addToast('Unsubscribed!', { appearance: 'success' }) },
    update (cache) {
      const { _subscribersMeta: { count } } = cache.readFragment({ id: `Forum:${forumID}`, fragment: SUBSCRIBED_FRAGMENT })
      cache.writeFragment({
        id: `Forum:${forumID}`,
        fragment: SUBSCRIBED_FRAGMENT,
        data: { _subscribersMeta: { count: count - 1 } }
      })
    }
  })

  if (loading) {
    return ''
  }

  // const { subscriptions } = data && data.User

  const subscriptions = data?.authenticatedUser?.subscriptions

  return subscriptions.some(sub => sub.id === forumID) ? (
    <button onClick={async e => {
      e.preventDefault()
      await setUnsubscribed()
    }} className={`${small ? 'p-1 text-sm' : 'p-2 ml-4'} rounded border border-${color || 'pink'}-200 hover:bg-${color || 'pink'}-400 hover:text-white flex text-${color || 'pink'}-300 items-center`}>
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
    Subscribed!
    </button>
  ) : (
    <button onClick={async e => {
      e.preventDefault()
      await setSubscribed()
    }} className={`p-2 rounded border border-${color || 'pink'}-400 bg-${color || 'pink'}-400 ml-4 flex items-center`}>
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" fillRule="evenodd"></path></svg>
    Subscribe</button>
  )
}

export default SubscribeButton
