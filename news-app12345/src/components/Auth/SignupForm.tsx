import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PulseWireLogo } from './PulseWireLogo';
import { AuthBackground } from './AuthBackground';

interface SignupFormProps {
  onToggle: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await signup(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0">
      <AuthBackground />
      <main className="h-screen w-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
          <PulseWireLogo />
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Join PulseWire</h2>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
                aria-label="Confirm Password"
                tabIndex={0}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Sign Up"
              tabIndex={0}
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-white text-center">
            Already have an account?{' '}
            <button
              onClick={onToggle}
              className="text-blue-400 hover:text-blue-300"
              aria-label="Login"
              tabIndex={0}
            >
              Login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}; 