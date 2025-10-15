import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {
    CreatePlaylistArgs,
    PlaylistData,
    PlaylistsResponse
} from "@/features/playlists/api/playlistsApi.types.ts";


export const playlistsApi = createApi({
    reducerPath: 'playlistsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            'API-KEY': import.meta.env.VITE_API_KEY,
        },
        prepareHeaders: headers => {
            headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
            return headers
        },
    }),
    endpoints: (build) => ({
        fetchPlaylists: build.query<PlaylistsResponse,  void >({
            query: () => "playlists"
                // return {
                //     method: 'get',
                //     url: `playlists`,
                // }

        }),
        createPlaylist: build.mutation<{ data:PlaylistData }, CreatePlaylistArgs >({
            query: (body) => ({method: "post", url: "playlists", body})

        }),
            deletePlaylist: build.mutation<void, string >({
                query: (playlistId) => ({method: 'delete',url: `playlists/${playlistId}`})

        })
    })
})


export const {useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation } = playlistsApi