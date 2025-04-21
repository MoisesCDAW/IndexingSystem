import { useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../store/utils/useStore';
import { showNotification } from '../../../shared/uiSlice';
import { startLoading, loadUrlsSuccess, loadUrlsFailure, selectUrls, selectUrlsLoading, removeUrl } from '../urlsSlice';
import './UrlsListStyle.css';

function UrlsList() {
    const dispatch = useAppDispatch();
    const urls = useAppSelector(selectUrls);
    const loading = useAppSelector(selectUrlsLoading);

    useEffect(() => {
        const fetchUrls = async () => {
            dispatch(startLoading());

            try {
                const response = await axios.get('/api/v1/content');

                if (response.status === 200) {
                    dispatch(loadUrlsSuccess({
                        urls: Object.values(response.data).map(url => Object.values(url)[0]),
                    }));

                }

                if (response.status === 204) {
                    dispatch(loadUrlsSuccess({ urls: [] }));
                }

            } catch (error) {
                dispatch(loadUrlsFailure({ error: Object.values(error.response.data)[0] }));
                dispatch(showNotification({
                    visible: true,
                    type: 'error',
                    message: Object.values(error.response.data)[0],
                    autoHide: true,
                    duration: 5000
                }));
            }

        };

        fetchUrls();
    }, [dispatch]);

    const handleRemoveUrl = async (urlToRemove) => {
        try {

            await axios.delete('/api/v1/content', {
                data: { url: urlToRemove }
            });

            dispatch(removeUrl(urlToRemove));

            dispatch(showNotification({
                visible: true,
                type: 'success',
                message: 'URL eliminada con éxito',
                autoHide: true,
                duration: 3000
            }));
        } catch (error) {

            console.error('Error al eliminar URL:', error);
            dispatch(showNotification({
                visible: true,
                type: 'error',
                message: 'Error al eliminar la URL',
                autoHide: true,
                duration: 5000
            }));
        }
    };

    if (loading) {
        return (
            <div className="url-list-container loading">
                <div className="loader"></div>
                <p>Cargando URLs...</p>
            </div>
        );
    }

    if (urls.length === 0) {
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
                    const url = Object.values(urlItem)[0];

                    return (
                        <div key={index} className="url-card">
                            <div className="url-content">
                                <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">
                                    {url.length > 50 ? `${url.substring(0, 47)}...` : url}
                                </a>
                                <span className="url-domain">{new URL(url).hostname}</span>
                            </div>
                            <div
                                className="delete-icon-container"
                                onClick={() => handleRemoveUrl(url)}
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