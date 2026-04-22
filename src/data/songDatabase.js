import { openDB } from 'idb'

// opens or creates the database
const db = await openDB('music-app', 1, {
  upgrade(db) {
    db.createObjectStore('songs', { keyPath: 'id' })
  }
})

export async function saveSongs(songs) {
  console.log('[db] saveSongs called', {
    count: songs.length,
    songs: songs.map(song => ({
      id: song.id,
      title: song.title,
      hasFile: Boolean(song.file),
      fileBytes: song.file?.byteLength,
      hasSrc: Boolean(song.src),
      type: song.type,
    })),
  })
  const tx = db.transaction('songs', 'readwrite')
  songs.forEach(song => tx.store.put(song))
  await tx.done
  console.log('[db] saveSongs committed', { count: songs.length })
}

export async function getSongs() {
  const songs = await db.getAll('songs')
  console.log('[db] getSongs returned', {
    count: songs.length,
    songs: songs.map(song => ({
      id: song.id,
      title: song.title,
      hasFile: Boolean(song.file),
      hasSrc: Boolean(song.src),
      type: song.type,
    })),
  })
  return songs
}

export async function deleteSong(id) {
  console.log('[db] deleteSong called', { id })
  const db = await openDB('music-app', 1)
  await db.delete('songs', id)
  console.log('[db] deleteSong committed', { id })
}
