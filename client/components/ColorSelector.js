import ColorRadio from 'components/ColorRadio'

const ColorSelector = ({ oldColor, register }) => {
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
