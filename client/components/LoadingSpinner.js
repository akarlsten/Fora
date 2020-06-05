import { useTheme } from 'context/ColorContext'
import colorConverter from 'lib/colorConverter'

const LoadingSpinner = () => {
  const { theme } = useTheme()

  const color = colorConverter(theme)

  return (
    <div className="LoadingSpinner">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
      <style jsx>
        {`
      .LoadingSpinner {
  display: flex;
  flex-direction: column;
  margin-top: 10rem;
  justify-content: center;
  align-items: center;
  align-self-center;
}

.lds-text {
  color: white;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 120px;
  height: 120px;
}

.lds-ripple div {
  position: absolute;
  border: 4px solid ${color};
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 50px;
    left: 50px;
    width: 0;
    height: 0;
    opacity: 1;
  }

  100% {
    top: 0px;
    left: 0px;
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
      `}
      </style>
    </div>
  )
}

export default LoadingSpinner
