import shuffleIcon from '../assets/svg/shuffleButton.png'
import '../styles/taskbarButtons.css'

function ShuffleButton({ shuffleActive, onToggle }) {
  return (
    <button className={`modeButton${shuffleActive ? ' active' : ''}`} onClick={onToggle}>
      <img src={shuffleIcon} alt="Shuffle" width="34" height="34" />
    </button>
  )
}

export default ShuffleButton
