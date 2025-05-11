import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PulseWireLogo } from './PulseWireLogo';
import { AuthBackground } from './AuthBackground';

interface LoginFormProps {
  onToggle: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center">
      <AuthBackground />
      <div className="px-28 h-full flex flex-col items-center justify-center p-4">
        <div className="w-full p-8 bg-black/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center justify-center">
          <PulseWireLogo />
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
            <div>
              <label htmlFor="username" className="block text-white mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
                aria-label="Username"
                tabIndex={0}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
                aria-label="Password"
                tabIndex={0}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Login"
              tabIndex={0}
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-white text-center">
            Don't have an account?{' '}
            <button
              onClick={onToggle}
              className="text-blue-400 hover:text-blue-300"
              aria-label="Sign up"
              tabIndex={0}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}; 