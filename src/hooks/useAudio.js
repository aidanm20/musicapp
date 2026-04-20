import { useRef, useEffect } from 'react'
import * as Tone from 'tone'

export function useAudio(song, playing, setPlay) {
    const audioRef = useRef(null)
    const pitchRef = useRef(null)

    if (!pitchRef.current) {
        pitchRef.current = new Tone.PitchShift({
  windowSize: 0.1,  // try values between 0.03 and 0.1
  delayTime: 0,
  feedback: 0
}).toDestination()
    }

    useEffect(() => {
    if (!song) return
    if (audioRef.current) audioRef.current.dispose()

    audioRef.current = new Tone.Player(song.src, () => {
      Tone.start().then(() => audioRef.current.start())
      setPlay(true)
    }).connect(pitchRef.current)
  }, [song])  

  useEffect(() => {
    if (!audioRef.current) return
    if (playing) {
      Tone.start().then(() => audioRef.current.start())
    } else {
      audioRef.current.stop()
    }
  }, [playing])

  function setPitch(value) {
    pitchRef.current.pitch = value
    }

    function setSpeed(value) {
        audioRef.current.playbackRate = value
    }

    return { setPitch, setSpeed }
}