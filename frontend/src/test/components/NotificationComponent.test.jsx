import { render, screen, fireEvent, act } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import NotificationComponent from '../../components/notifications/NotificationComponent';

// Mock for redux-hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

// Mock for hideNotification action
jest.mock('../../redux/slices/uiSlice', () => ({
    selectNotification: jest.fn(),
    hideNotification: jest.fn()
}));

// Mock store configuration for tests that need it
const mockStore = configureStore([]);

describe('NotificationComponent', () => {
    // Common values for tests
    const mockDispatch = jest.fn();
    let mockUseSelector;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Default setup for mock dispatch
        require('react-redux').useDispatch.mockReturnValue(mockDispatch);

        // Re-import to be able to mock
        mockUseSelector = require('react-redux').useSelector;

        // Default mock for hideNotification action
        require('../../redux/slices/uiSlice').hideNotification.mockReturnValue({ type: 'ui/hideNotification' });
    });

    // 1. Rendering tests
    test('does not render when notification is not visible', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return { visible: false };
            }
            return null;
        });

        const { container } = render(<NotificationComponent />);
        expect(container.firstChild).toBeNull();
    });

    test('renders when notification is visible', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Test message',
                    type: 'info',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    // 2. Notification type tests
    test('renders with info type', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Info message',
                    type: 'info',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);
        expect(screen.getByText('Info message')).toBeInTheDocument();
        expect(document.querySelector('.notification-container')).toHaveClass('info');
    });

    test('renders with success type', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Success message',
                    type: 'success',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(document.querySelector('.notification-container')).toHaveClass('success');
    });

    test('renders with error type', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Error message',
                    type: 'error',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(document.querySelector('.notification-container')).toHaveClass('error');
    });

    test('renders with warning type', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Warning message',
                    type: 'warning',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);
        expect(screen.getByText('Warning message')).toBeInTheDocument();
        expect(document.querySelector('.notification-container')).toHaveClass('warning');
    });

    // 3. Closing tests
    test('closes notification when close button is clicked', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Close me',
                    type: 'info',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);

        // Verify that the close button is present
        const closeButton = screen.getByRole('button', { name: '×' });
        expect(closeButton).toBeInTheDocument();

        // Click the close button
        fireEvent.click(closeButton);

        // Verify that the hideNotification action has been dispatched
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'ui/hideNotification' });
    });

    // 4. autoHide tests
    test('auto-hides notification after duration', () => {
        jest.useFakeTimers();

        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Auto hide test',
                    type: 'info',
                    autoHide: true,
                    duration: 3000 // 3 seconds
                };
            }
            return null;
        });

        render(<NotificationComponent />);

        // Verify that the notification is rendered
        expect(screen.getByText('Auto hide test')).toBeInTheDocument();

        // Verify that hideNotification has not been dispatched yet
        expect(mockDispatch).not.toHaveBeenCalled();

        // Advance time by 3 seconds
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Verify that hideNotification has been dispatched
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'ui/hideNotification' });

        jest.useRealTimers();
    });

    test('does not auto-hide when autoHide is false', () => {
        jest.useFakeTimers();

        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Do not auto hide',
                    type: 'info',
                    autoHide: false,
                    duration: 3000 // 3 seconds
                };
            }
            return null;
        });

        render(<NotificationComponent />);

        // Verify that the notification is rendered
        expect(screen.getByText('Do not auto hide')).toBeInTheDocument();

        // Advance time by 5 seconds (more than duration)
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        // Verify that hideNotification has not been dispatched
        expect(mockDispatch).not.toHaveBeenCalled();

        jest.useRealTimers();
    });

    // 5. Tests with multiple renders
    test('clears timeout when component unmounts', () => {
        jest.useFakeTimers();
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Will unmount',
                    type: 'info',
                    autoHide: true,
                    duration: 3000
                };
            }
            return null;
        });

        const { unmount } = render(<NotificationComponent />);

        // Unmount the component
        unmount();

        // Verify that clearTimeout was called
        expect(clearTimeoutSpy).toHaveBeenCalled();

        clearTimeoutSpy.mockRestore();
        jest.useRealTimers();
    });

    test('resets timeout when notification changes', () => {
        jest.useFakeTimers();

        // First render with a notification
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'First notification',
                    type: 'info',
                    autoHide: true,
                    duration: 3000
                };
            }
            return null;
        });

        const { rerender } = render(<NotificationComponent />);

        // Advance 1500ms (half the time)
        act(() => {
            jest.advanceTimersByTime(1500);
        });

        // Verify that hideNotification has not been dispatched yet
        expect(mockDispatch).not.toHaveBeenCalled();

        // Change to a new notification
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'Second notification',
                    type: 'success',
                    autoHide: true,
                    duration: 3000
                };
            }
            return null;
        });

        // Re-render with the new notification
        rerender(<NotificationComponent />);

        // Advance the remaining 1500ms
        act(() => {
            jest.advanceTimersByTime(1500);
        });

        // Now hideNotification should have been dispatched
        expect(mockDispatch).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

    // 6. DOM structure tests
    test('renders with the correct DOM structure', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'DOM structure test',
                    type: 'info',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);

        // Verify the container structure
        const container = document.querySelector('.notification-container');
        expect(container).toBeInTheDocument();
        expect(container).toHaveClass('info');

        // Verify the content structure
        const content = container.querySelector('.notification-content');
        expect(content).toBeInTheDocument();

        // Verify the message
        const message = content.querySelector('.notification-message');
        expect(message).toBeInTheDocument();
        expect(message.textContent).toBe('DOM structure test');

        // Verify the close button
        const closeButton = content.querySelector('.notification-close');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton.textContent).toBe('×');
    });

    // 7. Tests with special cases
    test('handles empty message', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: '',
                    type: 'info',
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);

        // Verify that the empty message renders correctly
        const message = document.querySelector('.notification-message');
        expect(message).toBeInTheDocument();
        expect(message.textContent).toBe('');
    });

    test('handles missing type', () => {
        mockUseSelector.mockImplementation(selector => {
            if (selector === require('../../redux/slices/uiSlice').selectNotification) {
                return {
                    visible: true,
                    message: 'No type specified',
                    // Type not specified
                    autoHide: false
                };
            }
            return null;
        });

        render(<NotificationComponent />);

        // Verify that it renders without a type class
        const container = document.querySelector('.notification-container');
        expect(container).toBeInTheDocument();
        // Should not have any of the type classes
        expect(container).not.toHaveClass('info');
        expect(container).not.toHaveClass('success');
        expect(container).not.toHaveClass('error');
        expect(container).not.toHaveClass('warning');
    });
});