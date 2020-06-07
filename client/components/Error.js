const Error = ({ unexpected }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-10">
      <img className="w-2/4 self-center mb-10" src="/error.svg" style={{ filter: 'grayscale(0%) opacity(100%)' }} alt="" />
      <h1 className="text-4xl text-center font-bold">Woops!</h1>
      {unexpected ? (
        <>
          <p className="text-xl font-light text-gray-600">Something unexpected went wrong!</p>
          <p className="text-lgfont-light text-gray-600">Please report what you were trying to do when this happened: support@fora.fun</p>
        </>
      ) : (
        <p className="text-xl font-light text-gray-600">We &apos;re having some trouble with our servers, try again in a minute!</p>
      )}
    </div>
  )
}

export default Error
