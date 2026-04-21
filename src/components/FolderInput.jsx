import React from 'react'
import { saveSongs } from '../data/songDatabase'
import '../styles/folder.css'

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
    <div className='container'> 
        <div>
            <div>Add a folder here</div>
            <input type="file" 
                    accept="audio/mpeg" 
                    webkitdirectory="true" 
                    multiple 
                    onChange={handleFiles}></input>
        </div>

        <div>
            <div>Add a file here</div>
            <input type="file" 
                    accept="audio/mpeg" 
                    onChange={handleFiles}></input>
        </div>
         
    </div >
  )
}

export default FolderInput