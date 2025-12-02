'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';

export default function CablePage() {
  const [service, setService] = useState('');
  const [smartcardNumber, setSmartcardNumber] = useState('');
  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState('');

  const handleValidate = async () => {
    if (!service || !smartcardNumber) return;
    setValidating(true);
    setCustomerName('');

    try {
      const response = await fetch('/api/inlomax/validatecable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, smartcard_number: smartcardNumber }),
      });

      const data = await response.json();

      if (response.ok && data.name) {
        setCustomerName(data.name);
      } else {
        setMessage(data.error || 'Validation failed');
      }
    } catch {
      setMessage('Validation error');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/inlomax/subcable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          service, 
          smartcard_number: smartcardNumber, 
          plan_id: planId,
          amount: parseInt(amount) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Cable subscription successful! Reference: ${data.reference}`);
        setSmartcardNumber('');
        setPlanId('');
        setAmount('');
        setCustomerName('');
      } else {
        setMessage(data.error || 'Subscription failed');
      }
    } catch {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Cable TV</h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Service Provider
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                required
              >
                <option value="">Select Provider</option>
                <option value="dstv">DStv</option>
                <option value="gotv">GOtv</option>
                <option value="startimes">StarTimes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Smartcard Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={smartcardNumber}
                  onChange={(e) => setSmartcardNumber(e.target.value)}
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  placeholder="Enter smartcard number"
                  required
                />
                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={validating}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-50"
                >
                  {validating ? '...' : 'Validate'}
                </button>
              </div>
              {customerName && (
                <p className="mt-2 text-sm text-green-600">Customer: {customerName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Plan ID
              </label>
              <input
                type="text"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                placeholder="Enter plan ID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                placeholder="Enter amount"
                min="0"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          </form>
          {message && (
            <p className={`mt-4 text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
