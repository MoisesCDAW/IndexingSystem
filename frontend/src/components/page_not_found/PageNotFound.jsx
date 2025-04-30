import React from 'react';
import './PageNotFound.css';

const PageNotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page not found</h2>
            </div>
        </div>
    );
};

export default PageNotFound;