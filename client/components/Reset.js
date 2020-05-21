import React, { Component } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import useSimpleForm from 'hooks/useSimpleForm'
import { CURRENT_USER_QUERY } from 'hooks/useUser'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      message
    }
  }
`

function Reset ({ resetToken }) {
  const { inputs, handleChange, resetForm } = useSimpleForm({
    password: '',
    confirmPassword: ''
  })
  const [resetPassword, { error, loading, data }] = useMutation(
    RESET_MUTATION,
    {
      variables: {
        resetToken,
        password: inputs.password,
        confirmPassword: inputs.confirmPassword
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  )
  return (
    <div className="flex flex-col items-center justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
      <form
        className="flex flex-col pt-3 md:pt-8 sm:w-2/3 lg:w-1/2 max-w-md"
        method="post"
        onSubmit={async e => {
          e.preventDefault()
          const res = await resetPassword()
          console.log(res)
          resetForm()
        // this.setState({ password: '', confirmPassword: '' });
        }}
      >
        <fieldset className="flex flex-col" disabled={loading} aria-busy={loading}>
          <h2 className="text-center text-3xl pb-4">Reset Your Password</h2>
          {data && data.resetPassword && data.resetPassword.message}
          {error && <p>{error}</p>}
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="password">
          Password
            <div className="flex flex-col relative mt-1">
              <input
                className="shadow pl-8 appearance-none border rounded w-full py-2 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleChange}
                required
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-2 flex items-center">
                <svg className="fill-current pointer-events-none text-gray-600 w-5 h-5 leading-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>
          </label>

          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4" htmlFor="confirmPassword">
          Confirm Your Password
            <div className="flex flex-col relative mt-1">
              <input
                className="shadow pl-8 appearance-none border rounded w-full py-2 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={inputs.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-2 flex items-center">
                <svg className="fill-current pointer-events-none text-gray-600 w-5 h-5 leading-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>
          </label>

          <input className="bg-pink-400 mx-auto text-white font-bold text-lg hover:bg-pink-700 p-2 mt-8 rounded" type="submit" value="Reset!" />

        </fieldset>
      </form>
    </div>
  )
}

export default Reset
