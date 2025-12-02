'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';

export default function ElectricityPage() {
  const [disco, setDisco] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [meterType, setMeterType] = useState('prepaid');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState('');

  const handleValidate = async () => {
    if (!disco || !meterNumber || !meterType) return;
    setValidating(true);
    setCustomerName('');

    try {
      const response = await fetch('/api/inlomax/validatemeter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disco, meter_number: meterNumber, meter_type: meterType }),
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
      const response = await fetch('/api/inlomax/payelectric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          disco, 
          meter_number: meterNumber, 
          meter_type: meterType,
          amount: parseInt(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Electricity payment successful! Reference: ${data.reference}`);
        setMeterNumber('');
        setAmount('');
        setCustomerName('');
      } else {
        setMessage(data.error || 'Payment failed');
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
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Electricity</h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Distribution Company
              </label>
              <select
                value={disco}
                onChange={(e) => setDisco(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                required
              >
                <option value="">Select DisCo</option>
                <option value="eko">Eko Electric</option>
                <option value="ikeja">Ikeja Electric</option>
                <option value="ibadan">Ibadan Electric</option>
                <option value="abuja">Abuja Electric</option>
                <option value="kano">Kano Electric</option>
                <option value="portharcourt">Port Harcourt Electric</option>
                <option value="jos">Jos Electric</option>
                <option value="kaduna">Kaduna Electric</option>
                <option value="enugu">Enugu Electric</option>
                <option value="benin">Benin Electric</option>
                <option value="yola">Yola Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Meter Type
              </label>
              <select
                value={meterType}
                onChange={(e) => setMeterType(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="prepaid">Prepaid</option>
                <option value="postpaid">Postpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Meter Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  placeholder="Enter meter number"
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
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                placeholder="Enter amount"
                min="1000"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Electricity'}
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
