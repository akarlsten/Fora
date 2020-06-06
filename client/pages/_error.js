import Error from 'components/Error'
const ErrorPage = () => (
  <Error unexpected={true} />
)

export async function getStaticProps (context) {
  return {
    props: {}
  }
}

export default ErrorPage
