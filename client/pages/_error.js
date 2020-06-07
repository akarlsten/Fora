import ErrorComponent from 'components/Error'
const Error = () => (
  <ErrorComponent unexpected={true} />
)

export async function getStaticProps (context) {
  return {
    props: {}
  }
}

export default Error
