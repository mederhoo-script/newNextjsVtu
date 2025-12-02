import { NextResponse } from 'next/server';
import { getBalance } from '@/lib/inlomax';
import { getUserIdFromSession, isAdmin } from '@/lib/purchaseUtils';

export async function GET() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const balance = await getBalance();
    return NextResponse.json(balance);
  } catch (error) {
    console.error('Error fetching Inlomax balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
