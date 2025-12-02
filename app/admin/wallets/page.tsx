'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '@/components/AdminNavigation';

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  profiles?: { full_name: string };
}

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({ id: '', user_id: '', balance: '0', currency: 'NGN' });
  const [message, setMessage] = useState('');

  const fetchWallets = async () => {
    try {
      const response = await fetch('/api/admin/wallets');
      const data = await response.json();
      if (response.ok && data.data) {
        setWallets(data.data);
      }
    } catch {
      console.error('Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const method = editingWallet ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/wallets', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          balance: parseInt(formData.balance),
        }),
      });

      if (response.ok) {
        setMessage(editingWallet ? 'Wallet updated' : 'Wallet created');
        fetchWallets();
        setEditingWallet(null);
        setFormData({ id: '', user_id: '', balance: '0', currency: 'NGN' });
      } else {
        const data = await response.json();
        setMessage(data.error || 'Operation failed');
      }
    } catch {
      setMessage('An error occurred');
    }
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      id: wallet.id,
      user_id: wallet.user_id,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return;

    try {
      const response = await fetch(`/api/admin/wallets?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchWallets();
      }
    } catch {
      console.error('Failed to delete wallet');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Wallets</h1>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8">
          <h2 className="text-lg font-medium text-zinc-100 mb-4">
            {editingWallet ? 'Edit Wallet' : 'Create Wallet'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingWallet && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">User ID (UUID)</label>
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
              <label className="block text-sm font-medium text-zinc-300 mb-1">Balance</label>
              <input
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Currency</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                {editingWallet ? 'Update' : 'Create'}
              </button>
              {editingWallet && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingWallet(null);
                    setFormData({ id: '', user_id: '', balance: '0', currency: 'NGN' });
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Currency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Created</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {wallets.map((wallet) => (
                  <tr key={wallet.id}>
                    <td className="px-6 py-4 text-sm text-zinc-300 font-mono">{wallet.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-zinc-100">{wallet.profiles?.full_name || wallet.user_id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-green-400 font-medium">₦{wallet.balance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{wallet.currency}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{new Date(wallet.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button onClick={() => handleEdit(wallet)} className="text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(wallet.id)} className="text-red-400 hover:underline">Delete</button>
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
