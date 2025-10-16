import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,

} from "@/features/playlists/api/playlistsApi.ts";
import s from "./PlaylistsPage.module.css";
import {CreatePlaylistForm} from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx";
import type {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/api/playlistsApi.types.ts";
import { useForm} from "react-hook-form";
import {useState} from "react";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistItem/PlaylistItem.tsx";
import {EditPlaylistForm} from "@/features/playlists/ui/EditPlaylistForm/EditPlaylistForm.tsx";


export const PlaylistsPage = () => {


    const {data} = useFetchPlaylistsQuery()
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

    const [deletePlaylist] = useDeletePlaylistMutation()


    const deletePlaylistHandler = (playlistId:string)=> {
        if (confirm('Are you sure you want to delete the playlist?')) {
            deletePlaylist(playlistId)

        }
    }


    const editPlaylistHandler = (playlist:PlaylistData | null)=>{
        if(playlist){
            setPlaylistId(playlist.id)
            reset({
                title: playlist.attributes.title,
                description: playlist.attributes.description,
                tagId:playlist.attributes.tags.map(t=>t.id),
            })
        } else{
            setPlaylistId(null)
        }

    }




    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm />
            <div className={s.items}>
                {data?.data.map(playlist => {
                    const isEditing = playlistId === playlist.id



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
                              <PlaylistItem playlist={playlist} editPlaylistHandler={editPlaylistHandler} deletePlaylistHandler={deletePlaylistHandler}/>
                            }

                        </div>
                            )
                            })}
                        </div>
                </div>
                )
                }