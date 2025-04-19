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
        theme: 'light', // 'light', 'dark'
        title: "",
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
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setTitle: (state, action) => {
            state.title = action.payload;
        }
    }
});

export const {
    setActiveTab,
    showNotification,
    hideNotification,
    setTheme,
    setTitle
} = uiSlice.actions;

export const selectActiveTab = (state) => state.ui.activeTab;
export const selectNotification = (state) => state.ui.notification;
export const selectTheme = (state) => state.ui.theme;
export const selectTitle = (state) => state.ui.title;

export default uiSlice.reducer;