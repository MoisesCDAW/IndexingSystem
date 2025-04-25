import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showNotification } from './uiSlice';

export const fetchUrlsAsync = createAsyncThunk(
    'urls/fetchUrls',

    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/content');

            if (response.status === 200) {
                const extractUrls = (data) => {
                    const aux = Object.values(data)[0];
                    const urls = [];

                    // If it's an array, we process each element
                    if (Array.isArray(aux)) {
                        aux.forEach(item => {
                            if (item && typeof item === 'object') {
                                // If the object has a 'url' property, we extract it
                                if (item.url) {
                                    urls.push(item.url);
                                } else {
                                    throw new Error('The "url" property was not found in the object');
                                }
                            }
                        });
                    }

                    return urls;
                };

                const urls = extractUrls(response.data);
                return urls;
            }
            if (response.status === 204) {
                return [];
            }

        } catch (error) {
            let errorMessage = '';
            let notificationOptions = {
                visible: true,
                type: 'error',
                message: errorMessage,
                autoHide: false,
            };

            if (error.response) {

                // Tests were conducted, and a common mistake in development is starting the frontend without the server running.
                if (error.response.status === 404) {
                    errorMessage = 'The server may be down.';
                    notificationOptions = {
                        ...notificationOptions,
                        message: errorMessage,
                        autoHide: true,
                        duration: 5000,
                    };
                } else if (error.response.data) {
                    notificationOptions.message = Object.values(error.response.data)[0];
                }
            }

            dispatch(showNotification(notificationOptions));

            return rejectWithValue(errorMessage); // This will be the payload for 'rejected'
        }
    }
);

export const removeUrlAsync = createAsyncThunk(
    'urls/removeUrl',
    async (urlToRemove, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.delete('/api/v1/content', {
                data: { url: urlToRemove }
            });

            if (response.status === 200) {
                dispatch(removeUrl(urlToRemove));
                dispatch(showNotification({
                    visible: true,
                    type: 'success',
                    message: 'URL eliminada con éxito',
                    autoHide: true,
                    duration: 3000
                }));
            } else {
                throw new Error('Failed to remove URL');
            }
        } catch (error) {
            console.error('Error al eliminar URL:', error);
            dispatch(showNotification({
                visible: true,
                type: 'error',
                message: 'Error al eliminar la URL',
                autoHide: true,
                duration: 5000
            }));
            return rejectWithValue(error.message);
        }
    }
);

export const urlsSlice = createSlice({
    name: 'urls',
    initialState: {
        urls: [],
        status: null, // 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        restartState: (state) => {
            state.status = null;
        },
        removeUrl: (state, action) => {
            state.urls = state.urls.filter(urlItem => {
                const urlValue = typeof urlItem === 'object' ? Object.values(urlItem)[0] : urlItem;
                return urlValue !== action.payload;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUrlsAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUrlsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.urls = action.payload;
            })
            .addCase(fetchUrlsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { restartState, removeUrl } = urlsSlice.actions;

export const selectUrls = (state) => state.urls.urls;
export const selectUrlsStatus = (state) => state.urls.status;
export const selectUrlsError = (state) => state.urls.error;

export default urlsSlice.reducer;