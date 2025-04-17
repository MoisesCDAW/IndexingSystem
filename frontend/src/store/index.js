import { configureStore } from '@reduxjs/toolkit';
import formReducer from '../features/verification/formSlice';
import urlsReducer from '../features/urlList/urlsSlice';
import uiReducer from '../shared/uiSlice';

export const store = configureStore({
    reducer: {
        form: formReducer,
        urls: urlsReducer,
        ui: uiReducer,
    },
});