import React, { Component, useState, useEffect } from 'react'
import { useMutation, Mutation } from '@apollo/client'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import { useUser, CURRENT_USER_QUERY } from '../hooks/useUser'
import useForm from '../lib/useForm'

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
    <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
      <form
        className="flex flex-col pt-3 md:pt-8"
        method="post"
        onSubmit={async e => {
          e.preventDefault()
          const res = await signin()
          console.log(res)
          resetForm()
        }}
      >
        <fieldset disabled={loading} aria-busy={loading}>
          <h2 className="text-center text-3xl">Sign into your account</h2>
          <div className="flex flex-col pt-4">
            <label className="text-lg" htmlFor="email">
          Email
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                name="email"
                placeholder="email"
                value={inputs.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </label>
          </div>
          <div className="flex flex-col pt-4">
            <label className="text-lg" htmlFor="password">
          Password
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                placeholder="password"
                value={inputs.password}
                onChange={handleChange}
                autoComplete="password"
              />
            </label>
          </div>
          <input className="bg-pink-400 mx-auto text-white font-bold text-lg hover:bg-pink-700 p-2 mt-8 rounded" type="submit" value="Sign in!" />
        </fieldset>
      </form>
      <div className="text-center pt-12 pb-12">
        <p>Don&apos;t have an account? <a href="register.html" className="underline font-semibold">Register here.</a></p>
      </div>
    </div>
  )
}

export default Signin
