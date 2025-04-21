import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        notification: {
            visible: false,
            type: null, // 'success', 'error'
            message: '',
            autoHide: true,
            duration: 5000 // milliseconds
        },
    },
    reducers: {
        showNotification: (state, action) => {
            state.notification = {
                visible: action.payload.visible || true,
                type: action.payload.type,
                message: action.payload.message,
                autoHide: action.payload.autoHide,
                duration: action.payload.duration || 5000
            };
        },
        hideNotification: (state) => {
            state.notification.visible = false;
        },
    }
});

export const {
    showNotification,
    hideNotification,
} = uiSlice.actions;

export const selectNotification = (state) => state.ui.notification;

export default uiSlice.reducer;