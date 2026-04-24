import '../App.css'
import '../styles/slider.css'
import { useState} from 'react'
function ReverbSlider({ setReverb, disabled }) {
    const [value, setValue] = useState(0)
   
    let percentage = value * 100
    return (
    <div>
      <label>Reverb</label>
      <input
        type="range"
        min="0"
        step="0.01"
        max="1"
        defaultValue="0"
        disabled={disabled}
        onChange={(e) =>
        {
          let newValue = parseFloat(e.target.value)
          setValue(newValue)
          setReverb(newValue)
        }
           }
      />
      <span>{Math.floor(percentage)} %</span>
    </div>
  )
}

export default ReverbSlider
