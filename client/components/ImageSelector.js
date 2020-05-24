import { useState, useEffect } from 'react'

const validImageTypes = 'image/gif, image/jpeg, image/jpg, image/png'

const ImageSelector = ({ oldImage, getValues, watch, triggerValidation, formErrors, register, color }) => {
  const files = watch('image')
  const [iconPreview, setIconPreview] = useState(oldImage)

  useEffect(() => {
    if (files && files[0]) {
      triggerValidation('image')
      if (!formErrors?.image?.message) {
        const imgUrl = URL.createObjectURL(files[0])
        setIconPreview(imgUrl)
      } else {
        setIconPreview(null)
      }
    }
  }, [files, files && files[0], formErrors?.image?.message])

  return (
    <>
      <div className="flex p-4 flex-col sm:flex-row sm:items-center">
        <div className="flex justify-center mb-4 sm:mb-0 mr-0 sm:mr-4">
          {iconPreview ? (
            <img className={'max-w-none my-2 w-24 md:w-32 lg:w-48 h-24 md:h-32 lg:h-48 rounded-full'} src={iconPreview} alt="" />
          ) : (
            <svg className={'my-2 w-24 md:w-32 lg:w-40 rounded-full fill-current'} width="159" height="159" viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className={`text-${color || 'pink'}-400`} cx="79.5" cy="79.5" r="79.5" />
              <ellipse cx="88" cy="69.5" rx="61" ry="61.5" fill="#EFFFFB" fillOpacity="0.51" />
              <circle cx="96" cy="59" r="43" fill="white" />
            </svg>
          )}
        </div>
        <input onChange={() => getValues('icon')} accept={validImageTypes} type="file" ref={register({
          required: false,
          validate: {
            wrongFileType: value => (!value[0] || validImageTypes.indexOf(`${value[0].type}`) > 0) || '⚠ Please provide a valid image type: GIF, JPG, or PNG.',
            largerThan5MB: value => (!value[0] || value[0].size < 5 * 1024 * 1024) || '⚠ Image cannot exceed 5MB.'
          }
        })} name="image" />
      </div>
      { formErrors.image && (<span className="text-sm text-red-600">{formErrors.image.message}</span>) }
    </>
  )
}

export default ImageSelector
