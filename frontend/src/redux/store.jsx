import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formSlice';
import urlsReducer from './slices/urlsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        form: formReducer,
        urls: urlsReducer,
        ui: uiReducer,
    },
});