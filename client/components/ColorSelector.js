const ColorRadio = ({ color, register, oldColor }) => {
  if (color === 'black') {
    return (<label className="inline-flex bg-gray-200 items-center p-1 sm:p-2 border-black border-2 sm:border-4 rounded">
      <input type="radio" ref={register} defaultChecked={oldColor === color} className="form-radio h-4 sm:h-6 w-4 sm:w-6 text-black" name="colorScheme" value="black" />
      <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-800 font-bold">Gray/Black</span>
    </label>)
  } else {
    return (
      <label className={`inline-flex items-center p-1 sm:p-2 bg-${color}-200 border-${color}-400 border-2 sm:border-4 rounded`}>
        <input type="radio" ref={register} className={`form-radio text-${color}-400 h-4 w-4 sm:h-6 sm:w-6`} name="colorScheme" value={color} defaultChecked={oldColor === color} />
        <span className={`ml-1 sm:ml-2 text-sm sm:text-base text-${color}-800 font-bold`}>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
      </label>
    )
  }
}

const ColorSelector = ({ oldColor, register }) => {
  oldColor = oldColor || 'pink'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
      <ColorRadio color="red" oldColor={oldColor} register={register} />
      <ColorRadio color="orange" oldColor={oldColor} register={register} />
      <ColorRadio color="green" oldColor={oldColor} register={register} />
      <ColorRadio color="teal" oldColor={oldColor} register={register} />
      <ColorRadio color="blue" oldColor={oldColor} register={register} />
      <ColorRadio color="indigo" oldColor={oldColor} register={register} />
      <ColorRadio color="purple" oldColor={oldColor} register={register} />
      <ColorRadio color="pink" oldColor={oldColor} register={register} />
      <ColorRadio color="black" oldColor={oldColor} register={register} />
    </div>
  )
}

export default ColorSelector
