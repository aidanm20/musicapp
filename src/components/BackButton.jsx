 import '../styles/taskbarButtons.css'
 import backIcon from '../assets/svg/icons8-rewind-32.png'

function BackButton({song, setSong, songs}) {
    function handleSongs() {
      let currIndex = songs.findIndex(s => s.id === song.id)
          let nextIndex = songs[currIndex - 1]
          if (nextIndex) {
            return nextIndex
          } else {
            return songs[songs.length - 1]
          }
    }
     
    return (
      <button className="taskbarButton" onClick={() => setSong(handleSongs())}>
        <img 
                src={backIcon} 
                alt='back'
                width="32"
                height="32"
              />
      </button>
    )
 
 }

 export default BackButton
