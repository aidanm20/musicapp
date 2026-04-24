 import '../styles/taskbarButtons.css'
 import pauseIcon from '../assets/svg/icons8-pause-button-32.png'
 import playIcon from '../assets/svg/icons8-circled-play-button-32.png' 
 
 function PlayButton( {playing, setPlay}) {
  return (
    <button className="taskbarButton playButton" onClick={() => setPlay(!playing)}>
      <img 
        src={playing ? pauseIcon : playIcon} 
        alt={playing ? 'Pause' : 'Play'}
        width="38"
        height="38"
      />
    </button>
  )
 }

 export default PlayButton
