import { createSlice } from '@reduxjs/toolkit';

export const urlsSlice = createSlice({
    name: 'urls',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        searchTerm: '',
        sortBy: 'createdAt',
        sortDirection: 'desc'
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loadUrlsSuccess: (state, action) => {
            state.isLoading = false;
            state.items = action.payload.urls;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.currentPage || 1;
        },
        loadUrlsFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        addNewUrl: (state, action) => {
            state.items.unshift(action.payload);
        },
        removeUrl: (state, action) => {
            state.items = state.items.filter(url => url.id !== action.payload);
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
            state.currentPage = 1; // Reset to first page when changing page size
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.currentPage = 1; // Reset to first page when searching
        },
        setSorting: (state, action) => {
            state.sortBy = action.payload.sortBy;
            state.sortDirection = action.payload.direction;
        },
        clearUrlsList: (state) => {
            state.items = [];
        }
    }
});

export const {
    startLoading,
    loadUrlsSuccess,
    loadUrlsFailure,
    addNewUrl,
    removeUrl,
    setPage,
    setPageSize,
    setSearchTerm,
    setSorting,
    clearUrlsList
} = urlsSlice.actions;

export default urlsSlice.reducer;