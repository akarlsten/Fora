import SignupForm from 'components/SignupForm'

const Signup = () => {
  return (
    <SignupForm />
  )
}

export async function getStaticProps (context) {
  return {
    props: {}
  }
}

export default Signup
