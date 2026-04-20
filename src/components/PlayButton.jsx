 
 
 function PlayButton( {playing, setPlay, song}) {
  return (
    <button onClick={() => setPlay(!playing)}>
      {playing ? 'Pause' : 'Play' + (song ? ': ' + song.title : '')}
    </button>
  )
 }

 export default PlayButton