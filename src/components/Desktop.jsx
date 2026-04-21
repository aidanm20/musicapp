import '../styles/desktop.css'
import {useState} from 'react'
import Window from './Window'
import DisplaySongs from './DisplaySongs'
import FolderInput from './FolderInput'
import NCButton from './NCButton'
import SpeedSlider from './SpeedSlider'
import PitchSlider from './PitchSlider'

function Desktop({ songs, setSong, song, playing, setPlay, setPitch, setSpeed, setSongs, deleteSong }) {

    const [openSongs, setOpenSongs] = useState(false)
    const [openMixer, setOpenMixer] = useState(false)
    const [openImport, setOpenImport] = useState(false)
    const [openManage, setOpenManage] = useState(false)

  return (
    <> 
    <div className="desktop">
      <div className="scanlines"></div>
      <div className="icons">
        <div className="icon" onClick={() => setOpenSongs(!openSongs)}>
          <div className="icon-img songs">🎵</div>
          <div className="icon-label">SONGS</div>
        </div>
        <div className="icon" onClick={() => setOpenMixer(!openMixer)}>
          <div className="icon-img mixer">🎚️</div>
          <div className="icon-label">MIXER</div> 
        </div>
        <div className="icon" onClick={() => setOpenImport(!openImport)}>
          <div className="icon-img import">📁</div>
          <div className="icon-label">IMPORT</div> 
        </div>
        <div className="icon" onClick={() => setOpenManage(!openManage)}>
          <div className="icon-img manage">🗑️</div>
          <div className="icon-label">MANAGE</div> 
        </div>
      </div>
      
       {openSongs ? <Window title="SONGS" onClose={() => setOpenSongs(!openSongs)} children={<DisplaySongs setSong={setSong} songs={songs} deleteSong={deleteSong} /> } className="songs-window"></Window> : null}
       {openMixer ? <Window title="MIXER" onClose={() => setOpenMixer(!openMixer)} children={<><PitchSlider setPitch={setPitch} /><SpeedSlider setSpeed={setSpeed} /><NCButton setPitch={setPitch} setSpeed={setSpeed} /></>} className='mixer-window' ></Window> : null}

       {openImport ? <Window title="IMPORT" onClose={() => setOpenImport(!openImport)} children={<FolderInput onSongsLoaded={setSongs} />} className='import-window' ></Window> : null}

    </div>
    <div className="taskbar">
        ♫ nothing playing
      </div></>
  )
}

export default Desktop