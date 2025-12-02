'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '@/components/AdminNavigation';

interface Topup {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  meta: Record<string, unknown>;
  created_at: string;
  profiles?: { full_name: string };
}

export default function AdminTopupsPage() {
  const [topups, setTopups] = useState<Topup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTopup, setEditingTopup] = useState<Topup | null>(null);
  const [formData, setFormData] = useState({ id: '', user_id: '', amount: '0', status: 'pending' });
  const [message, setMessage] = useState('');

  const fetchTopups = async () => {
    try {
      const response = await fetch('/api/admin/topups');
      const data = await response.json();
      if (response.ok && data.data) {
        setTopups(data.data);
      }
    } catch {
      console.error('Failed to fetch topups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const method = editingTopup ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/topups', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseInt(formData.amount),
        }),
      });

      if (response.ok) {
        setMessage(editingTopup ? 'Topup updated' : 'Topup created');
        fetchTopups();
        setEditingTopup(null);
        setFormData({ id: '', user_id: '', amount: '0', status: 'pending' });
      } else {
        const data = await response.json();
        setMessage(data.error || 'Operation failed');
      }
    } catch {
      setMessage('An error occurred');
    }
  };

  const handleEdit = (topup: Topup) => {
    setEditingTopup(topup);
    setFormData({
      id: topup.id,
      user_id: topup.user_id,
      amount: topup.amount.toString(),
      status: topup.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topup?')) return;

    try {
      const response = await fetch(`/api/admin/topups?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTopups();
      }
    } catch {
      console.error('Failed to delete topup');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Topups</h1>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8">
          <h2 className="text-lg font-medium text-zinc-100 mb-4">
            {editingTopup ? 'Edit Topup' : 'Create Topup'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingTopup && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">User ID</label>
                <input
                  type="text"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
              >
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                {editingTopup ? 'Update' : 'Create'}
              </button>
              {editingTopup && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTopup(null);
                    setFormData({ id: '', user_id: '', amount: '0', status: 'pending' });
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {topups.map((topup) => (
                  <tr key={topup.id}>
                    <td className="px-6 py-4 text-sm text-zinc-300 font-mono">{topup.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-zinc-100">{topup.profiles?.full_name || topup.user_id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-green-400">₦{topup.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        topup.status === 'success' ? 'bg-green-900 text-green-200' : 
                        topup.status === 'failed' ? 'bg-red-900 text-red-200' : 
                        'bg-zinc-700 text-zinc-300'
                      }`}>
                        {topup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{new Date(topup.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button onClick={() => handleEdit(topup)} className="text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(topup.id)} className="text-red-400 hover:underline">Delete</button>
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
