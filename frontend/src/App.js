import './App.css';
import { Routes, Route } from 'react-router-dom';
import HeaderComponent from './shared/components/HeaderComponent';
import FormComponent from './features/verification/components/FormComponent';
import ListURLs from './features/urlList/components/UrlsListComponent';
import NotificationComponent from './shared/components/NotificationComponent';

function App() {


  return (
    <>
      <HeaderComponent title="IndexSystem" />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FormComponent />} />
          <Route path="/urls" element={<ListURLs />} />
        </Routes>
      </main>
      <NotificationComponent />
    </>
  );
}

export default App;  
