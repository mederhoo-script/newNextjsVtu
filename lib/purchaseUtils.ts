import { createServerSupabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

export interface PurchaseContext {
  userId: string;
  walletId: string;
  balance: bigint;
}

export interface TransactionRecord {
  id: string;
  user_id: string;
  type: string;
  service_id: string;
  amount: bigint;
  charged_amount: bigint;
  reference: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  meta: Record<string, unknown>;
}

/**
 * Get user ID from session
 */
export async function getUserIdFromSession(): Promise<string | null> {
  try {
    const supabase = createServerSupabase();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (!accessToken || !refreshToken) {
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return null;
    }

    return user.id;
  } catch {
    return null;
  }
}

/**
 * Get wallet for user (uses service role key)
 */
export async function getWallet(userId: string) {
  const supabase = createServerSupabase();
  
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to get wallet: ${error.message}`);
  }

  return wallet;
}

/**
 * Create a pending transaction
 */
export async function createTransaction(params: {
  userId: string;
  type: string;
  serviceId: string;
  amount: number;
  chargedAmount: number;
  reference: string;
}): Promise<TransactionRecord> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      id: uuidv4(),
      user_id: params.userId,
      type: params.type,
      service_id: params.serviceId,
      amount: params.amount,
      charged_amount: params.chargedAmount,
      reference: params.reference,
      status: 'pending',
      meta: {},
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }

  return data;
}

/**
 * Debit wallet
 */
export async function debitWallet(userId: string, amount: number): Promise<void> {
  const supabase = createServerSupabase();

  const wallet = await getWallet(userId);
  const newBalance = BigInt(wallet.balance) - BigInt(amount);

  if (newBalance < 0n) {
    throw new Error('Insufficient balance');
  }

  const { error } = await supabase
    .from('wallets')
    .update({ balance: Number(newBalance), updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to debit wallet: ${error.message}`);
  }
}

/**
 * Credit/refund wallet
 */
export async function creditWallet(userId: string, amount: number): Promise<void> {
  const supabase = createServerSupabase();

  const wallet = await getWallet(userId);
  const newBalance = BigInt(wallet.balance) + BigInt(amount);

  const { error } = await supabase
    .from('wallets')
    .update({ balance: Number(newBalance), updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to credit wallet: ${error.message}`);
  }
}

/**
 * Update transaction status
 */
export async function updateTransaction(
  transactionId: string,
  status: 'pending' | 'processing' | 'success' | 'failed',
  meta?: Record<string, unknown>
): Promise<void> {
  const supabase = createServerSupabase();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (meta) {
    updateData.meta = meta;
  }

  const { error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', transactionId);

  if (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
}

/**
 * Get transaction by reference
 */
export async function getTransactionByReference(reference: string) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('reference', reference)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Generate a unique reference
 */
export function generateReference(): string {
  return `VTU-${Date.now()}-${uuidv4().substring(0, 8)}`;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === 'admin';
}
