import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import TutorDetailView from './pages/TutorDetail/TutorDetailView';
import HomeView from './pages/Home/HomeView';
import SavedTutorsView from './pages/SavedTutors/SavedTutorsView';
import AuthView from './pages/Auth/AuthView';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/saved-tutors" element={<SavedTutorsView />} />
              <Route path="/saved" element={<SavedTutorsView />} />
              <Route path="/tutor/:id" element={<TutorDetailView />} />
              <Route path="/auth" element={<AuthView />} />
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;