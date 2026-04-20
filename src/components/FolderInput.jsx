import React from 'react'
import { saveSongs } from '../data/songDatabase'

let songList = []
function FolderInput({ onSongsLoaded }) {
     
    async function handleFiles(e) {
        const files = Array.from(e.target.files)
        const newSongs = files.map((file, index) => ({
            id: index,
            title: file.name.replace('.mp3', ''),  
            src: URL.createObjectURL(file)
            }))

         await saveSongs(newSongs)
        onSongsLoaded(newSongs)
    }

  return (
    <> 
        <div>Add a folder here</div>
        <input type="file" 
                accept="audio/mpeg" 
                webkitdirectory="true" 
                multiple 
                onChange={handleFiles}></input>
    </>
  )
}

export default FolderInput