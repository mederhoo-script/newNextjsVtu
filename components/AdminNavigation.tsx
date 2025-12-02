'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/wallets', label: 'Wallets' },
  { href: '/admin/transactions', label: 'Transactions' },
  { href: '/admin/topups', label: 'Topups' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-zinc-900 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/admin/dashboard" className="flex items-center px-2 text-xl font-bold text-red-500">
              Admin Panel
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-zinc-300 hover:text-white"
            >
              Back to App
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 border-t border-zinc-700">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              pathname === item.href
                ? 'bg-red-600 text-white'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
