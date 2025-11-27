
import type {
    CreatePlaylistArgs, FetchPlaylistsArgs, PlaylistCreatedEvent,
    PlaylistsResponse, UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types.ts";
import {baseApi} from "@/app/api/baseApi.ts";
import type {Images} from "@/common/types";
import {playlistCreateResponseSchema, playlistsResponseSchema} from "@/features/playlists/model/playlists.schemas.ts";
import {imagesSchema} from "@/common/schemas"
import {withZodCatch} from "@/common/utils";
import {SOCKET_EVENTS} from "@/common/constants";
import {SubscribeToEvent} from "@/common/socket";


export const playlistsApi = baseApi.injectEndpoints({
        endpoints: (build) => ({
        fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs >({
            query: (params) => ({url:`playlists`,params}),
            ...withZodCatch(playlistsResponseSchema),
            keepUnusedDataFor: 0,
          onCacheEntryAdded:async (_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) =>{
              await cacheDataLoaded


              const unsubscribe =  SubscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg: PlaylistCreatedEvent) => {
                  const newPlaylist = msg.payload.data
                  updateCachedData(state => {
                      state.data.pop()
                      state.data.unshift(newPlaylist)
                      state.meta.totalCount = state.meta.totalCount + 1
                      state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
                  })
              })

              await cacheEntryRemoved
              unsubscribe()

       },
            providesTags: ['Playlist'],
        }),
        createPlaylist: build.mutation({
            query: (body:CreatePlaylistArgs) => ({method: "post", url: "playlists", body}),
            ...withZodCatch(playlistCreateResponseSchema),
            invalidatesTags: ['Playlist'],
        }),
            deletePlaylist: build.mutation<void, string >({
                query: (playlistId) => ({method: 'delete',url: `playlists/${playlistId}`}),
                invalidatesTags: ['Playlist'],
        }),
        updatePlaylist: build.mutation<void, {playlistId:string, body:UpdatePlaylistArgs} >({
            query: ({playlistId, body}) => ({method: 'put',url: `playlists/${playlistId}`,body}),

           onQueryStarted: async ({playlistId,body}, {queryFulfilled, dispatch,getState})=> {
               const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')
               const patchCollections: any[] =[]
               args.forEach((arg) =>{
                   patchCollections.push(  dispatch(
                           playlistsApi.util.updateQueryData(
                               'fetchPlaylists',
                               { pageNumber: arg.pageNumber, pageSize: arg.pageSize, search:arg.search},
                               state => {
                                   const index = state.data.findIndex(playlist => playlist.id === playlistId)
                                   if (index !== -1) {
                                       state.data[index].attributes = { ...state.data[index].attributes, ...body }
                                   }
                               }
                           )
                       )
                   )
               })

               try {
                   await queryFulfilled
               } catch {
                   patchCollections.forEach(patchCollection => {
                       patchCollection.undo()
                   })
               }
                },
            invalidatesTags: ['Playlist'],
        }),
        uploadPlaylistCover: build.mutation<Images,{playlistId: string; file:File} >({
            query: ({playlistId, file}) => {

                const formData = new FormData()
                formData.append("file", file)
                return ({method: 'post', url: `playlists/${playlistId}/images/main`, body:{formData}})
            },
            ...withZodCatch(imagesSchema),
            invalidatesTags: ['Playlist'],
        }),
        deletePlaylistCover: build.mutation<void, { playlistId: string }>({
            query: ({ playlistId }) => ({ url: `playlists/${playlistId}/images/main`, method: 'delete' }),
            invalidatesTags: ['Playlist'],
        }),
    })
})


export const {useFetchPlaylistsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistCoverMutation,
    useUploadPlaylistCoverMutation
} = playlistsApi