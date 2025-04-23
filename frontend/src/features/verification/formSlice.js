import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { restartState } from '../urlList/urlsSlice';
import { showNotification } from '../../shared/uiSlice';


export const addUrlAsync = createAsyncThunk(
    'urls/addUrl',
    async (target, { dispatch, getState, rejectWithValue }) => {
        try {
            const state = getState();
            const url = selectUrl(state);
            const words = selectWords(state);
            const response = await axios.post('/api/v1/content/check', {
                url: url,
                words: words,
            });
            let notificationOptions = {
                visible: true,
                type: 'success',
                message: "",
                autoHide: true,
                duration: 3000,
            };

            if (response.status === 200 || response.status === 201) {
                notificationOptions.message = Object.values(response.data)[0];
                dispatch(showNotification(notificationOptions));
            } else {
                notificationOptions.message = 'Unexpected response status.';
                dispatch(showNotification(notificationOptions));
            }

            dispatch(restartState()); // Reset the URL list state
            dispatch(resetForm());
            target.reset(); // Reset the form

        } catch (error) {
            let errorMessage = 'Failed to add URL.';

            if (error.response) {
                errorMessage = Object.values(error.response.data)[0] || errorMessage;
            }

            dispatch(showNotification({
                visible: true,
                type: 'error',
                message: errorMessage,
                autoHide: true,
                duration: 5000,
            }));

            return rejectWithValue(error);
        }
    }
);


export const formSlice = createSlice({
    name: 'form',
    initialState: {
        url: "",
        words: [],
        urlValid: null,
        wordsValid: null,
        status: null, // 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
        setUrl: (state, action) => {
            // validate URL (basic regex for http/https)
            const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
            state.urlValid = urlPattern.test(action.payload);

            if (state.urlValid) {
                state.url = action.payload;
            }
        },
        setWords: (state, action) => {
            // validate words (non-empty strings and max 15 characters)
            state.wordsValid = Array.isArray(action.payload) &&
                action.payload.length > 0 &&
                action.payload.every(word =>
                    word.trim() !== '' && word.trim().length <= 15
                );

            if (state.wordsValid) {
                state.words = action.payload.map(word => word.trim());
            }
        },
        resetForm: (state) => {
            state.url = "";
            state.words = [];
            state.urlValid = null;
            state.wordsValid = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUrlAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addUrlAsync.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(addUrlAsync.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const {
    setUrl,
    setWords,
    resetForm
} = formSlice.actions;

export const selectUrl = (state) => state.form.url;
export const selectWords = (state) => state.form.words;
export const selectUrlValid = (state) => state.form.urlValid;
export const selectWordsValid = (state) => state.form.wordsValid;
export const selectFormStatus = (state) => state.form.status;

export default formSlice.reducer;