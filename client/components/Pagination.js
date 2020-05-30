import React from 'react'
import gql from 'graphql-tag'
import { Query, useQuery } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { postsPerPage, threadsPerPage } from 'config'

function Pagination ({ count, page, color, perPage, type, privateUrl, publicUrl }) {
  const defaultPerPage = type === 'thread' ? postsPerPage : threadsPerPage
  const router = useRouter()
  const pages = Math.ceil(count / (perPage || defaultPerPage))

  color = color || 'pink'

  const { url, tid } = router.query

  const privatePath = privateUrl || (type === 'thread' ? '/f/[url]/[tid]' : '/f/[url]')
  const publicPath = publicUrl || (type === 'thread' ? `/f/${url}/${tid}` : `/f/${url}`)

  const handleChange = (e) => {
    const target = e.target.value
    router.push({
      pathname: privatePath,
      query: { p: target }
    },
    {
      pathname: publicPath,
      query: { p: target }
    })
  }

  return (
    <div className="flex items-center space-x-4 font-bold" data-testid="pagination">
      {page > 1 && (
        <>
          <Link
            href={{
              pathname: privatePath,
              query: { p: 1 }
            }}

            as={{
              query: { p: 1 }
            }}
          >
            <a className={`px-2 py-1 rounded bg-${color}-400 hover:bg-${color}-600`}>« {1}</a>
          </Link>
          <Link
            href={{
              pathname: privatePath,
              query: { p: page - 1 }
            }}

            as={{
              query: { p: page - 1 }
            }}
          >
            <a className={`px-2 py-1 rounded bg-${color}-400 hover:bg-${color}-600`} aria-disabled={page <= 1}>
          ← Prev
            </a>
          </Link>
        </>
      )}
      {pages === 1 && (
        <p>
          Page {page} of{' '}
          <span className="totalPages" data-testid="totalPages">
            {pages}
          </span>
        </p>
      )}
      {pages > 1 && (
        <select value={page} className={`input-select font-bold px-2 py-1 border rounded border-${color}-400`} onChange={handleChange}>
          {
            [...Array(pages).keys()].map(opt => (<option className="font-bold" key={opt + 1} value={opt + 1}>{opt + 1}</option>))
          }
        </select>
      )}
      {page !== pages && (
        <>
          <Link
            href={{
              pathname: privatePath,
              query: { p: page + 1 }
            }}

            as={{
              query: { p: page + 1 }
            }}
          >
            <a className={`px-2 py-1 rounded bg-${color}-400 hover:bg-${color}-600`} aria-disabled={page >= pages}>
            Next →
            </a>
          </Link>
          <Link
            href={{
              pathname: privatePath,
              query: { p: pages }
            }}

            as={{
              query: { p: pages }
            }}
          >
            <a className={`px-2 py-1 rounded bg-${color}-400 hover:bg-${color}-600`}>{pages} »</a>
          </Link>
        </>
      )}
    </div>
  )
}

export default Pagination
