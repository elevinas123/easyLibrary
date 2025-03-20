// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./Modules/BookPage/MainPage";
import LibraryPage from "./Modules/LibraryPage/LibraryPage";
import RegisterPage from "./Modules/Auth/RegisterPage";
import LoginPage from "./Modules/Auth/LoginPage";
import Dashboard from "./Modules/UserDataPage/Dashboard";
import CurrentlyReadingPage from "./Modules/ReadingPage/CurrentlyReadingPage";
import FavoritesPage from "./Modules/FavoritesPage/FavoritesPage";
import BookmarksPage from "./Modules/BookmarksPage/BookmarksPage";
import ReadingHistoryPage from "./Modules/HistoryPage/ReadingHistoryPage";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./ThemeProvider";
import { CollectionsPage, CollectionDetailPage } from './Modules/CollectionsPage';
import SettingsPage from "./Modules/SettingsPage/SettingsPage";
import ProfilePage from "./Modules/ProfilePage/ProfilePage";
import HomePage from "./Modules/HomePage/HomePage";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/book" element={<MainPage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/statistics" element={<Dashboard />} />
                    <Route path="/reading" element={<CurrentlyReadingPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                    <Route path="/history" element={<ReadingHistoryPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/collections/:id" element={<CollectionDetailPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
                <Toaster />
            </Router>
        </ThemeProvider>
    );
}

export default App;
