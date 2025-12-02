'use client';

import AdminNavigation from '@/components/AdminNavigation';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Inlomax API Key
                </label>
                <p className="text-sm text-zinc-400">
                  Configure via environment variable: <code className="bg-zinc-800 px-2 py-1 rounded">INLOMAX_API_KEY</code>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Supabase URL
                </label>
                <p className="text-sm text-zinc-400">
                  Configure via environment variable: <code className="bg-zinc-800 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Webhook Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Webhook Endpoint
                </label>
                <code className="block bg-zinc-800 px-4 py-2 rounded text-sm text-zinc-300">
                  POST /api/inlomax/webhook
                </code>
              </div>
              <p className="text-sm text-zinc-400">
                Register this URL in your Inlomax dashboard to receive transaction status updates.
                No signature verification is required.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Security Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
              <li><code className="bg-zinc-800 px-1 rounded">INLOMAX_API_KEY</code> is used server-side only</li>
              <li><code className="bg-zinc-800 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is used server-side only</li>
              <li>All purchase routes use the service role key for wallet operations</li>
              <li>Admin routes verify user role before allowing access</li>
              <li>Consider implementing rate limiting for production</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
