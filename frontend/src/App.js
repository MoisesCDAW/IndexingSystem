import './App.css';
import { Routes, Route } from 'react-router-dom';
import HeaderComponent from './shared/components/HeaderComponent';
import FormComponent from './features/verification/components/FormComponent';
import ListURLs from './features/urlList/components/UrlsListComponent';

function App() {

  const urls = [
    "https://example.com/api/user/123",
    "https://randomsite.io/images/cat42.jpg",
    "https://myapp.dev/posts/hello-world",
    "https://api.fakejson.com/data?id=9876",
    "https://cooldomain.net/assets/video.mp4"
  ];

  return (
    <>
      <HeaderComponent title="IndexSystem" />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FormComponent />} />
          <Route path="/urls" element={<ListURLs urls={urls} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;  
