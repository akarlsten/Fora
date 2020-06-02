const Footer = () => (
  <div className="h-32 bg-gray-800 text-md text-white flex flex-col justify-center items-center">
    <img className="h-10 mr-2 mb-1" src="/fora-white.svg" alt="Fora Logo" />
    <div className="flex items-center">
      <span className="font-semibold text-sm text-gray-300">
      made with 🍵 by <a className="hover:text-pink-400" rel="noopener noreferrer" target="_blank" href="https://adamkarlsten.com">Adam Karlsten</a> (ak222ye)
      </span>
    </div>
    <p className="mt-2 font-light text-xs">
      Copyright 2020
    </p>
  </div>
)

export default Footer
