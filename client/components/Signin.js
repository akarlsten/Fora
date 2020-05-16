import React, { Component, useState, useEffect } from 'react'
import { useMutation, Mutation } from '@apollo/client'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import { useUser, CURRENT_USER_QUERY } from '../hooks/useUser'
import useForm from '../hooks/useForm'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      item {
        id
        name
      }
    }
  }
`

function Signin () {
  const router = useRouter()
  const loggedIn = useUser()

  useEffect(() => {
    if (loggedIn) {
      router.push('/')
    }
  }, [loggedIn])

  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: ''
  })
  const [signin, { error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  })
  return (
    <div className="flex flex-col items-center justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
      <form
        className="flex flex-col pt-3 md:pt-8 sm:w-2/3 lg:w-1/2 max-w-md"
        method="post"
        onSubmit={async e => {
          e.preventDefault()
          const res = await signin()
          console.log(res)
          resetForm()
        }}
      >
        <fieldset disabled={loading} aria-busy={loading}>
          <h2 className="text-center text-3xl pb-4">Sign into your account</h2>
          <label className="text-lg relative" htmlFor="email">
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
          <label className="text-lg relative" htmlFor="email">
            Password
          </label>
          <div className="flex flex-col relative mt-1">
            <input
              className="shadow pl-8 appearance-none border rounded w-full py-2 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              autoComplete="password"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-2 flex items-center">
              <svg className="fill-current pointer-events-none text-gray-600 w-5 h-5 leading-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>    </div>
          </div>
          <input className="bg-pink-400 mx-auto text-white font-bold text-lg hover:bg-pink-700 p-2 mt-8 rounded" type="submit" value="Sign in!" />
        </fieldset>
      </form>
      <div className="text-center pt-12 pb-12">
        <p>Don&apos;t have an account? <a href="register.html" className="underline font-semibold">Register here.</a></p>
      </div>
      <div className="text-center pb-12">
        <p>Forgot your password? <a href="register.html" className="underline font-semibold">Click here.</a></p>
      </div>
    </div>
  )
}

export default Signin
