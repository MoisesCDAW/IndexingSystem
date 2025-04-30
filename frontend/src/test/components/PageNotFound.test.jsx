import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageNotFound from '../../components/page_not_found/PageNotFound';

describe('PageNotFound', () => {
    // 1. Basic rendering tests
    test('renders without crashing', () => {
        render(<PageNotFound />);
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    test('renders "Page not found" text', () => {
        render(<PageNotFound />);
        expect(screen.getByText('Page not found')).toBeInTheDocument();
    });

    // 2. DOM structure tests
    test('renders the correct DOM structure', () => {
        const { container } = render(<PageNotFound />);

        // Verify main container
        const mainContainer = container.querySelector('.not-found-container');
        expect(mainContainer).toBeInTheDocument();

        // Verify internal content container
        const content = mainContainer.querySelector('.not-found-content');
        expect(content).toBeInTheDocument();

        // Verify title elements
        const title = content.querySelector('.not-found-title');
        expect(title).toBeInTheDocument();
        expect(title.tagName).toBe('H1');
        expect(title.textContent).toBe('404');

        // Verify subtitle elements
        const subtitle = content.querySelector('.not-found-subtitle');
        expect(subtitle).toBeInTheDocument();
        expect(subtitle.tagName).toBe('H2');
        expect(subtitle.textContent).toBe('Page not found');
    });

    // 3. Basic accessibility tests
    test('uses appropriate heading hierarchy', () => {
        render(<PageNotFound />);

        const headings = screen.getAllByRole('heading');
        expect(headings).toHaveLength(2);

        // Verify that the first heading is an h1
        expect(headings[0]).toHaveTextContent('404');
        expect(headings[0].tagName).toBe('H1');

        // Verify that the second heading is an h2
        expect(headings[1]).toHaveTextContent('Page not found');
        expect(headings[1].tagName).toBe('H2');
    });

    // 4. Specific visual element tests
    test('has the 404 text prominently displayed', () => {
        render(<PageNotFound />);

        const title = screen.getByText('404');
        expect(title).toHaveClass('not-found-title');
    });

    // 5. CSS class tests
    test('contains the correct CSS classes', () => {
        render(<PageNotFound />);

        expect(screen.getByText('404')).toHaveClass('not-found-title');
        expect(screen.getByText('Page not found')).toHaveClass('not-found-subtitle');

        const container = document.querySelector('.not-found-container');
        expect(container).toBeInTheDocument();

        const content = document.querySelector('.not-found-content');
        expect(content).toBeInTheDocument();
    });

    // 6. Exact content tests
    test('displays exactly "404" as the title', () => {
        render(<PageNotFound />);
        const title = screen.getByText('404');
        expect(title.textContent).toBe('404');
    });

    test('displays exactly "Page not found" as the subtitle', () => {
        render(<PageNotFound />);
        const subtitle = screen.getByText('Page not found');
        expect(subtitle.textContent).toBe('Page not found');
    });
});