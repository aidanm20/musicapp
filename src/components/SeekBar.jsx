import { useState } from 'react'

function SeekBar({ setTime, currTime, totalTime }) {
  const [dragging, setDragging] = useState(false)
  const [dragValue, setDragValue] = useState(0)

  function timeFormat(seconds) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(seconds, 0) : 0
    const minutes = Math.floor(safeSeconds / 60)
    const remainingSeconds = Math.floor(safeSeconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  function commitDrag(value) {
    const nextValue = Number(value)
    setDragValue(nextValue)
    setTime(nextValue)
    setDragging(false)
  }

  const displayedTime = dragging ? dragValue : currTime

  return (
    <>
      <input
        type="range"
        min="0"
        step="1"
        max={totalTime || 0}
        value={displayedTime}
        onChange={e => {
          setDragValue(Number(e.target.value))
        }}
        onPointerDown={e => {
          e.currentTarget.setPointerCapture?.(e.pointerId)
          setDragging(true)
          setDragValue(Number(e.currentTarget.value))
        }}
        onPointerUp={e => {
          e.currentTarget.releasePointerCapture?.(e.pointerId)
          commitDrag(e.currentTarget.value)
        }}
        onPointerCancel={e => {
          e.currentTarget.releasePointerCapture?.(e.pointerId)
          commitDrag(e.currentTarget.value)
        }}
      />
      <span>current: {timeFormat(displayedTime)}</span>
      <span>total: {timeFormat(totalTime)}</span>
    </>
  )
}

export default SeekBar
