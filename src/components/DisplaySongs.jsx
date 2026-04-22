import ThreeDots from '../assets/svg/three-dots-svgrepo-com.svg'
import '../styles/displaySongs.css'
import { useState, useEffect } from 'react'

function DisplaySongs({ setSong, songs, deleteSong }) {
    const [openedMenu, setOpenedMenu] = useState(null)

    useEffect(() => {
        function handleClick() {
            setOpenedMenu(null)
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    function openContextMenu(e, song) {
        console.log('[songs-ui] opening context menu', {
            id: song.id,
            title: song.title,
            broken: song.broken,
            x: e.clientX,
            y: e.clientY,
        })

        e.stopPropagation()
        if (openedMenu?.song?.id === song.id) {
            setOpenedMenu(null)
        } else {
            setOpenedMenu({ x: e.clientX - 400, y: e.clientY - 130, song })
        }
    }

    return (
        <div>
            {songs.map(song => (
                <div className={`songRow ${song.broken ? 'songRowBroken' : ''}`} key={song.id}>
                    <p onClick={() => {
                        console.log('[songs-ui] song row clicked', {
                            id: song.id,
                            title: song.title,
                            broken: song.broken,
                        })
                        if (!song.broken) setSong(song)
                    }}>
                        {song.title}
                        {song.broken ? ' (re-import needed)' : ''}
                    </p>
                    <img
                        className='threeDots'
                        src={ThreeDots}
                        alt="options"
                        width="16"
                        height="16"
                        onClick={(e) => openContextMenu(e, song)}
                    />
                </div>
            ))}

            {openedMenu && (
                <div className="contextMenu" style={{ position: 'fixed', left: openedMenu.x, top: openedMenu.y }}>
                    {openedMenu.song.broken
                        ? <p>Re-import song</p>
                        : <p onClick={() => {
                            console.log('[songs-ui] context play clicked', {
                                id: openedMenu.song.id,
                                title: openedMenu.song.title,
                            })
                            setSong(openedMenu.song)
                        }}>Play</p>}
                    <p onClick={() => {
                        console.log('[songs-ui] context delete clicked', {
                            id: openedMenu.song.id,
                            title: openedMenu.song.title,
                        })
                        deleteSong(openedMenu.song.id)
                    }}>Delete</p>
                </div>
            )}
        </div>
    )
}

export default DisplaySongs
