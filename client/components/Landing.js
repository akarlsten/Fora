import Link from 'next/link'

const Landing = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-between -mt-12">
        <div className="flex items-center justify-center flex-wrap mt-0 xs:mt-12">
          <div className="w-full lg:w-2/6">
            <h2 className="text-4xl sm:text-5xl font-display">Create your community and discuss the things you care about.</h2>
            <p className="text-xl sm:text-2xl mt-8">
              <Link href="/signup">
                <a className="font-semibold underline">Sign up</a></Link> now to start posting!
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <img className="h-64 w-64" src="/welcome.svg" alt=""/>
          </div>
        </div>
        <div className="flex self-end flex-col items-center w-full my-8">
          <p className="text-2xl font-display">Or just browse..</p>
          <div className="animation-floatUpDown animation-alternate animation-ease-in-out">
            <svg className="h-16 w-16 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            <svg className="h-16 w-16 -mt-12 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing
