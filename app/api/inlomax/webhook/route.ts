import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';

interface WebhookPayload {
  reference?: string;
  status?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();

    // Inlomax does not provide a webhook secret
    // Simply accept the JSON payload and update the transaction

    const { reference, status } = payload;

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference in webhook payload' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // Find transaction by reference
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single();

    if (fetchError || !transaction) {
      console.error('Transaction not found for reference:', reference);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check for duplicate updates (same reference + identical status)
    if (transaction.status === status) {
      console.log('Ignoring duplicate webhook update for reference:', reference);
      return NextResponse.json({
        success: true,
        message: 'Duplicate update ignored',
      });
    }

    // Map Inlomax status to our status
    let mappedStatus: 'pending' | 'processing' | 'success' | 'failed' = 'processing';
    if (status) {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus === 'success' || lowerStatus === 'completed') {
        mappedStatus = 'success';
      } else if (lowerStatus === 'failed' || lowerStatus === 'error') {
        mappedStatus = 'failed';
      } else if (lowerStatus === 'pending') {
        mappedStatus = 'pending';
      }
    }

    // Update transaction status and meta
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: mappedStatus,
        meta: { ...transaction.meta, webhook_update: payload },
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction updated',
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
