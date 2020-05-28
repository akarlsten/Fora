// This little helper takes a string containing the name of a color and returns the proper Tailwind hex value
// these are the color-400 variants for a nice pastel tone

const colorConverter = (color, light) => {
  if (!light) {
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
  } else {
    switch (color) {
      case 'gray':
        return '#EDF2F7'
      case 'black':
        return '#000'
      case 'red':
        return '#FED7D7'
      case 'orange':
        return '#FEEBC8'
      case 'green':
        return '#C6F6D5'
      case 'teal':
        return '#B2F5EA'
      case 'blue':
        return '#BEE3F8'
      case 'indigo':
        return '#C3DAFE'
      case 'purple':
        return '#E9D8FD'
      case 'pink':
      default:
        return '#FED7E2'
    }
  }
}

export default colorConverter
