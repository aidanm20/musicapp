 

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
      <button onClick={() => setSong(handleSongs)}>next</button>
    )
 
 }

 export default NextButton