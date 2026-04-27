    
  import { useState, useEffect, useRef } from 'react'
  import PlayButton from './components/PlayButton'
  import BackButton from './components/BackButton';
  import NextButton from './components/NextButton';
  import DisplaySongs from './components/DisplaySongs';
  import PitchSlider from './components/PitchSlider';
  import { useAudio } from './hooks/useAudio'
  import * as Tone from 'tone';
  import SpeedSlider from './components/SpeedSlider';
  import NCButton from './components/NCButton' 
  import FolderInput from './components/FolderInput';
  import { saveSongs, getSongs } from './data/songDatabase'
  import Desktop from './components/Desktop'
  import { deleteSong as deleteSongFromDB } from './data/songDatabase'

  async function hydrateSong(savedSong) {
    console.log('[songs] hydrating saved song', {
      id: savedSong?.id,
      title: savedSong?.title,
      hasFile: Boolean(savedSong?.file),
      hasSrc: Boolean(savedSong?.src),
      type: savedSong?.type,
    })

    if (savedSong?.file) {
      const blob = new Blob([savedSong.file], { type: savedSong.type || 'audio/mpeg' })
      return {
        ...savedSong,
        broken: false,
        src: URL.createObjectURL(blob)
      }
    }

    if (savedSong?.src) {
      try {
        console.warn('[songs] attempting legacy src migration', {
          id: savedSong.id,
          title: savedSong.title,
          src: savedSong.src,
        })
        const response = await fetch(savedSong.src)
        if (!response.ok) throw new Error('Legacy song source is no longer available')

        const file = await response.arrayBuffer()
        const migratedSong = {
          ...savedSong,
          file,
          type: savedSong.type || response.headers.get('content-type') || 'audio/mpeg'
        }

        await saveSongs([migratedSong])
        console.log('[songs] migrated legacy song into file-backed storage', {
          id: migratedSong.id,
          title: migratedSong.title,
          bytes: migratedSong.file.byteLength,
          type: migratedSong.type,
        })

        return {
          ...migratedSong,
          broken: false,
          src: URL.createObjectURL(new Blob([file], { type: migratedSong.type }))
        }
      } catch (error) {
        console.error('[songs] failed to migrate legacy song', {
          id: savedSong.id,
          title: savedSong.title,
          error,
        })
        return {
          ...savedSong,
          broken: true,
          src: null
        }
      }
    }

    return {
      ...savedSong,
      broken: true,
      src: null
    }
  }

  function App() {
    const [playing, setPlay] = useState(false);
    const [song, setSong] = useState(null);
    const [queue, setQueue] = useState([])
    const [songs, setSongs] = useState([])
    const [loopActive, setLoopActive] = useState(false)
    const [shuffleActive, setShuffleActive] = useState(false)

    const queueRef = useRef([])
    useEffect(() => { queueRef.current = queue }, [queue])
    const songsRef = useRef([])
    useEffect(() => { songsRef.current = songs }, [songs])
    const loopActiveRef = useRef(false)
    useEffect(() => { loopActiveRef.current = loopActive }, [loopActive])
    const shuffleActiveRef = useRef(false)
    useEffect(() => { shuffleActiveRef.current = shuffleActive }, [shuffleActive])

    function handleSongEnded() {
      const q = queueRef.current
      const s = songsRef.current
      const loop = loopActiveRef.current
      const shuffle = shuffleActiveRef.current

      if (q.length > 1) {
        const newQueue = q.slice(1)
        setQueue(newQueue)
        playSong(newQueue[0])
      } else if (loop && !shuffle && s.length > 0) {
        setQueue(s.slice(0))
        playSong(s[0])
      }
    }

    const {
      setPitch,
      setSpeed,
      setTime,
      currTime,
      totalTime,
      setReverb,
      setDecay,
      setBitCrush,
      setFilter,
      meterRef,
    } = useAudio(song, playing, setPlay, handleSongEnded)

    function selectSong(nextSong) {
      if (nextSong?.broken) { 
        return
      }

      
      Tone.start()
      setSong(currentSong =>
        currentSong?.id === nextSong.id ? { ...nextSong } : nextSong
      )
      const index = songs.findIndex(s => s.id === nextSong.id)
      setQueue(songs.slice(index))
    }

    function playSong(nextSong) {
      if (nextSong?.broken) { 
        return
      } 
      Tone.start()
      setSong(currentSong =>
        currentSong?.id === nextSong.id ? { ...nextSong } : nextSong
      ) 
    }

    function deleteSong(id) { 
      setSongs(prevSongs => prevSongs.filter(s => s.id !== id))
      deleteSongFromDB(id)
    }

    function addSongs(newSongs) {
      
      const songsWithUrls = newSongs.map(s => {
        const blob = new Blob([s.file], { type: s.type || 'audio/mpeg' })
        return { ...s, src: URL.createObjectURL(blob) }
      })
      setSongs(prev => [...prev, ...songsWithUrls])
    }
    
    useEffect(() => {
      let cancelled = false

      async function loadSongs() {
        try { 
          const savedSongs = await getSongs()
        

          if (savedSongs.length === 0 || cancelled) return

          const hydratedSongs = await Promise.all(savedSongs.map(hydrateSong))
          

          if (!cancelled) setSongs(hydratedSongs)
        } catch (error) {
          console.error('[songs] failed while loading songs', error)
        }
      }

      loadSongs()

      return () => {
        cancelled = true
      }
    }, [])

    return (
      <>
      
        {/**

  <PlayButton playing={playing} setPlay={setPlay} song={song} />
          <DisplaySongs setSong={setSong} songs={songs}/>
          <NextButton song={song} setSong={setSong} songs={songs}/>
          <BackButton song={song} setSong={setSong} songs={songs}/>
          <PitchSlider setPitch={setPitch} />
          <SpeedSlider setSpeed={setSpeed} />
          <NCButton setPitch={setPitch} setSpeed={setSpeed} /> 
          <FolderInput onSongsLoaded={setSongs}/>



        */}


        
          <Desktop
            songs={songs}
            setSong={selectSong}
            song={song}
            playing={playing}
            setPlay={setPlay}
            setPitch={setPitch}
            setSpeed={setSpeed}
            addSongs={addSongs}
            deleteSong={deleteSong}
            setTime={setTime}
            currTime={currTime}
            totalTime={totalTime}
            setReverb={setReverb}
            setDecay={setDecay}
            setBitCrush={setBitCrush}
            setFilter={setFilter}
            meterRef={meterRef}
            queue={queue}
            setQueue={setQueue}
            playSong={playSong}
            loopActive={loopActive}
            setLoopActive={setLoopActive}
            shuffleActive={shuffleActive}
            setShuffleActive={setShuffleActive}
          />
      </>
          
      
    )
  }

  export default App
