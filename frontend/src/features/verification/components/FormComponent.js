import { useAppDispatch, useAppSelector } from '../../../store/utils/useStore';
import { setUrl, setWords, selectUrl, selectWords, selectUrlValid, selectWordsValid, resetForm } from '../../verification/formSlice';
import { showNotification } from '../../../shared/uiSlice';
import { useState } from 'react';
import './FormStyle.css';
import axios from 'axios';

function FormComponent() {
    const dispatch = useAppDispatch();
    const url = useAppSelector(selectUrl);
    const words = useAppSelector(selectWords);
    const urlValid = useAppSelector(selectUrlValid);
    const wordsValid = useAppSelector(selectWordsValid);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (urlValid && wordsValid) {
            try {
                const response = await axios.post('/api/v1/content/check', {
                    url: url,
                    words: words,
                });

                dispatch(showNotification({
                    visible: true,
                    type: 'success',
                    message: Object.values(response.data)[0],
                    autoHide: true,
                    duration: 5000
                }));

                if (response.status === 201) {
                    dispatch(resetForm());
                    e.target.reset();
                }

            } catch (error) {

                dispatch(showNotification({
                    visible: true,
                    type: 'error',
                    message: Object.values(error.response.data)[0],
                    autoHide: false,
                    duration: 5000
                }));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="verification-container">
            <header className="verification-header">
                <p className="verification-description">Enter a URL and keywords to verify</p>
            </header>

            <form onSubmit={handleSubmit} className="verification-form">
                <div className="form-group">
                    <label className="form-label">Website URL</label>
                    <input
                        type="text"
                        onChange={(e) => dispatch(setUrl(e.target.value))}
                        placeholder="https://example.com"
                        className="form-input"
                    />
                    {urlValid === false && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <span>Please enter a valid URL</span>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Keywords</label>
                    <input
                        type="text"
                        placeholder="keyword1, keyword2, keyword3"
                        onChange={(e) => dispatch(setWords(e.target.value.split(',')))}
                        className="form-input"
                    />
                    {wordsValid === false && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <span>Please enter valid keywords</span>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!urlValid || !wordsValid || isSubmitting}
                    className={`submit-button ${(!urlValid || !wordsValid) ? 'button-disabled' : 'button-enabled'}`}
                >
                    {isSubmitting ? 'Processing...' : 'Verify Content'}
                </button>
            </form>
        </div>
    );
}

export default FormComponent;
