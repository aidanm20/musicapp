import { useCallback, useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

function stopPlayer(player) {
  if (!player) return

  try {
    player.stop()
  } catch {
    // Tone throws if the source is already stopped or disposed.
  }
}

export function useAudio(song, playing, setPlay) {
  const audioRef = useRef(null)
  const pitchRef = useRef(null)
  const reverbRef = useRef(null)
  const bitCrushRef= useRef(null)
  const filterRef = useRef(null)
  const userPitchRef = useRef(0)
  const speedRef = useRef(1)
  const progressTimerRef = useRef(null)
  const resetTimerRef = useRef(null)
  const playbackOffsetRef = useRef(0)
  const playbackStartedAtRef = useRef(null)
  const isPlayingRef = useRef(false)
  const totalTimeRef = useRef(0)

  const [currTime, setCurrTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  const getSpeedPitchCompensation = useCallback(playbackRate => {
    if (!Number.isFinite(playbackRate) || playbackRate <= 0) {
      return 0
    }

    return -12 * Math.log2(playbackRate)
  }, [])

  const applyEffectivePitch = useCallback(() => {
    if (!pitchRef.current) return

    pitchRef.current.pitch =
      userPitchRef.current + getSpeedPitchCompensation(speedRef.current)
  }, [getSpeedPitchCompensation])

  const clearProgressTimer = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }, [])

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
  }, [])

  const resetDisplayedPlayback = useCallback(() => {
    clearResetTimer()
    resetTimerRef.current = window.setTimeout(() => {
      setCurrTime(0)
      setTotalTime(0)
      resetTimerRef.current = null
    }, 0)
  }, [clearResetTimer])

  const clampTime = useCallback(value => {
    const max = totalTimeRef.current || 0
    const nextValue = Number.isFinite(value) ? value : 0
    return Math.min(Math.max(nextValue, 0), max)
  }, [])

  const getLiveTime = useCallback(() => {
    const baseOffset = clampTime(playbackOffsetRef.current)

    if (!isPlayingRef.current || playbackStartedAtRef.current === null) {
      return baseOffset
    }

    const elapsedSeconds = (performance.now() - playbackStartedAtRef.current) / 1000
    return clampTime(baseOffset + elapsedSeconds * speedRef.current)
  }, [clampTime])

  const syncPlaybackOffset = useCallback(() => {
    playbackOffsetRef.current = getLiveTime()
    if (isPlayingRef.current) {
      playbackStartedAtRef.current = performance.now()
    }
    return playbackOffsetRef.current
  }, [getLiveTime])

  const finishPlayback = useCallback(() => {
    clearProgressTimer()
    isPlayingRef.current = false
    playbackStartedAtRef.current = null
    playbackOffsetRef.current = totalTimeRef.current
    setCurrTime(totalTimeRef.current)
    setPlay(false)
  }, [clearProgressTimer, setPlay])

  const syncDisplayedTime = useCallback(() => {
    if (!audioRef.current?.loaded) return

    const nextTime = getLiveTime()
    setCurrTime(nextTime)

    if (
      isPlayingRef.current &&
      totalTimeRef.current > 0 &&
      (nextTime >= totalTimeRef.current || audioRef.current.state !== 'started')
    ) {
      finishPlayback()
    }
  }, [finishPlayback, getLiveTime])

  const startProgressTimer = useCallback(() => {
    clearProgressTimer()
    progressTimerRef.current = window.setInterval(syncDisplayedTime, 100)
  }, [clearProgressTimer, syncDisplayedTime])

  const beginPlayback = useCallback((offset = playbackOffsetRef.current) => {
    const player = audioRef.current
    if (!player?.loaded) return

    const safeOffset = clampTime(offset)
    const shouldRestart = player.state === 'started'

    playbackOffsetRef.current = safeOffset
    playbackStartedAtRef.current = performance.now()
    isPlayingRef.current = true
    setCurrTime(safeOffset)

    if (safeOffset >= totalTimeRef.current && totalTimeRef.current > 0) {
      playbackOffsetRef.current = 0
      playbackStartedAtRef.current = performance.now()
      setCurrTime(0)
    }

    const startOffset = playbackOffsetRef.current

    if (shouldRestart) {
      player.restart(Tone.now(), startOffset)
    } else {
      player.start(Tone.now(), startOffset)
    }

    startProgressTimer()
  }, [clampTime, startProgressTimer])

  const pausePlayback = useCallback(() => {
    const player = audioRef.current
    if (!player?.loaded) return

    playbackOffsetRef.current = getLiveTime()
    playbackStartedAtRef.current = null
    isPlayingRef.current = false
    clearProgressTimer()
    setCurrTime(playbackOffsetRef.current)

    if (player.state === 'started') {
      stopPlayer(player)
    }
  }, [clearProgressTimer, getLiveTime])

  useEffect(() => {
    reverbRef.current = new Tone.Reverb({ decay: 4, wet: 0 }).toDestination()
     
    filterRef.current = new Tone.Filter({frequency: 20000}).connect(reverbRef.current)
    bitCrushRef.current = new Tone.BitCrusher({bits: 8}).connect(filterRef.current)
    pitchRef.current = new Tone.PitchShift({ windowSize: 0.1 }).connect(bitCrushRef.current)
    applyEffectivePitch()

    return () => {
      clearProgressTimer()
      clearResetTimer()

      if (audioRef.current) {
        stopPlayer(audioRef.current)
        audioRef.current.dispose()
        audioRef.current = null
      }
      bitCrushRef.current?.dispose()
      bitCrushRef.current = null
      pitchRef.current?.dispose()
      pitchRef.current = null
      reverbRef.current?.dispose()
      reverbRef.current = null
      filterRef.current?.dispose()
      filterRef.current = null
    }
  }, [applyEffectivePitch, clearProgressTimer, clearResetTimer])

  useEffect(() => {
    clearProgressTimer()
    clearResetTimer()
    playbackOffsetRef.current = 0
    playbackStartedAtRef.current = null
    isPlayingRef.current = false
    totalTimeRef.current = 0
    resetDisplayedPlayback()

    if (!song) {
      if (audioRef.current) {
        stopPlayer(audioRef.current)
        audioRef.current.dispose()
        audioRef.current = null
      }
      return
    }

    let cancelled = false

    if (audioRef.current) {
      stopPlayer(audioRef.current)
      audioRef.current.dispose()
      audioRef.current = null
    }

    const fallbackSrc = song.file
      ? URL.createObjectURL(new Blob([song.file], { type: song.type || 'audio/mpeg' }))
      : null
    const source = song.src ?? fallbackSrc

    if (!source) {
      return
    }

    const player = new Tone.Player({
      url: source,
      onload: () => {
        if (cancelled) return

        clearResetTimer()
        player.playbackRate = speedRef.current
        totalTimeRef.current = player.buffer.duration
        setTotalTime(player.buffer.duration)
        setCurrTime(0)

        Tone.start()
          .then(() => {
            if (cancelled || audioRef.current !== player) return
            beginPlayback(0)
            setPlay(true)
          })
          .catch(error => {
            if (!cancelled) {
              console.error('Audio error:', error)
            }
          })
      },
      onerror: error => {
        if (!cancelled) {
          console.error('Audio error:', error)
        }
      },
    }).connect(pitchRef.current ?? Tone.getDestination())

    audioRef.current = player

    return () => {
      cancelled = true
      clearProgressTimer()
      clearResetTimer()

      if (audioRef.current === player) {
        stopPlayer(player)
        audioRef.current = null
      }

      player.dispose()
      if (fallbackSrc) URL.revokeObjectURL(fallbackSrc)
    }
  }, [beginPlayback, clearProgressTimer, clearResetTimer, resetDisplayedPlayback, setPlay, song])

  useEffect(() => {
    if (!audioRef.current?.loaded) return

    if (playing) {
      Tone.start().then(() => {
        if (!audioRef.current?.loaded || !playing || isPlayingRef.current) return
        beginPlayback(playbackOffsetRef.current)
      })
      return
    }

    if (isPlayingRef.current) {
      pausePlayback()
    }
  }, [beginPlayback, pausePlayback, playing])

  function setPitch(value) {
    userPitchRef.current = Number(value)
    applyEffectivePitch()
  }

  function setReverb(value) {
        reverbRef.current.wet.value = value
  }

  function setDecay(value) {
    reverbRef.current.decay = value
  }

  function setBitCrush(value) {
    bitCrushRef.current.bits.value = value
  }

  function setSpeed(value) {
    const numericValue = Number(value)
    speedRef.current = numericValue

    if (isPlayingRef.current) {
      syncPlaybackOffset()
    }

    if (audioRef.current) {
      audioRef.current.playbackRate = numericValue
    }

    applyEffectivePitch()
  }

  function setFilter(value) {
    filterRef.current.frequency.value = value
  }

  function setTime(value) {
    const player = audioRef.current
    const safeOffset = clampTime(Number(value))

    playbackOffsetRef.current = safeOffset
    setCurrTime(safeOffset)

    if (!player?.loaded) return

    if (!isPlayingRef.current) {
      return
    }

    if (safeOffset >= totalTimeRef.current && totalTimeRef.current > 0) {
      pausePlayback()
      playbackOffsetRef.current = totalTimeRef.current
      setCurrTime(totalTimeRef.current)
      setPlay(false)
      return
    }

    playbackStartedAtRef.current = performance.now()

    if (player.state === 'started') {
      player.seek(safeOffset)
    } else {
      player.start(Tone.now(), safeOffset)
    }

    startProgressTimer()
  }

  return { setPitch, setSpeed, setTime, currTime, totalTime, setReverb, setDecay, setBitCrush, setFilter }
}
