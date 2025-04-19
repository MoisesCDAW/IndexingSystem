import { createSlice } from '@reduxjs/toolkit';

export const urlsSlice = createSlice({
    name: 'urls',
    initialState: {
        urls: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loadUrlsSuccess: (state, action) => {
            state.isLoading = false;
            state.urls = action.payload.urls;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.currentPage || 1;
        },
        loadUrlsFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        removeUrl: (state, action) => {
            state.urls = state.urls.filter(url => url.id !== action.payload);
        },
    }
});

export const {
    startLoading,
    loadUrlsSuccess,
    loadUrlsFailure,
    removeUrl,
} = urlsSlice.actions;

export const selectUrls = (state) => state.urls.urls;
export const selectUrlsLoading = (state) => state.urls.isLoading;
export const selectUrlsError = (state) => state.urls.error;

export default urlsSlice.reducer;