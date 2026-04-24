import '../App.css'
import '../styles/slider.css'
import { useState} from 'react'
function PitchSlider({ setPitch, disabled }) {
    const [value, setValue] = useState(0)
   

    return (
    <div>
      <label>Pitch</label>
      <input
        type="range"
        min="-7"
        step="0.01"
        max="7"
        defaultValue="0"
        disabled={disabled}
        onChange={(e) => 
        {
          let newValue = parseFloat(e.target.value)
          setValue(newValue)
          setPitch(newValue)
        }
           }
      />
      <span>{value} st</span>
    </div>
  )
}

export default PitchSlider
