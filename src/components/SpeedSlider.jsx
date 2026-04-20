function SpeedSlider({ setSpeed }) {
    return (
    <div>
      <label>Speed</label>
      <input
        type="range"
        min=".25"
        max="4"
        step="0.01"
        defaultValue="1"
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
      />
    </div>
  )
}

export default SpeedSlider