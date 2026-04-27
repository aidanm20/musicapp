import loopIcon from '../assets/svg/loopButton.png'
import '../styles/taskbarButtons.css'

function LoopButton({ loopActive, onToggle }) {
  return (
    <button className={`modeButton${loopActive ? ' active' : ''}`} onClick={onToggle}>
      <img src={loopIcon} alt="Loop" width="34" height="34" />
    </button>
  )
}

export default LoopButton
