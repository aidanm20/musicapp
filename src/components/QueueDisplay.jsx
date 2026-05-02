import ThreeDots from '../assets/svg/three-dots-svgrepo-com.svg'
import UpDown from '../assets/svg/updownButton.png'
import '../styles/displaySongs.css'
import '../styles/queueDisplay.css'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

function QueueDisplay({ queue, setQueue }) {
    const [openedMenu, setOpenedMenu] = useState(null) 
    const rowRefs = useRef([])
    const draggablesRef = useRef([])

    useEffect(() => {
        if (rowRefs.current.length === 0) return

        gsap.registerPlugin(Draggable)

        // Fix 1: compact nulls (React sets ref to null on unmount) then clear transforms
        // before measuring — stale offsets on reused DOM nodes cause rollback/overlap.
        rowRefs.current = rowRefs.current.filter(Boolean)
        gsap.killTweensOf(rowRefs.current)
        gsap.set(rowRefs.current, { y: 0 })

        const heights = rowRefs.current.map(el => el.offsetHeight)
        const tops = heights.reduce((acc, _, i) => {
            acc.push(i === 0 ? 0 : acc[i - 1] + heights[i - 1])
            return acc
        }, [])

        const getTargetIdx = (i, y) => {
            const center = tops[i] + heights[i] / 2 + y
            let best = i
            let bestDist = Infinity
            tops.forEach((top, j) => {
                const dist = Math.abs(center - (top + heights[j] / 2))
                if (dist < bestDist) { bestDist = dist; best = j }
            })
            return best
        }

        draggablesRef.current = []
        rowRefs.current.forEach((rowEl, i) => {
            const upDownImg = rowEl.querySelector('.updown-handle')

            // Track target during drag so onDragEnd can use the same index.
            // We do NOT use GSAP's snap option because its callback fires AFTER
            // onDragEnd, meaning pendingTargetIdx would still be `i` (no-op splice).
            // Instead we drive the snap animation manually inside onDragEnd.
            let pendingTargetIdx = i

            const [draggable] = Draggable.create(rowEl, {
                type: "y",
                trigger: upDownImg,
                bounds: {
                    minY: -tops[i],
                    maxY: tops[tops.length - 1] + heights[heights.length - 1] - tops[i] - heights[i]
                },
                onDrag() {
                    pendingTargetIdx = getTargetIdx(i, this.y)
                    rowRefs.current.forEach((ref, j) => {
                        if (j === i) return
                        let shift = 0
                        if (i < pendingTargetIdx && j > i && j <= pendingTargetIdx) shift = -heights[i]
                        if (i > pendingTargetIdx && j < i && j >= pendingTargetIdx) shift = heights[i]
                        gsap.to(ref, { y: shift, duration: 0.15 })
                    })
                },
                onDragEnd() {
                    const targetIdx = pendingTargetIdx

                    // Correct snap position for variable heights:
                    // moving DOWN — other rows shifted up by heights[i], gap opens after target row
                    // moving UP  — target top is the correct snap destination (unchanged formula)
                    const snapY = targetIdx > i
                        ? tops[targetIdx] + heights[targetIdx] - heights[i] - tops[i]
                        : tops[targetIdx] - tops[i]

                    // Lock other rows to their final shifted positions so they don't
                    // drift while the dragged row is animating to its snap target.
                    rowRefs.current.forEach((ref, j) => {
                        if (j === i) return
                        let finalShift = 0
                        if (i < targetIdx && j > i && j <= targetIdx) finalShift = -heights[i]
                        if (i > targetIdx && j < i && j >= targetIdx) finalShift = heights[i]
                        gsap.killTweensOf(ref)
                        gsap.set(ref, { y: finalShift })
                    })

                    // Animate the dragged row to the snap position, then commit to
                    // React state only after the animation finishes — this prevents
                    // React's re-render from killing the snap mid-flight.
                    gsap.to(rowEl, {
                        y: snapY,
                        duration: 0.15,
                        ease: 'power2.out',
                        onComplete: () => {
                            const newQueue = [...queue]
                            const [moved] = newQueue.splice(i + 1, 1)
                            newQueue.splice(targetIdx + 1, 0, moved)
                            setQueue(newQueue)
                        }
                    })
                }
            })
            draggablesRef.current.push(draggable)
        })

        return () => {
            draggablesRef.current.forEach(d => d.kill())
        }
    }, [queue])

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
                    
                    <div className="songRow" key={index} ref={el => rowRefs.current[i] = el}>
                        <img
                            className='updown-handle'
                            src={UpDown}
                            alt="options"
                            width="16"
                            height="16" 
                        />
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
