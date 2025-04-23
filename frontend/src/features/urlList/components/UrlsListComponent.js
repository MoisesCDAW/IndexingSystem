import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/utils/useStore';
import { selectUrls, selectUrlsStatus, fetchUrlsAsync, removeUrlAsync } from '../urlsSlice';
import './UrlsListStyle.css';

function UrlsList() {
    const dispatch = useAppDispatch();
    const urls = useAppSelector(selectUrls);
    const status = useAppSelector(selectUrlsStatus);

    useEffect(() => {
        if (!status) {
            dispatch(fetchUrlsAsync());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return (
            <div className="url-list-container loading">
                <div className="loader"></div>
                <p>Cargando URLs...</p>
            </div>
        );
    }

    if (urls.length === 0 && status === 'succeeded') {
        return (
            <div className="url-list-container empty">
                <p>No hay URLs disponibles</p>
            </div>
        );
    }

    // Renderizar la lista de URLs
    return (
        <div className="url-list-container">
            <div className="url-cards-grid">
                {urls.map((urlItem, index) => {

                    return (
                        <div key={index} className="url-card">
                            <div className="url-content">
                                <a href={urlItem} target="_blank" rel="noopener noreferrer" className="url-link">
                                    {urlItem.length > 50 ? `${urlItem.substring(0, 47)}...` : urlItem}
                                </a>
                                <span className="url-domain">{new URL(urlItem).hostname}</span>
                            </div>
                            <div
                                className="delete-icon-container"
                                onClick={() => dispatch(removeUrlAsync(urlItem))}
                                title="Eliminar URL"
                            >
                                <svg className="url-icon" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" fill='#fe6e6e'>
                                    <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z" />
                                    <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z" />
                                    <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z" />
                                </svg>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default UrlsList;