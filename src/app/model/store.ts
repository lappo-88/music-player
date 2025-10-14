import {configureStore} from "@reduxjs/toolkit";
import {playlistsApi} from "@/features/playlists/api/playlistsApi.ts";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer:{
        [playlistsApi.reducerPath]:playlistsApi.reducer,
    },
    middleware:getDefaultMiddleware =>
        getDefaultMiddleware().concat(playlistsApi.middleware),
})
setupListeners(store.dispatch)