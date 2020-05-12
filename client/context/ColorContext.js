import { createContext, useState, useContext } from 'react'

const ColorContext = createContext()
const ColorContextProvider = ColorContext.Provider

function ColorThemeProvider ({ children }) {
  const [theme, setTheme] = useState('pink')

  return (
    <ColorContextProvider value={{ theme, setTheme }}>
      {children}
    </ColorContextProvider>
  )
}

function useTheme () {
  const all = useContext(ColorContext)
  return all
}
export { ColorThemeProvider, ColorContext, useTheme }
