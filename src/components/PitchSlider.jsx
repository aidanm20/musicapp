import '../App.css'

function PitchSlider({ setPitch }) {

   

    return (
    <div>
      <label>Pitch</label>
      <input
        type="range"
        min="-7"
        step="0.01"
        max="7"
        defaultValue="0"
        onChange={(e) => setPitch(parseFloat(e.target.value))}
      />
    </div>
  )
}

export default PitchSlider