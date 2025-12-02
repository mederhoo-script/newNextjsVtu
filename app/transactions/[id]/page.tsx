'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: string;
  service_id: string;
  amount: number;
  charged_amount: number;
  reference: string;
  status: string;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export default function TransactionDetailsPage() {
  const params = useParams();
  const [transaction] = useState<Transaction | null>(null);
  const [loading] = useState(false);
  const transactionId = params.id;

  // TODO: Implement transaction fetching from API
  // useEffect(() => {
  //   fetch(`/api/transactions/${transactionId}`).then(...).then(setTransaction);
  // }, [transactionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/transactions" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Transactions
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
          Transaction Details
        </h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        ) : !transaction ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Transaction not found.</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
              Transaction ID: {transactionId}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Status</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Type</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100 capitalize">{transaction.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Reference</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100 font-mono">{transaction.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Service ID</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">{transaction.service_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Amount</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">₦{transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Charged Amount</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">₦{transaction.charged_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Date</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">
                  {new Date(transaction.created_at).toLocaleString()}
                </span>
              </div>
              {transaction.meta && Object.keys(transaction.meta).length > 0 && (
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">Additional Info</h3>
                  <pre className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-3 rounded overflow-auto">
                    {JSON.stringify(transaction.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
