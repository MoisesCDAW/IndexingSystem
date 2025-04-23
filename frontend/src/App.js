import './App.css';
import { Routes, Route } from 'react-router-dom';
import HeaderComponent from './shared/components/header/HeaderComponent';
import FormComponent from './features/verification/components/FormComponent';
import ListURLs from './features/urlList/components/UrlsListComponent';
import NotificationComponent from './shared/components/notifications/NotificationComponent';
import NotFoundPage from './shared/components/page_not_found/PageNotFound';

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
