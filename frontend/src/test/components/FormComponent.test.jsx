import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormComponent from '../../components/form/FormComponent';
import * as reduxHooks from '../../hooks/useStore';
import * as formSlice from '../../redux/slices/formSlice';

// Mock the redux hooks
jest.mock('../../hooks/useStore', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

// Mock the form slice actions
jest.mock('../../redux/slices/formSlice', () => ({
    setUrl: jest.fn(),
    setWords: jest.fn(),
    selectUrlValid: jest.fn(),
    selectWordsValid: jest.fn(),
    selectFormStatus: jest.fn(),
    addUrlAsync: jest.fn()
}));

describe('FormComponent', () => {
    // Setup common test variables
    const mockDispatch = jest.fn();

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup default mock values
        reduxHooks.useAppDispatch.mockReturnValue(mockDispatch);
        reduxHooks.useAppSelector.mockImplementation((selector) => {
            if (selector === formSlice.selectUrlValid) return true;
            if (selector === formSlice.selectWordsValid) return true;
            if (selector === formSlice.selectFormStatus) return 'idle';
            return null;
        });

        formSlice.setUrl.mockReturnValue({ type: 'form/setUrl' });
        formSlice.setWords.mockReturnValue({ type: 'form/setWords' });
        formSlice.addUrlAsync.mockReturnValue({ type: 'form/addUrlAsync' });
    });

    test('renders form elements correctly', () => {
        render(<FormComponent />);

        // Check if all expected elements are rendered
        expect(screen.getByText('Enter a URL and keywords to verify')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('keyword1, keyword2, keyword3')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Verify Content' })).toBeInTheDocument();
    });

    test('updates URL input and dispatches setUrl action', () => {
        render(<FormComponent />);

        const urlInput = screen.getByPlaceholderText('https://example.com');
        fireEvent.change(urlInput, { target: { value: 'https://testsite.com' } });

        expect(formSlice.setUrl).toHaveBeenCalledWith('https://testsite.com');
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'form/setUrl' });
    });

    test('updates keywords input and dispatches setWords action', () => {
        render(<FormComponent />);

        const keywordsInput = screen.getByPlaceholderText('keyword1, keyword2, keyword3');
        fireEvent.change(keywordsInput, { target: { value: 'test,example,sample' } });

        expect(formSlice.setWords).toHaveBeenCalledWith(['test', 'example', 'sample']);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'form/setWords' });
    });

    test('submits form and dispatches addUrlAsync action', () => {
        render(<FormComponent />);

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        expect(formSlice.addUrlAsync).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'form/addUrlAsync' });
    });

    test('shows error message when URL is invalid', () => {
        // Override the default mock to return false for URL validation
        reduxHooks.useAppSelector.mockImplementation((selector) => {
            if (selector === formSlice.selectUrlValid) return false;
            if (selector === formSlice.selectWordsValid) return true;
            if (selector === formSlice.selectFormStatus) return 'idle';
            return null;
        });

        render(<FormComponent />);

        expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });

    test('shows error message when keywords are invalid', () => {
        // Override the default mock to return false for keywords validation
        reduxHooks.useAppSelector.mockImplementation((selector) => {
            if (selector === formSlice.selectUrlValid) return true;
            if (selector === formSlice.selectWordsValid) return false;
            if (selector === formSlice.selectFormStatus) return 'idle';
            return null;
        });

        render(<FormComponent />);

        expect(screen.getByText('Please enter valid keywords')).toBeInTheDocument();
    });

    test('disables submit button when form is invalid', () => {
        // Override the default mock to return false for form validation
        reduxHooks.useAppSelector.mockImplementation((selector) => {
            if (selector === formSlice.selectUrlValid) return false;
            if (selector === formSlice.selectWordsValid) return true;
            if (selector === formSlice.selectFormStatus) return 'idle';
            return null;
        });

        render(<FormComponent />);

        const submitButton = screen.getByRole('button', { name: 'Verify Content' });
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveClass('button-disabled');
    });

    test('shows loading state when status is loading', () => {
        // Override the default mock to return 'loading' for form status
        reduxHooks.useAppSelector.mockImplementation((selector) => {
            if (selector === formSlice.selectUrlValid) return true;
            if (selector === formSlice.selectWordsValid) return true;
            if (selector === formSlice.selectFormStatus) return 'loading';
            return null;
        });

        render(<FormComponent />);

        expect(screen.getByRole('button', { name: 'Processing...' })).toBeInTheDocument();
    });

    test('enables submit button when form is valid', () => {
        render(<FormComponent />);

        const submitButton = screen.getByRole('button', { name: 'Verify Content' });
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveClass('button-enabled');
    });
});