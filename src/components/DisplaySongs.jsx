import ThreeDots from '../assets/svg/three-dots-svgrepo-com.svg'
import '../styles/displaySongs.css'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

function DisplaySongs({ setSong, songs, deleteSong, queue, setQueue }) {
    const [openedMenu, setOpenedMenu] = useState(null)

    useEffect(() => {
        function handleClick() {
            setOpenedMenu(null)
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    function openContextMenu(e, song) {
        e.stopPropagation()
        if (openedMenu?.song?.id === song.id) {
            setOpenedMenu(null)
            return
        }
        setOpenedMenu({ x: e.clientX, y: e.clientY + 20, song })
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

            {openedMenu && createPortal(
                <div className="contextMenu" style={{ left: openedMenu.x, top: openedMenu.y }}>
                    {openedMenu.song.broken
                        ? <p>Re-import song</p>
                        : <p onClick={() => {
                            setSong(openedMenu.song)
                        }}>Play</p>}

                    <p onClick={() => {
                        setQueue([...queue, openedMenu.song])
                    }}>Add to Q</p>
                    <p onClick={() => {
                        setQueue(queue.length > 0
                            ? [queue[0], openedMenu.song, ...queue.slice(1)]
                            : [openedMenu.song])
                    }}>Play Next</p>
                    <p onClick={() => {
                        deleteSong(openedMenu.song.id)
                    }}>Delete</p>
                </div>,
                document.body
            )}
        </div>
    )
}

export default DisplaySongs
