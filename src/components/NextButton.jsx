import '../styles/taskbarButtons.css'
 import nextIcon from '../assets/svg/icons8-fast-forward-32.png'
function NextButton({song, setSong, songs}) {
    function handleSongs() {
      let currIndex = songs.findIndex(s => s.id === song.id)
          let nextIndex = songs[currIndex + 1]
          if (nextIndex) {
            return nextIndex
          } else {
            return songs[0]
          }
    }
     
    return (
      <button className="taskbarButton" onClick={() => setSong(handleSongs())}><img 
                      src={nextIcon} 
                      alt='next'
                      width="32"
                      height="32"
                    /></button>
    )
 
 }

 export default NextButton
