import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HeaderComponent from '../../components/header/HeaderComponent';

// Wrapper for basic tests
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

// Wrapper to test specific routes
const renderWithPath = (ui, { route }) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>
    );
};

describe('HeaderComponent', () => {
    // 1. Basic rendering tests
    test('renders without crashing', () => {
        renderWithRouter(<HeaderComponent title="Test Title" />);
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    test('renders the title correctly', () => {
        renderWithRouter(<HeaderComponent title="IndexingSystem" />);
        expect(screen.getByText('IndexingSystem')).toBeInTheDocument();
    });

    // 2. Navigation tests
    test('renders all navigation links', () => {
        renderWithRouter(<HeaderComponent title="Test" />);
        expect(screen.getByText('Validation')).toBeInTheDocument();
        expect(screen.getByText('Collection')).toBeInTheDocument();
    });

    test('navigation links have correct href attributes', () => {
        renderWithRouter(<HeaderComponent title="Test" />);

        const validationLink = screen.getByText('Validation').closest('a');
        expect(validationLink).toHaveAttribute('href', '/');

        const collectionLink = screen.getByText('Collection').closest('a');
        expect(collectionLink).toHaveAttribute('href', '/urls');
    });

    // 3. Active link style tests
    test('applies active class to Validation link when on home route', () => {
        renderWithPath(<HeaderComponent title="Test" />, { route: '/' });

        const validationLink = screen.getByText('Validation').closest('a');
        expect(validationLink).toHaveClass('active-link');

        const collectionLink = screen.getByText('Collection').closest('a');
        expect(collectionLink).not.toHaveClass('active-link');
    });

    test('applies active class to Collection link when on urls route', () => {
        renderWithPath(<HeaderComponent title="Test" />, { route: '/urls' });

        const validationLink = screen.getByText('Validation').closest('a');
        expect(validationLink).not.toHaveClass('active-link');

        const collectionLink = screen.getByText('Collection').closest('a');
        expect(collectionLink).toHaveClass('active-link');
    });

    // 4. DOM structure tests
    test('renders the correct DOM structure', () => {
        renderWithRouter(<HeaderComponent title="Test" />);

        // Verify the container structure
        const container = document.querySelector('.header-container');
        expect(container).toBeInTheDocument();

        // Verify the internal content
        const content = document.querySelector('.header-content');
        expect(content).toBeInTheDocument();

        // Verify that the title is within the content
        const title = content.querySelector('.header-title');
        expect(title).toBeInTheDocument();

        // Verify the navigation
        const nav = content.querySelector('nav');
        expect(nav).toBeInTheDocument();

        // Verify the navigation list
        const list = nav.querySelector('.header-list');
        expect(list).toBeInTheDocument();

        // Verify that there are two list items
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).toBe(2);
    });

    // 5. Tests to handle special cases
    test('renders correctly with empty title', () => {
        renderWithRouter(<HeaderComponent title="" />);
        const title = document.querySelector('.header-title');
        expect(title.textContent).toBe('');
    });

    test('renders correctly with no title prop', () => {
        renderWithRouter(<HeaderComponent />);
        const title = document.querySelector('.header-title');
        expect(title.textContent).toBe('');
    });

    test('handles navigation with non-standard routes', () => {
        renderWithPath(<HeaderComponent title="Test" />, { route: '/nonexistent' });

        // No link should have the active-link class
        const validationLink = screen.getByText('Validation').closest('a');
        const collectionLink = screen.getByText('Collection').closest('a');

        expect(validationLink).not.toHaveClass('active-link');
        expect(collectionLink).not.toHaveClass('active-link');
    });

    // 6. Basic accessibility test
    test('navigation links are accessible with keyboard navigation', () => {
        renderWithRouter(<HeaderComponent title="Test" />);

        const validationLink = screen.getByText('Validation').closest('a');
        const collectionLink = screen.getByText('Collection').closest('a');

        expect(validationLink).toHaveAttribute('href');
        expect(collectionLink).toHaveAttribute('href');

        // Verify that the links can be focused
        validationLink.focus();
        expect(document.activeElement).toBe(validationLink);

        collectionLink.focus();
        expect(document.activeElement).toBe(collectionLink);
    });
});