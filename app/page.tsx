'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';

const services = [
  { name: 'Airtime', href: '/airtime', description: 'Purchase airtime for any network', icon: '📱' },
  { name: 'Data', href: '/data', description: 'Buy data bundles', icon: '📶' },
  { name: 'Cable TV', href: '/cable', description: 'Subscribe to DStv, GOtv, Startimes', icon: '📺' },
  { name: 'Electricity', href: '/electricity', description: 'Pay electricity bills', icon: '💡' },
  { name: 'Education', href: '/education', description: 'Buy WAEC, NECO, JAMB pins', icon: '📚' },
  { name: 'Wallet', href: '/wallet', description: 'Manage your wallet balance', icon: '💰' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome to VTU Platform. Choose a service below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="block p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {service.name}
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {service.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Recent Transactions
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your recent transactions will appear here.{' '}
            <Link href="/transactions" className="text-blue-600 hover:underline">
              View all transactions
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
