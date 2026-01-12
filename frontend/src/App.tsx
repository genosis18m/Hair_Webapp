import React from 'react';
import { SignedIn, SignedOut, SignUp, SignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PhotoPage from './pages/PhotoPage/PhotoPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import DarkModeToggle from './components/DarkModeToggle';

const App: React.FC = () => {
  return (
    <Router>
      {/* Floating Dark Mode Toggle - Top Right */}
      <DarkModeToggle />
      
      <Routes>
        {/* Home page */}
        <Route index element={<Home />} />
        
        {/* Login route */}
        <Route path="/login" element={
          <>
            <SignedIn>
              <Navigate to="/dashboard/analysis" replace />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <SignIn />
              </div>
            </SignedOut>
          </>
        } />
        
        {/* Signup route */}
        <Route path="/signup" element={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <SignUp />
          </div>
        } />
        
        {/* Dashboard and nested routes */}
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="analysis" replace />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="photo" element={<PhotoPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
