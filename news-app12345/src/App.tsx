import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { SavedArticles } from './components/Dashboard/SavedArticles';
import { NewsGrid } from './components/NewsGrid';
import { FaHome, FaBookmark, FaSignOutAlt } from 'react-icons/fa';
import { AdminDashboard } from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'saved' | 'admin'>('home');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black p-4">
        {showLogin ? (
          <LoginForm onToggle={() => setShowLogin(false)} />
        ) : (
          <SignupForm onToggle={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 w-full">
        <div className="w-full px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white">PulseWire</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'home'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <FaHome />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setCurrentPage('saved')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'saved'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <FaBookmark />
                  <span>Saved</span>
                </button>
                {user && user.role === 'admin' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    aria-label="Admin Dashboard"
                    tabIndex={0}
                  >
                    <span>Admin</span>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-8 py-8">
        {currentPage === 'home' && <NewsGrid />}
        {currentPage === 'saved' && <SavedArticles />}
        {currentPage === 'admin' && user && user.role === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 