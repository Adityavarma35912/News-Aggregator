import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface UserRow {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [addUserLoading, setAddUserLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handlePromote = async (username: string) => {
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/promote', { username });
      setSuccess(`User '${username}' promoted to admin.`);
      fetchUsers();
    } catch {
      setError('Failed to promote user');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAddUserLoading(true);
    if (!newUsername || !newPassword) {
      setError('Username and password are required');
      setAddUserLoading(false);
      return;
    }
    try {
      await api.post('/auth/signup', { username: newUsername, password: newPassword });
      setSuccess(`User '${newUsername}' created successfully.`);
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setAddUserLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center text-white mt-8">Access denied. Admins only.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h2>
      <form onSubmit={handleAddUser} className="mb-8 flex flex-col md:flex-row gap-4 items-center bg-white/10 p-4 rounded-lg">
        <input
          type="text"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          placeholder="Username"
          className="px-4 py-2 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="New username"
          tabIndex={0}
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="Password"
          className="px-4 py-2 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="New password"
          tabIndex={0}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          aria-label="Add user"
          tabIndex={0}
          disabled={addUserLoading}
        >
          {addUserLoading ? 'Adding...' : 'Add User'}
        </button>
      </form>
      {loading && <div className="text-white">Loading users...</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {success && <div className="text-green-400 mb-4">{success}</div>}
      <table className="min-w-full bg-white/10 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-white">Username</th>
            <th className="px-4 py-2 text-left text-white">Role</th>
            <th className="px-4 py-2 text-left text-white">Created At</th>
            <th className="px-4 py-2 text-left text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-white/10">
              <td className="px-4 py-2 text-white">{u.username}</td>
              <td className="px-4 py-2 text-white">{u.role}</td>
              <td className="px-4 py-2 text-white">{new Date(u.created_at).toLocaleString()}</td>
              <td className="px-4 py-2">
                {u.role !== 'admin' && (
                  <button
                    onClick={() => handlePromote(u.username)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    aria-label={`Promote ${u.username} to admin`}
                    tabIndex={0}
                  >
                    Promote to Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 