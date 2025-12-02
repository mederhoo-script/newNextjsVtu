'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/airtime', label: 'Airtime' },
  { href: '/data', label: 'Data' },
  { href: '/cable', label: 'Cable TV' },
  { href: '/electricity', label: 'Electricity' },
  { href: '/education', label: 'Education' },
  { href: '/transactions', label: 'Transactions' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 text-xl font-bold text-blue-600">
              VTU Platform
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400"
            >
              Admin
            </Link>
            <Link
              href="/login"
              className="text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 border-t border-zinc-200 dark:border-zinc-800">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
