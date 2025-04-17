import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        activeTab: 'verification', // Options: 'verification', 'urlList'
        notification: {
            visible: false,
            type: null, // 'success', 'error', 'warning', 'info'
            message: '',
            autoHide: true,
            duration: 5000 // milliseconds
        },
        isDrawerOpen: false,
        isMobileView: false,
        theme: 'light' // 'light', 'dark'
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        showNotification: (state, action) => {
            state.notification = {
                ...state.notification,
                visible: true,
                type: action.payload.type || 'info',
                message: action.payload.message,
                autoHide: action.payload.autoHide !== undefined ? action.payload.autoHide : true,
                duration: action.payload.duration || 5000
            };
        },
        hideNotification: (state) => {
            state.notification.visible = false;
        },
        toggleDrawer: (state) => {
            state.isDrawerOpen = !state.isDrawerOpen;
        },
        setDrawerState: (state, action) => {
            state.isDrawerOpen = action.payload;
        },
        setMobileView: (state, action) => {
            state.isMobileView = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        }
    }
});

export const {
    setActiveTab,
    showNotification,
    hideNotification,
    toggleDrawer,
    setDrawerState,
    setMobileView,
    toggleTheme,
    setTheme
} = uiSlice.actions;

export const selectActiveTab = (state) => state.ui.activeTab;
export const selectNotification = (state) => state.ui.notification;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;