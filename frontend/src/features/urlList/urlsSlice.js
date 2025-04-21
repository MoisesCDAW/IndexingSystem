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
            state.urls = action.payload.urls;
            state.isLoading = false;
        },
        loadUrlsFailure: (state, action) => {
            state.error = action.payload.error;
            state.isLoading = false;
        },
        removeUrl: (state, action) => {
            state.urls = state.urls.filter(urlItem => {
                const urlValue = typeof urlItem === 'object' ? Object.values(urlItem)[0] : urlItem;
                return urlValue !== action.payload;
            });
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