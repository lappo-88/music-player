import s from "./PlaylistsList.module.css";
import {EditPlaylistForm} from "@/features/playlists/ui/EditPlaylistForm/EditPlaylistForm.tsx";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistItem/PlaylistItem.tsx";
import {useState} from "react";
import {useForm} from "react-hook-form";
import type {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/api/playlistsApi.types.ts";
import {useDeletePlaylistMutation} from "@/features/playlists/api/playlistsApi.ts";


type Props = {
    playlists: PlaylistData[]
    isPlaylistsLoading: boolean
}


export const PlaylistsList=({isPlaylistsLoading,playlists}:Props)=>{

    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
    const [deletePlaylist] = useDeletePlaylistMutation()


    const deletePlaylistHandler = (playlistId:string)=> {
        if (confirm('Are you sure you want to delete the playlist?')) {
            deletePlaylist(playlistId)

        }
    }

    const editPlaylistHandler = (playlist:PlaylistData | null)=> {
        if (playlist) {
            setPlaylistId(playlist.id)
            reset({
                title: playlist.attributes.title,
                description: playlist.attributes.description,
                tagId: playlist.attributes.tags.map(t => t.id),
            })
        } else {
            setPlaylistId(null)
        }
    }

        return (

            <div className={s.items}>
                {!playlists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
                {playlists.map(playlist => {
                    const isEditing = playlist.id === playlistId

                    return (
                        <div className={s.item} key={playlist.id}>

                            {isEditing ?
                                <EditPlaylistForm
                                    playlistId={playlistId}
                                    handleSubmit={handleSubmit}
                                    register={register}
                                    editPlaylist={editPlaylistHandler}
                                    setPlaylistId={setPlaylistId}
                                />
                                :
                                <PlaylistItem playlist={playlist} deletePlaylistHandler={deletePlaylistHandler}
                                              editPlaylistHandler={editPlaylistHandler}/>
                            }

                        </div>
                    )
                })}
            </div>


        )
    }