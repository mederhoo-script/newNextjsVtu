import { NextRequest, NextResponse } from 'next/server';
import * as inlomax from '@/lib/inlomax';
import { getUserIdFromSession } from '@/lib/purchaseUtils';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { service, smartcard_number } = body;

    if (!service || !smartcard_number) {
      return NextResponse.json(
        { error: 'Missing required fields: service, smartcard_number' },
        { status: 400 }
      );
    }

    const result = await inlomax.validateCable({
      service,
      smartcard_number,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating cable:', error);
    return NextResponse.json(
      { error: 'Failed to validate cable' },
      { status: 500 }
    );
  }
}
