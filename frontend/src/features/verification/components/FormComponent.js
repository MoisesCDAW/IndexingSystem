import { useAppDispatch, useAppSelector } from '../../../store/utils/useStore';
import { setUrl, setWords } from '../../verification/formSlice';

function FormComponent() {
    const dispatch = useAppDispatch();
    const { urlValid, wordsValid } = useAppSelector(state => state.form);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
    };

    return (
        <div className="App">
            <header>
                <h1
                    style={{
                        fontSize: '24px',
                        marginBottom: '20px',
                        fontStyle: 'italic',
                    }}>
                    URLs Verification</h1>
                <p>Enter a URL and a list of words to verify.</p>
            </header>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        onChange={(e) => dispatch(setUrl(e.target.value))}
                        placeholder="Enter the URL"
                        style={{ width: '400px', marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {urlValid === false && (
                        <div className="error-message"
                            style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            Please enter a valid URL</div>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Enter the words (separated by commas)"
                        onChange={(e) => dispatch(setWords(e.target.value.split(',')))}
                        style={{ width: '400px', marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {wordsValid === false && (
                        <div className="error-message"
                            style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            Please enter valid words</div>
                    )}
                </div>

                <button type="submit" disabled={!urlValid || !wordsValid}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: (!urlValid || !wordsValid) ? '#8FC4FF' : '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (!urlValid || !wordsValid) ? 'not-allowed' : 'pointer'
                    }}>
                    Validate
                </button>
            </form>
        </div>
    );
}

export default FormComponent;  
