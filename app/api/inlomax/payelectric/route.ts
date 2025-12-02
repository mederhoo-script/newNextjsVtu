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
    const { disco, meter_number, meter_type, amount } = body;

    if (!disco || !meter_number || !meter_type || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: disco, meter_number, meter_type, amount' },
        { status: 400 }
      );
    }

    // Check wallet balance
    const wallet = await getWallet(userId);
    if (BigInt(wallet.balance) < BigInt(amount)) {
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
      type: 'electricity',
      serviceId: disco,
      amount,
      chargedAmount: amount,
      reference,
    });

    // Debit wallet immediately
    await debitWallet(userId, amount);

    try {
      // Call Inlomax API
      const result = await inlomax.payElectric({
        disco,
        meter_number,
        meter_type,
        amount,
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
      await creditWallet(userId, amount);
      await updateTransaction(transaction.id, 'failed', {
        error: apiError instanceof Error ? apiError.message : 'Unknown error',
      });

      return NextResponse.json(
        { error: 'Electricity payment failed', details: apiError instanceof Error ? apiError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing electricity payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
