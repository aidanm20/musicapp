import { openDB } from 'idb'

// opens or creates the database
const db = await openDB('music-app', 1, {
  upgrade(db) {
    db.createObjectStore('songs', { keyPath: 'id' })
  }
})

export async function saveSongs(songs) {
  const tx = db.transaction('songs', 'readwrite')
  songs.forEach(song => tx.store.put(song))
  await tx.done
}

export async function getSongs() {
  return db.getAll('songs')
}

export async function deleteSong(id) {
  const db = await openDB('music-app', 1)
  await db.delete('songs', id)
}