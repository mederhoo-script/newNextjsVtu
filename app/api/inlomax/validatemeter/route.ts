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
    const { disco, meter_number, meter_type } = body;

    if (!disco || !meter_number || !meter_type) {
      return NextResponse.json(
        { error: 'Missing required fields: disco, meter_number, meter_type' },
        { status: 400 }
      );
    }

    const result = await inlomax.validateMeter({
      disco,
      meter_number,
      meter_type,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating meter:', error);
    return NextResponse.json(
      { error: 'Failed to validate meter' },
      { status: 500 }
    );
  }
}
