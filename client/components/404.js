
const NotFound = () => {
  return (
    <div className="w-full lg:w-3/4 flex flex-col justify-center items-center mt-10">
      <img className="w-64 self-center mb-10" src="/ufo.svg" style={{ filter: 'grayscale(0%) opacity(100%)' }} alt="" />
      <h1 className="text-6xl text-center font-bold">404</h1>
      <p className="text-3xl font-light text-gray-600">We couldn&apos;t find what you were looking for!</p>
    </div>
  )
}

export default NotFound
