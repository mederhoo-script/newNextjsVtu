# VTU Platform - Inlomax Integration

A Next.js Virtual Top-Up platform powered by Inlomax API, with Supabase for user management and database.

## Features

- **User Authentication**: Sign up and login via Supabase Auth
- **Wallet System**: Digital wallet for managing balance
- **VTU Services**:
  - Airtime purchase
  - Data bundles
  - Cable TV subscriptions (DStv, GOtv, StarTimes)
  - Electricity bill payments
  - Education PINs (WAEC, NECO, JAMB)
- **Admin Dashboard**: Complete admin panel for managing users, wallets, transactions, and topups
- **Webhook Support**: Receive transaction status updates from Inlomax

## Tech Stack

- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (server-side)
- **Database**: Supabase (PostgreSQL)
- **API**: Inlomax VTU API

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/mederhoo-script/newNextjsVtu.git
cd newNextjsVtu
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
INLOMAX_API_KEY=your_inlomax_api_key
```

### 4. Set up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the migration in `supabase/migrations/001_init.sql` in the SQL Editor
3. Copy your project URL and keys to `.env.local`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Inlomax API Integration

### Webhook Configuration

Register your webhook URL in your Inlomax dashboard:

```
POST https://yourdomain.com/api/inlomax/webhook
```

**Note**: Inlomax does not provide a webhook secret. The webhook endpoint accepts status updates without signature verification.

### Testing with Real API

To test with the real Inlomax API:
1. Get your API key from Inlomax
2. Add it to `INLOMAX_API_KEY` in your environment
3. The services endpoint will fetch live pricing data

## API Routes

### Public Endpoints

- `GET /api/inlomax/services` - Get available services and pricing

### Purchase Endpoints (Authenticated)

- `POST /api/inlomax/airtime` - Purchase airtime
- `POST /api/inlomax/data` - Purchase data bundle
- `POST /api/inlomax/validatecable` - Validate cable smartcard
- `POST /api/inlomax/subcable` - Subscribe to cable TV
- `POST /api/inlomax/validatemeter` - Validate electricity meter
- `POST /api/inlomax/payelectric` - Pay electricity bill
- `POST /api/inlomax/education` - Purchase education PIN
- `POST /api/inlomax/transaction` - Get transaction details

### Wallet Endpoint

- `POST /api/wallet/topup` - Top up wallet (mock)

### Admin Endpoints (Admin Only)

- `GET/POST/PUT/DELETE /api/admin/users` - Manage users
- `GET/POST/PUT/DELETE /api/admin/wallets` - Manage wallets
- `GET/POST/PUT/DELETE /api/admin/transactions` - Manage transactions
- `GET/POST/PUT/DELETE /api/admin/topups` - Manage topups
- `GET /api/admin/balance` - Get Inlomax balance

### Webhook

- `POST /api/inlomax/webhook` - Receive Inlomax status updates

## Security Notes

- `INLOMAX_API_KEY` is used **server-side only**
- `SUPABASE_SERVICE_ROLE_KEY` is used **server-side only**
- All purchase routes use the service role key for wallet operations
- Admin routes verify user role (`role = 'admin'`) before allowing access
- Webhook handlers detect duplicate updates and ignore repeats
- Consider implementing rate limiting for production

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── wallets/
│   │   ├── transactions/
│   │   ├── topups/
│   │   └── settings/
│   ├── api/
│   │   ├── admin/
│   │   ├── inlomax/
│   │   └── wallet/
│   ├── airtime/
│   ├── cable/
│   ├── data/
│   ├── education/
│   ├── electricity/
│   ├── transactions/
│   └── wallet/
├── components/
├── lib/
│   ├── inlomax.ts
│   ├── purchaseUtils.ts
│   └── supabaseClient.ts
└── supabase/
    └── migrations/
```

## License

MIT