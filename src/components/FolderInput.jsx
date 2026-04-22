import React from 'react'
import { saveSongs } from '../data/songDatabase'
import '../styles/folder.css'

const SUPPORTED_AUDIO_EXTENSIONS = new Set([
    'mp3',
    'wav',
    'm4a',
    'aac',
    'ogg',
    'flac',
])

function inferAudioType(file) {
    if (file.type?.startsWith('audio/')) return file.type

    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
        case 'wav':
            return 'audio/wav'
        case 'm4a':
            return 'audio/mp4'
        case 'aac':
            return 'audio/aac'
        case 'ogg':
            return 'audio/ogg'
        case 'flac':
            return 'audio/flac'
        case 'mp3':
        default:
            return 'audio/mpeg'
    }
}

function FolderInput({ onSongsLoaded }) {
    async function handleFiles(e) {
        const files = Array.from(e.target.files ?? [])
        console.log('[import] file picker changed', {
            count: files.length,
            files: files.map(file => ({
                name: file.name,
                type: file.type || '(missing)',
                size: file.size,
            })),
        })

        const supportedFiles = files.filter(file => {
            const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
            return file.type.startsWith('audio/') || SUPPORTED_AUDIO_EXTENSIONS.has(extension)
        })

        if (supportedFiles.length !== files.length) {
            console.warn('[import] skipped unsupported files', {
                skipped: files
                    .filter(file => !supportedFiles.includes(file))
                    .map(file => file.name),
            })
        }

        if (supportedFiles.length === 0) {
            console.warn('[import] no supported audio files found in selection')
            e.target.value = ''
            return
        }

        try {
            const newSongs = await Promise.all(supportedFiles.map(async (file) => {
                const buffer = await file.arrayBuffer()
                const type = inferAudioType(file)

                return {
                    id: crypto.randomUUID(),
                    title: file.name.replace(/\.[^.]+$/, ''),
                    file: buffer,
                    type,
                }
            }))

            console.log('[import] normalized songs', {
                count: newSongs.length,
                songs: newSongs.map(song => ({
                    id: song.id,
                    title: song.title,
                    type: song.type,
                    bytes: song.file.byteLength,
                })),
            })

            await saveSongs(newSongs)
            console.log('[import] saved songs to IndexedDB', { count: newSongs.length })

            onSongsLoaded(newSongs)
            console.log('[import] pushed songs into app state', { count: newSongs.length })
        } catch (error) {
            console.error('[import] failed to import songs', error)
        } finally {
            e.target.value = ''
        }
    }

    return (
        <div className='container'>
            <div className='container'>
                <label className="importBtn">
                    Import Folder
                    <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                        webkitdirectory="true"
                        multiple
                        onChange={handleFiles}
                    />
                </label>

                <label className="importBtn">
                    Import Files
                    <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                        multiple
                        onChange={handleFiles}
                    />
                </label>
            </div>
        </div>
    )
}

export default FolderInput
