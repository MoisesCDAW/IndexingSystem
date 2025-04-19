import { useAppDispatch, useAppSelector } from '../../../store/utils/useStore';
import { setUrl, setWords, selectUrlValid, selectWordsValid } from '../../verification/formSlice';
import { useState } from 'react';
import './FormStyle.css';

function FormComponent() {
    const dispatch = useAppDispatch();
    const urlValid = useAppSelector(selectUrlValid);
    const wordsValid = useAppSelector(selectWordsValid);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // For simulation purposes, we will wait for 600ms before resetting the form
        setTimeout(() => {
            setIsSubmitting(false);
            e.target.reset();
        }, 600);
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
