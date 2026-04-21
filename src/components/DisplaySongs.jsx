import ThreeDots from '../assets/svg/three-dots-svgrepo-com.svg'
import '../styles/displaySongs.css' 
import { useState, useEffect } from 'react'

 

function DisplaySongs({setSong, songs, deleteSong}) {
    const [openedMenu, setOpenedMenu] = useState(null)
    useEffect(() => {
    function handleClick() {
        setOpenedMenu(null)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
    }, [])

    function openContextMenu(e, song) {
        console.log('x:', e.clientX, 'y:', e.clientY) 
        
        e.stopPropagation()
        if (openedMenu?.song?.id === song.id) {
            setOpenedMenu(null)   
        } else {
            setOpenedMenu({ x: e.clientX - 400, y: e.clientY - 130, song: song })
        }
     }

    function closeContextMenu() {
        setOpenedMenu(null)
     }

    return (
      <div> 
            {songs.map(song =>
            <div className="songRow" key={song.id}>
                <p onClick={() => setSong(song)}  >{song.title}</p>
                <img className='threeDots' src={ThreeDots} alt="options" width="16" 
                height="16" onClick={(e) => openContextMenu(e, song)}/>
            </div>
             )
            
            }


            {openedMenu && (
            <div className="contextMenu" style={{ position: 'fixed', left: openedMenu.x, top: openedMenu.y }}>
                <p onClick={() => setSong(openedMenu.song)}>▶ Play</p>
                <p onClick={() => deleteSong(openedMenu.song.id)}>✕ Delete</p>
            </div>
            )}
        </div>

        
  )
 }

 export default DisplaySongs