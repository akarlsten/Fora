import Link from 'next/link'

const Landing = () => {
  return (
    <>
      <div className="flex flex-col justify-center my-10 lg:my-20">
        <div className="flex items-center justify-center flex-wrap">
          <div className="w-full lg:w-2/6">
            <h2 className="text-5xl font-display">Create your community and discuss the things you care about.</h2>
            <p className="text-2xl mt-8">
              <Link href="/signup">
                <a className="font-semibold underline">Sign up</a></Link> now to start posting!
            </p>
          </div>
          <div className="ml-8">
            <img className="h-64 w-64" src="/welcome.svg" alt=""/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing
