import '../styles/taskbarButtons.css'
import nextIcon from '../assets/svg/icons8-fast-forward-32.png'

function getRandomSongs(songs, count) {
  return Array.from({ length: count }, () => songs[Math.floor(Math.random() * songs.length)])
}

function NextButton({ song, playSong, songs, queue, setQueue, loopActive, shuffleActive }) {
  function handleSongs() {
    const nextSong = queue[1]

    if (!nextSong) {
      if (loopActive && !shuffleActive) {
        setQueue(songs.slice(0))
        return songs[0]
      }
      return song
    }

    const newQueue = queue.slice(1)

    if (loopActive && shuffleActive) {
      if (newQueue.length < 10) {
        const extra = getRandomSongs(songs, 10 - newQueue.length)
        setQueue([...newQueue, ...extra])
      } else {
        setQueue(newQueue)
      }
    } else {
      setQueue(newQueue)
    }

    return nextSong
  }

  return (
    <button className="taskbarButton" onClick={() => playSong(handleSongs())}>
      <img src={nextIcon} alt='next' width="32" height="32" />
    </button>
  )
}

export default NextButton
