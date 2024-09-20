// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Modules/BookPage/MainPage';
import LibraryPage from './Modules/LibraryPage/LibraryPage';
import RegisterPage from './Modules/Auth/RegisterPage';
import LoginPage from './Modules/Auth/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<MainPage />} />
        {/* Path parameter ':id' */}
        <Route path="/" element={<LibraryPage />} />
        {/* Query parameters handled in component */}
      </Routes>
    </Router>
  );
}

export default App;
