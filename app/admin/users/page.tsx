'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '@/components/AdminNavigation';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({ id: '', full_name: '', role: 'user' });
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok && data.data) {
        setUsers(data.data);
      }
    } catch {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const method = editingUser ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(editingUser ? 'User updated' : 'User created');
        fetchUsers();
        setEditingUser(null);
        setFormData({ id: '', full_name: '', role: 'user' });
      } else {
        const data = await response.json();
        setMessage(data.error || 'Operation failed');
      }
    } catch {
      setMessage('An error occurred');
    }
  };

  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setFormData({ id: user.id, full_name: user.full_name || '', role: user.role || 'user' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchUsers();
      }
    } catch {
      console.error('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Users</h1>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8">
          <h2 className="text-lg font-medium text-zinc-100 mb-4">
            {editingUser ? 'Edit User' : 'Create User'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">User ID (UUID)</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                {editingUser ? 'Update' : 'Create'}
              </button>
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setFormData({ id: '', full_name: '', role: 'user' });
                  }}
                  className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {message && <p className="mt-4 text-sm text-zinc-400">{message}</p>}
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Created</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm text-zinc-300 font-mono">{user.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-zinc-100">{user.full_name || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-900 text-red-200' : 'bg-zinc-700 text-zinc-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button onClick={() => handleEdit(user)} className="text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
