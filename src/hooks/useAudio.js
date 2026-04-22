import { useRef, useEffect } from 'react'
import * as Tone from 'tone'

function stopPlayer(player) {
    if (!player) return

    try {
        console.log('[audio] stopping player', {
            loaded: player.loaded,
            state: player.state,
        })
        player.stop()
    } catch {
        // Stop throws if the player is already stopped or disposed.
        console.warn('[audio] stopPlayer ignored stop error')
    }
}

export function useAudio(song, playing, setPlay) {
    const audioRef = useRef(null)
    const pitchRef = useRef(null)
    const speedRef = useRef(1)

    useEffect(() => {
        console.log('[audio] creating pitch shifter')
        pitchRef.current = new Tone.PitchShift({ windowSize: 0.1 }).toDestination()
        return () => {
            console.log('[audio] disposing audio hook')
            if (audioRef.current) {
                stopPlayer(audioRef.current)
                audioRef.current.dispose()
                audioRef.current = null
            }
            pitchRef.current?.dispose()
            pitchRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!song) return

        console.log('[audio] received song for playback', {
            id: song.id,
            title: song.title,
            type: song.type,
            hasSrc: Boolean(song.src),
            fileBytes: song.file?.byteLength,
        })
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

        console.log('[audio] resolved playback source', {
            songId: song.id,
            usedFallbackSrc: Boolean(fallbackSrc && !song.src),
            source,
        })

        if (!source) {
            console.error('[audio] no playable source found for song', {
                id: song.id,
                title: song.title,
            })
            return
        }

        const player = new Tone.Player({
            url: source,
            onload: () => {
                if (cancelled) return

                console.log('[audio] player loaded source', {
                    songId: song.id,
                    state: player.state,
                    loaded: player.loaded,
                })
                player.playbackRate = speedRef.current

                Tone.start()
                    .then(() => {
                        if (cancelled || audioRef.current !== player) return
                        console.log('[audio] starting player after Tone.start()', {
                            songId: song.id,
                            playbackRate: player.playbackRate,
                            contextState: Tone.getContext().rawContext.state,
                        })
                        player.start()
                        setPlay(true)
                    })
                    .catch(err => {
                        if (!cancelled) console.error('Audio error:', err)
                    })
            },
            onerror: (error) => {
                if (!cancelled) {
                    console.error('[audio] Tone.Player failed to load source', {
                        songId: song.id,
                        source,
                        error,
                    })
                }
            },
        }).connect(pitchRef.current ?? Tone.getDestination())

        audioRef.current = player

        return () => {
            cancelled = true
            console.log('[audio] cleaning up player', {
                songId: song.id,
                usedFallbackSrc: Boolean(fallbackSrc && !song.src),
            })
            if (audioRef.current === player) {
                stopPlayer(player)
                audioRef.current = null
            }
            player.dispose()
            if (fallbackSrc) URL.revokeObjectURL(fallbackSrc)
        }
    }, [song, setPlay])

    useEffect(() => {
        if (!audioRef.current?.loaded) return
        console.log('[audio] playing state changed', {
            playing,
            playerState: audioRef.current.state,
            loaded: audioRef.current.loaded,
        })
        if (playing) {
            if (audioRef.current.state !== 'started') {
                Tone.start().then(() => {
                    console.log('[audio] play effect starting current player', {
                        contextState: Tone.getContext().rawContext.state,
                    })
                    audioRef.current?.start()
                })
            }
        } else {
            stopPlayer(audioRef.current)
        }
    }, [playing])

    function setPitch(value) {
        console.log('[audio] setPitch called', { value })
        if (pitchRef.current) pitchRef.current.pitch = value
    }

    function setSpeed(value) {
        console.log('[audio] setSpeed called', { value })
        speedRef.current = value
        if (audioRef.current) audioRef.current.playbackRate = value
    }

    return { setPitch, setSpeed }
}
