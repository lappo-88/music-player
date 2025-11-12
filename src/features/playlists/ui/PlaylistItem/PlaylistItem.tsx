import type {PlaylistData} from "@/features/playlists/api/playlistsApi.types.ts";
import defaultCover from '@/assets/images/default-playlist-cover.png'
import s from './PlaylistItem.module.css'
import {useDeletePlaylistCoverMutation, useUploadPlaylistMutation} from "@/features/playlists/api/playlistsApi.ts";
import type {ChangeEvent} from "react";
type Props = {
    playlist: PlaylistData
    deletePlaylistHandler: (playlistId: string) => void
    editPlaylistHandler: (playlist: PlaylistData) => void
}


export const PlaylistItem = ({ playlist, deletePlaylistHandler, editPlaylistHandler }: Props) => {
   const[uploadPlaylistCover]=  useUploadPlaylistMutation()
    const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

    const originalCover = playlist.attributes.images.main.find(img => img.type ==="original" )
    const src = originalCover ? originalCover?.url : defaultCover

const uploadCoverHandler =(event:ChangeEvent<HTMLInputElement>)=>{
    const maxSize = 1024 * 1024 // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

const file = event.target.files?.length && event.target.files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, PNG or GIF images are allowed')
        return
    }
    if (file.size > maxSize) {
        alert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
        return
    }

    uploadPlaylistCover({ playlistId: playlist.id, file})
}

    const deleteCoverHandler = () => {deletePlaylistCover({ playlistId: playlist.id })
    }
    return (
        <div>
            <img src={src} alt="cover" width={'240px'} className={s.cover}/>
            <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadCoverHandler}/>
            {originalCover && <button onClick={deleteCoverHandler}>delete</button>}

            <div>title: {playlist.attributes.title}</div>
            <div>description: {playlist.attributes.description}</div>
            <div>userName: {playlist.attributes.user.name}</div>
            <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
            <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
            <button onClick={() => editPlaylistHandler(playlist)}>update</button>
        </div>
    )
}