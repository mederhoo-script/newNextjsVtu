import { NextRequest, NextResponse } from 'next/server';
import * as inlomax from '@/lib/inlomax';
import {
  getUserIdFromSession,
  getWallet,
  createTransaction,
  debitWallet,
  creditWallet,
  updateTransaction,
  generateReference,
} from '@/lib/purchaseUtils';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { network, phone, plan_id, amount } = body;

    if (!network || !phone || !plan_id) {
      return NextResponse.json(
        { error: 'Missing required fields: network, phone, plan_id' },
        { status: 400 }
      );
    }

    const chargedAmount = amount || 0;

    // Check wallet balance
    const wallet = await getWallet(userId);
    if (BigInt(wallet.balance) < BigInt(chargedAmount)) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Generate reference
    const reference = generateReference();

    // Create pending transaction
    const transaction = await createTransaction({
      userId,
      type: 'data',
      serviceId: plan_id,
      amount: chargedAmount,
      chargedAmount,
      reference,
    });

    // Debit wallet immediately
    if (chargedAmount > 0) {
      await debitWallet(userId, chargedAmount);
    }

    try {
      // Call Inlomax API
      const result = await inlomax.data({
        network,
        phone,
        plan_id,
        reference,
      });

      // Update transaction with success or processing
      const newStatus = result.success ? 'success' : 'processing';
      await updateTransaction(transaction.id, newStatus, result);

      return NextResponse.json({
        success: true,
        reference,
        status: newStatus,
        data: result,
      });
    } catch (apiError) {
      // Refund wallet on API failure
      if (chargedAmount > 0) {
        await creditWallet(userId, chargedAmount);
      }
      await updateTransaction(transaction.id, 'failed', {
        error: apiError instanceof Error ? apiError.message : 'Unknown error',
      });

      return NextResponse.json(
        { error: 'Data purchase failed', details: apiError instanceof Error ? apiError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
