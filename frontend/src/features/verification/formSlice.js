import { createSlice } from '@reduxjs/toolkit';

export const formSlice = createSlice({
    name: 'form',
    initialState: {
        url: "",
        words: [],
        urlValid: null,
        wordsValid: null,
        isSubmitting: false,
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
            // validate words (non-empty strings and max 15 characters)
            state.wordsValid = Array.isArray(action.payload) &&
                action.payload.length > 0 &&
                action.payload.every(word =>
                    word.trim() !== '' && word.trim().length <= 15
                );
        },
        startSubmitting: (state) => {
            state.isSubmitting = true;
            state.error = null;
            state.verificationResult = null;
        },
        resetForm: (state) => {
            state.url = "";
            state.words = [];
            state.urlValid = null;
            state.wordsValid = null;
        }
    }
});

export const {
    setUrl,
    setWords,
    startSubmitting,
    resetForm
} = formSlice.actions;

export const selectUrl = (state) => state.form.url;
export const selectWords = (state) => state.form.words;
export const selectUrlValid = (state) => state.form.urlValid;
export const selectWordsValid = (state) => state.form.wordsValid;

export default formSlice.reducer;