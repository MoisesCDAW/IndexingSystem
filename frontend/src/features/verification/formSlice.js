import { createSlice } from '@reduxjs/toolkit';

export const formSlice = createSlice({
    name: 'form',
    initialState: {
        url: "",
        words: [],
        urlValid: null,
        wordsValid: null,
        isSubmitting: false,
        verificationResult: null,
        error: null
    },
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload;
            // validate URL (basic regex for http/https)
            const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
            state.urlValid = urlPattern.test(action.payload);
        },
        setWords: (state, action) => {
            state.words = action.payload;
            // validate words (non-empty strings)
            state.wordsValid = Array.isArray(action.payload) &&
                action.payload.length > 0 &&
                action.payload.every(word => word.trim() !== '');
        },
        startSubmitting: (state) => {
            state.isSubmitting = true;
            state.error = null;
            state.verificationResult = null;
        },
        verificationSuccess: (state, action) => {
            state.isSubmitting = false;
            state.verificationResult = action.payload;
        },
        verificationFailure: (state, action) => {
            state.isSubmitting = false;
            state.error = action.payload;
        },
        resetForm: (state) => {
            state.url = "";
            state.words = [];
            state.urlValid = null;
            state.wordsValid = null;
            state.verificationResult = null;
            state.error = null;
        }
    }
});

export const {
    setUrl,
    setWords,
    startSubmitting,
    verificationSuccess,
    verificationFailure,
    resetForm
} = formSlice.actions;

export default formSlice.reducer;