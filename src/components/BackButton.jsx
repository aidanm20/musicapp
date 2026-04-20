 

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
      <button onClick={() => setSong(handleSongs)}>back</button>
    )
 
 }

 export default BackButton