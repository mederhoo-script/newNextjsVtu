'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '@/components/AdminNavigation';

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  service_id: string;
  amount: number;
  charged_amount: number;
  reference: string;
  status: string;
  meta: Record<string, unknown>;
  created_at: string;
  profiles?: { full_name: string };
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    user_id: '',
    type: '',
    service_id: '',
    amount: '0',
    charged_amount: '0',
    status: 'pending',
  });
  const [message, setMessage] = useState('');

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions');
      const data = await response.json();
      if (response.ok && data.data) {
        setTransactions(data.data);
      }
    } catch {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const method = editingTx ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/transactions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseInt(formData.amount),
          charged_amount: parseInt(formData.charged_amount),
        }),
      });

      if (response.ok) {
        setMessage(editingTx ? 'Transaction updated' : 'Transaction created');
        fetchTransactions();
        setEditingTx(null);
        setFormData({ id: '', user_id: '', type: '', service_id: '', amount: '0', charged_amount: '0', status: 'pending' });
      } else {
        const data = await response.json();
        setMessage(data.error || 'Operation failed');
      }
    } catch {
      setMessage('An error occurred');
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormData({
      id: tx.id,
      user_id: tx.user_id,
      type: tx.type || '',
      service_id: tx.service_id || '',
      amount: tx.amount.toString(),
      charged_amount: tx.charged_amount.toString(),
      status: tx.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await fetch(`/api/admin/transactions?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTransactions();
      }
    } catch {
      console.error('Failed to delete transaction');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-900 text-green-200';
      case 'failed': return 'bg-red-900 text-red-200';
      case 'processing': return 'bg-yellow-900 text-yellow-200';
      default: return 'bg-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Transactions</h1>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8">
          <h2 className="text-lg font-medium text-zinc-100 mb-4">
            {editingTx ? 'Edit Transaction' : 'Create Transaction'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!editingTx && (
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
              <label className="block text-sm font-medium text-zinc-300 mb-1">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Service ID</label>
              <input
                type="text"
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Charged Amount</label>
              <input
                type="number"
                value={formData.charged_amount}
                onChange={(e) => setFormData({ ...formData, charged_amount: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100"
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
                <option value="processing">Processing</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                {editingTx ? 'Update' : 'Create'}
              </button>
              {editingTx && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTx(null);
                    setFormData({ id: '', user_id: '', type: '', service_id: '', amount: '0', charged_amount: '0', status: 'pending' });
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
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-4 text-sm text-zinc-100 capitalize">{tx.type}</td>
                    <td className="px-4 py-4 text-sm text-zinc-300 font-mono">{tx.reference?.substring(0, 15)}...</td>
                    <td className="px-4 py-4 text-sm text-green-400">₦{tx.amount?.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-right text-sm space-x-2">
                      <button onClick={() => handleEdit(tx)} className="text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(tx.id)} className="text-red-400 hover:underline">Delete</button>
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
