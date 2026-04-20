import '../styles/desktop.css'
import {useState} from 'react'
import Window from './Window'
import DisplaySongs from './DisplaySongs'

function Desktop({ songs, setSong, song, playing, setPlay, setPitch, setSpeed, setSongs }) {

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
          {openMixer ? <div>Mixer window is open!</div> : null}
        </div>
        <div className="icon" onClick={() => setOpenImport(!openImport)}>
          <div className="icon-img import">📁</div>
          <div className="icon-label">IMPORT</div>
          {openImport ? <div>Import window is open!</div> : null}
        </div>
        <div className="icon" onClick={() => setOpenManage(!openManage)}>
          <div className="icon-img manage">🗑️</div>
          <div className="icon-label">MANAGE</div>
          {openManage ? <div>Manage window is open!</div> : null}
        </div>
      </div>
      
       {openSongs ? <Window title="SONGS" onClose={() => setOpenSongs(!openSongs)} children={<DisplaySongs setSong={setSong} songs={songs} /> } className="songs-window"></Window> : null}
       

    </div>
    <div className="taskbar">
        ♫ nothing playing
      </div></>
  )
}

export default Desktop