import ThreeDots from '../assets/svg/three-dots-svgrepo-com.svg'
import '../styles/displaySongs.css'
import '../styles/queueDisplay.css'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

function QueueDisplay({ queue, setQueue }) {
    const [openedMenu, setOpenedMenu] = useState(null)

    useEffect(() => {
        function handleClick() {
            setOpenedMenu(null)
        }
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    function openContextMenu(e, index) {
        e.stopPropagation()
        if (openedMenu?.index === index) {
            setOpenedMenu(null)
            return
        }
        setOpenedMenu({ x: e.clientX, y: e.clientY + 20, index })
    }

    if (queue.length === 0) {
        return <div style={{ padding: '12px', color: '#999' }}>Queue is empty</div>
    }

    return (
        <div className="queue-display">
            {queue.slice(1).map((song, i) => {
                const index = i + 1
                return (
                    <div className="songRow" key={index}>
                        <p>{song.title}</p>
                        <img
                            className='threeDots'
                            src={ThreeDots}
                            alt="options"
                            width="16"
                            height="16"
                            onClick={(e) => openContextMenu(e, index)}
                        />
                    </div>
                )
            })}
            {openedMenu !== null && createPortal(
                <div className="queueContextMenu" style={{ left: openedMenu.x, top: openedMenu.y }}>
                    <p onClick={() => {
                        setQueue(queue.filter((_, i) => i !== openedMenu.index))
                        setOpenedMenu(null)
                    }}>Delete</p>
                </div>,
                document.body
            )}
        </div>
    )
}

export default QueueDisplay
