  
import { useState, useEffect, useRef } from 'react'
import PlayButton from './components/PlayButton'
import BackButton from './components/BackButton';
import NextButton from './components/NextButton';
import DisplaySongs from './components/DisplaySongs';
import PitchSlider from './components/PitchSlider';
import { useAudio } from './hooks/useAudio';
import SpeedSlider from './components/SpeedSlider';
import NCButton from './components/NCButton' 
import FolderInput from './components/FolderInput';
 import { saveSongs, getSongs } from './data/songDatabase'
 import Desktop from './components/Desktop'
import { deleteSong as deleteSongFromDB } from './data/songDatabase'

 function App() {
  const [playing, setPlay] = useState(false);
  const [song, setSong] = useState(null); 
  const [songs, setSongs] = useState([])
  const { setPitch, setSpeed } = useAudio(song, playing, setPlay)

  function deleteSong(id) {
    setSongs(songs.filter(s => s.id !== id)) 
    deleteSongFromDB(id)
  }
  
  useEffect(() => {
    getSongs().then(savedSongs => {
      if (savedSongs.length > 0) {
        setSongs(savedSongs)
      }
    })
  }, [])

  return (
     <>
     
      {/**

<PlayButton playing={playing} setPlay={setPlay} song={song} />
        <DisplaySongs setSong={setSong} songs={songs}/>
        <NextButton song={song} setSong={setSong} songs={songs}/>
        <BackButton song={song} setSong={setSong} songs={songs}/>
        <PitchSlider setPitch={setPitch} />
        <SpeedSlider setSpeed={setSpeed} />
        <NCButton setPitch={setPitch} setSpeed={setSpeed} /> 
        <FolderInput onSongsLoaded={setSongs}/>



       */}


      
        <Desktop 
          songs={songs}
          setSong={setSong}
          song={song}
          playing={playing}
          setPlay={setPlay}
          setPitch={setPitch}
          setSpeed={setSpeed}
          setSongs={setSongs}
          deleteSong={deleteSong}
        />
     </>
         
    
  )
}

export default App