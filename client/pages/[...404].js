import NotFound from 'components/404'

const NotFoundPage = () => {
  return (
    <NotFound />
  )
}

export async function getStaticProps (context) {
  return {
    props: {}
  }
}

export default NotFoundPage
