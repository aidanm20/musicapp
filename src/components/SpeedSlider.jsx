import {useState} from 'react'

function SpeedSlider({ setSpeed }) {
  let [value, setValue] = useState(1)
    return (
    <div>
      <label>Speed</label>
      <input
        type="range"
        min=".25"
        max="3"
        step="0.01"
        defaultValue="1"
        onChange={(e) => 
        {
          let newValue = e.target.value
          setValue(newValue) 
          setSpeed(newValue)
        }
           }
      />
      <span>{value } x</span>
    </div>
  )
}

export default SpeedSlider