import React, { Component } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import useSimpleForm from 'hooks/useSimpleForm'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`
function RequestReset () {
  const { inputs, handleChange, clearForm } = useSimpleForm({ email: '' })
  const [reset, { error, loading, called }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: {
        email: inputs.email
      }
    }
  )
  return (
    <div className="flex flex-col items-center justify-center md:justify-start my-auto md:pt-0 px-8 md:px-24 lg:px-32">
      <form
        className="flex flex-col pt-3 md:pt-8 sm:w-2/3 lg:w-1/2 max-w-md"
        method="post"
        data-testid="form"
        onSubmit={async e => {
          e.preventDefault()
          await reset()
          clearForm()
        }}
      >
        <fieldset disabled={loading} aria-busy={loading}>
          <h2 className="text-center text-3xl pb-4">Request a password reset</h2>
          {error && (
            <p>Something went wrong!</p>
          )}
          {!error && !loading && called && (
            <p>Success! Check your email for a reset link!</p>
          )}
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="email">
          Email
          </label>
          <div className="flex flex-col relative mt-1 mb-6">
            <input
              className="shadow pl-8 appearance-none border rounded w-full py-2 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-2 flex items-center">
              <svg className="fill-current pointer-events-none text-gray-600 w-5 h-5 leading-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            </div>
          </div>

          <input className="bg-pink-400 mx-auto text-white font-bold text-lg hover:bg-pink-700 p-2 mt-4 rounded" type="submit" value="Request reset!" />
        </fieldset>
      </form>
    </div>
  )
}

export default RequestReset
export { REQUEST_RESET_MUTATION }
