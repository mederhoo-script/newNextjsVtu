import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getUserIdFromSession, getWallet, creditWallet } from '@/lib/purchaseUtils';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // Create topup record
    const topupId = uuidv4();
    const { error: topupError } = await supabase
      .from('topups')
      .insert({
        id: topupId,
        user_id: userId,
        amount,
        status: 'success', // Mock topup - immediately successful
        meta: { source: 'mock_topup' },
      });

    if (topupError) {
      return NextResponse.json(
        { error: 'Failed to create topup record' },
        { status: 500 }
      );
    }

    // Credit wallet
    await creditWallet(userId, amount);

    // Get updated wallet
    const wallet = await getWallet(userId);

    return NextResponse.json({
      success: true,
      topup_id: topupId,
      new_balance: wallet.balance,
    });
  } catch (error) {
    console.error('Error processing topup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
