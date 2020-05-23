// This little helper takes a string containing the name of a color and returns the proper Tailwind hex value
// these are the color-400 variants for a nice pastel tone

const colorConverter = (color) => {
  switch (color) {
    case 'gray':
      return '#CBD5E0'
    case 'black':
      return '#000'
    case 'red':
      return '#FC8181'
    case 'orange':
      return '#F6AD55'
    case 'green':
      return '#68D391'
    case 'teal':
      return '#4FD1C5'
    case 'blue':
      return '#63B3ED'
    case 'indigo':
      return '#7F9CF5'
    case 'purple':
      return '#B794F4'
    case 'pink':
    default:
      return '#F687B3'
  }
}

export default colorConverter
