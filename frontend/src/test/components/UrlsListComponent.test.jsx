import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UrlsList from '../../components/urlsList/UrlsListComponent';
import * as reduxHooks from '../../hooks/useStore';
import * as urlsSlice from '../../redux/slices/urlsSlice';

// Mock Redux hooks
jest.mock('../../hooks/useStore', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

// Mock slice actions
jest.mock('../../redux/slices/urlsSlice', () => ({
    selectUrls: jest.fn(),
    selectUrlsStatus: jest.fn(),
    fetchUrlsAsync: jest.fn(),
    removeUrlAsync: jest.fn()
}));

describe('UrlsList Component', () => {
    // Common variables for tests
    const mockDispatch = jest.fn();
    const mockFetchAction = { type: 'urls/fetchUrlsAsync' };
    const mockRemoveAction = { type: 'urls/removeUrlAsync' };

    // Mock URL to avoid errors
    global.URL = jest.fn().mockImplementation((url) => ({
        hostname: url.replace('https://', '').replace('http://', '').split('/')[0]
    }));

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Set up default mocks
        reduxHooks.useAppDispatch.mockReturnValue(mockDispatch);
        urlsSlice.fetchUrlsAsync.mockReturnValue(mockFetchAction);
        urlsSlice.removeUrlAsync.mockReturnValue(mockRemoveAction);
    });

    // 1. Loading state tests
    test('renders loading state when status is "loading"', () => {
        // Set up Redux selectors for loading state
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'loading';
            if (selector === urlsSlice.selectUrls) return [];
            return null;
        });

        render(<UrlsList />);

        // Verify loading elements
        expect(screen.getByText('Cargando URLs...')).toBeInTheDocument();
        expect(document.querySelector('.loader')).toBeInTheDocument();
        expect(document.querySelector('.url-list-container')).toHaveClass('loading');
    });

    // 2. Empty list tests
    test('renders message when no URLs and status is "succeeded"', () => {
        // Set up Redux selectors for empty list
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'succeeded';
            if (selector === urlsSlice.selectUrls) return [];
            return null;
        });

        render(<UrlsList />);

        // Verify empty list message
        expect(screen.getByText('No hay URLs disponibles')).toBeInTheDocument();
        expect(document.querySelector('.url-list-container')).toHaveClass('empty');
    });

    // 3. List with URLs tests
    test('renders the list of URLs correctly', () => {
        const mockUrls = [
            'https://example.com/page1',
            'https://test.com/page2',
            'https://longdomain.com/very/long/path/that/should/be/truncated'
        ];

        // Set up Redux selectors for list with URLs
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'succeeded';
            if (selector === urlsSlice.selectUrls) return mockUrls;
            return null;
        });

        render(<UrlsList />);

        // Verify that all URLs are rendered
        expect(document.querySelectorAll('.url-card')).toHaveLength(3);

        // Verify content of the first URL
        expect(screen.getByText('https://example.com/page1')).toBeInTheDocument();
        expect(screen.getByText('example.com')).toBeInTheDocument();

        // Verify content of the second URL
        expect(screen.getByText('https://test.com/page2')).toBeInTheDocument();
        expect(screen.getByText('test.com')).toBeInTheDocument();
    });

    // 4. Delete functionality tests
    test('calls removeUrlAsync when delete icon is clicked', () => {
        const mockUrls = ['https://example.com/page1'];

        // Set up Redux selectors
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'succeeded';
            if (selector === urlsSlice.selectUrls) return mockUrls;
            return null;
        });

        render(<UrlsList />);

        // Find and click the delete icon
        const deleteIcon = document.querySelector('.delete-icon-container');
        fireEvent.click(deleteIcon);

        // Verify that dispatch was called with removeUrlAsync
        expect(mockDispatch).toHaveBeenCalledWith(mockRemoveAction);
        expect(urlsSlice.removeUrlAsync).toHaveBeenCalledWith('https://example.com/page1');
    });

    // 5. useEffect hook tests
    test('calls fetchUrlsAsync when status is falsy', () => {
        // Set up Redux selectors for initial state
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return null; // falsy value
            if (selector === urlsSlice.selectUrls) return [];
            return null;
        });

        render(<UrlsList />);

        // Verify that dispatch was called with fetchUrlsAsync
        expect(mockDispatch).toHaveBeenCalledWith(mockFetchAction);
        expect(urlsSlice.fetchUrlsAsync).toHaveBeenCalled();
    });

    test('does not call fetchUrlsAsync when status already has a value', () => {
        // Set up Redux selectors for already loaded state
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'succeeded';
            if (selector === urlsSlice.selectUrls) return [];
            return null;
        });

        render(<UrlsList />);

        // Verify that fetchUrlsAsync was not called
        expect(urlsSlice.fetchUrlsAsync).not.toHaveBeenCalled();
    });

    // 6. DOM structure tests
    test('renders the correct DOM structure for URLs', () => {
        const mockUrls = ['https://example.com/page1'];

        // Set up Redux selectors
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'succeeded';
            if (selector === urlsSlice.selectUrls) return mockUrls;
            return null;
        });

        render(<UrlsList />);

        // Verify main container structure
        const container = document.querySelector('.url-list-container');
        expect(container).toBeInTheDocument();

        // Verify grid structure
        const grid = document.querySelector('.url-cards-grid');
        expect(grid).toBeInTheDocument();

        // Verify card structure
        const card = document.querySelector('.url-card');
        expect(card).toBeInTheDocument();

        // Verify content structure
        const content = document.querySelector('.url-content');
        expect(content).toBeInTheDocument();

        // Verify link structure
        const link = document.querySelector('.url-link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://example.com/page1');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');

        // Verify domain structure
        const domain = document.querySelector('.url-domain');
        expect(domain).toBeInTheDocument();
        expect(domain.textContent).toBe('example.com');

        // Verify delete icon structure
        const deleteIcon = document.querySelector('.delete-icon-container');
        expect(deleteIcon).toBeInTheDocument();
        expect(deleteIcon).toHaveAttribute('title', 'Eliminar URL');

        // Verify SVG inside delete icon
        const svg = document.querySelector('.url-icon');
        expect(svg).toBeInTheDocument();
    });

    // 7. Link behavior tests
    test('links have the correct attributes', () => {
        const mockUrls = ['https://example.com/page1'];

        // Set up Redux selectors
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'succeeded';
            if (selector === urlsSlice.selectUrls) return mockUrls;
            return null;
        });

        render(<UrlsList />);

        // Verify link attributes
        const link = screen.getByText('https://example.com/page1');
        expect(link).toHaveAttribute('href', 'https://example.com/page1');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    // 8. Special URL handling tests
    test('correctly handles URLs without protocol', () => {
        // Mock URL to force a specific hostname
        global.URL.mockImplementationOnce(() => ({
            hostname: 'example.com'
        }));

        const mockUrls = ['example.com/no-protocol'];

        // Set up Redux selectors
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'succeeded';
            if (selector === urlsSlice.selectUrls) return mockUrls;
            return null;
        });

        render(<UrlsList />);

        // Verify that the URL and domain are displayed
        expect(screen.getByText('example.com/no-protocol')).toBeInTheDocument();
        expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    // 10. Behavior with error test
    test('calls fetchUrlsAsync even after an error', () => {
        // First render with error
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return 'failed';
            if (selector === urlsSlice.selectUrls) return [];
            return null;
        });

        const { rerender } = render(<UrlsList />);

        // Should not call fetch because status is not falsy
        expect(urlsSlice.fetchUrlsAsync).not.toHaveBeenCalled();

        // Reset dispatch for the next test
        mockDispatch.mockClear();

        // Change to initial state (falsy)
        reduxHooks.useAppSelector.mockImplementation(selector => {
            if (selector === urlsSlice.selectUrlsStatus) return null;
            if (selector === urlsSlice.selectUrls) return [];
            return null;
        });

        // Re-render with the new state
        rerender(<UrlsList />);

        // Now it should call fetchUrlsAsync
        expect(mockDispatch).toHaveBeenCalledWith(mockFetchAction);
        expect(urlsSlice.fetchUrlsAsync).toHaveBeenCalled();
    });
});