
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Annonces } from './pages/Annonces';
import { AnnonceDetails } from './pages/AnnonceDetails';
import { CreateAnnonce } from './pages/CreateAnnonce';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/annonces" element={<Annonces />} />
            <Route path="/annonces/:id" element={<AnnonceDetails />} />
            <Route 
            path="/creer_annonce" 
            element={
                <ProtectedRoute>
                <CreateAnnonce />
                </ProtectedRoute>
            } 
            />
            <Route 
            path="/profile" 
            element={
                <ProtectedRoute>
                <Profile />
                </ProtectedRoute>
            } 
            />
            <Route 
            path="/messages" 
            element={
                <ProtectedRoute>
                <Messages />
                </ProtectedRoute>
            } 
            />
        </Routes>
    )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
          <Navbar />
          <div className="flex-grow">
            <AppRoutes />
          </div>
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} ColocEtudiant. All rights reserved.
                </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;