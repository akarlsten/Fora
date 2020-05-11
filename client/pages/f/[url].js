import { useRouter } from 'next/router'

const Forum = () => {
  const router = useRouter()
  const { url } = router.query

  return <p>Forum url: {url}</p>
}

export default Forum
