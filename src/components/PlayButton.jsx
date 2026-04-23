 import '../styles/taskbarButtons.css'
 import pauseIcon from '../assets/svg/icons8-pause-button-32.png'
 import playIcon from '../assets/svg/icons8-circled-play-button-32.png' 
 
 function PlayButton( {playing, setPlay}) {
  return (
    <button className="taskbarButton" onClick={() => setPlay(!playing)}>
      <img 
        src={playing ? pauseIcon : playIcon} 
        alt={playing ? 'Pause' : 'Play'}
        width="32"
        height="32"
      />
    </button>
  )
 }

 export default PlayButton
