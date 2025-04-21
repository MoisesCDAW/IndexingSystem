import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotification, hideNotification } from '../uiSlice';
import './NotificationStyle.css';

const NotificationComponent = () => {
    const notification = useSelector(selectNotification);
    const dispatch = useDispatch();

    useEffect(() => {
        let timer;

        if (notification.visible && notification.autoHide) {
            timer = setTimeout(() => {
                dispatch(hideNotification());
            }, notification.duration);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [notification.visible, notification.autoHide, notification.duration, dispatch]);

    const handleClose = () => {
        dispatch(hideNotification());
    };

    if (!notification.visible) return null;

    return (
        <div className={`notification-container ${notification.type}`}>
            <div className="notification-content">
                <span className="notification-message">{notification.message}</span>
                <button className="notification-close" onClick={handleClose}>
                    ×
                </button>
            </div>
        </div>
    );
};

export default NotificationComponent;