import { Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/header/HeaderComponent';
import FormComponent from './components/form/FormComponent';
import ListURLs from './components/urlsList/UrlsListComponent';
import NotificationComponent from './components/notifications/NotificationComponent';
import NotFoundPage from './components/page_not_found/PageNotFound';

function App() {


    return (
        <>
            <HeaderComponent title="IndexingSystem" />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<FormComponent />} />
                    <Route path="/urls" element={<ListURLs />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <NotificationComponent />
        </>
    );
}

export default App;
