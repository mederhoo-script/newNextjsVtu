'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '@/components/AdminNavigation';

interface Stats {
  totalUsers: number;
  totalWallets: number;
  totalTransactions: number;
  totalTopups: number;
  inlomaxBalance: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalWallets: 0,
    totalTransactions: 0,
    totalTopups: 0,
    inlomaxBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch actual stats
    setLoading(false);
  }, []);

  const fetchInlomaxBalance = async () => {
    setBalanceLoading(true);
    try {
      const response = await fetch('/api/admin/balance');
      const data = await response.json();
      if (response.ok && data.balance !== undefined) {
        setStats((prev) => ({ ...prev, inlomaxBalance: data.balance }));
      }
    } catch {
      console.error('Failed to fetch Inlomax balance');
    } finally {
      setBalanceLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Admin Dashboard</h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-zinc-400">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-sm font-medium text-zinc-400">Total Users</h3>
                <p className="text-3xl font-bold text-zinc-100 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-sm font-medium text-zinc-400">Total Wallets</h3>
                <p className="text-3xl font-bold text-zinc-100 mt-2">{stats.totalWallets}</p>
              </div>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-sm font-medium text-zinc-400">Total Transactions</h3>
                <p className="text-3xl font-bold text-zinc-100 mt-2">{stats.totalTransactions}</p>
              </div>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-sm font-medium text-zinc-400">Total Topups</h3>
                <p className="text-3xl font-bold text-zinc-100 mt-2">{stats.totalTopups}</p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-zinc-100">Inlomax Balance</h3>
                <button
                  onClick={fetchInlomaxBalance}
                  disabled={balanceLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
                >
                  {balanceLoading ? 'Loading...' : 'Refresh Balance'}
                </button>
              </div>
              <p className="text-4xl font-bold text-green-500">
                ₦{stats.inlomaxBalance.toLocaleString()}
              </p>
              <p className="text-sm text-zinc-400 mt-2">
                This is your Inlomax API wallet balance
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
