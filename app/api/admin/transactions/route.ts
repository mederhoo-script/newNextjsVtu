import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getUserIdFromSession, isAdmin } from '@/lib/purchaseUtils';
import { v4 as uuidv4 } from 'uuid';

// GET - List all transactions
export async function GET() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('transactions')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const adminUserId = await getUserIdFromSession();
    if (!adminUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(adminUserId);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { user_id, type, service_id, amount, charged_amount, reference, status, meta } = body;

    if (!user_id || !type) {
      return NextResponse.json({ error: 'User ID and type are required' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        id: uuidv4(),
        user_id,
        type,
        service_id,
        amount: amount || 0,
        charged_amount: charged_amount || 0,
        reference: reference || `ADMIN-${Date.now()}`,
        status: status || 'pending',
        meta: meta || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a transaction
export async function PUT(request: NextRequest) {
  try {
    const adminUserId = await getUserIdFromSession();
    if (!adminUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(adminUserId);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, type, service_id, amount, charged_amount, status, meta } = body;

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (type !== undefined) updateData.type = type;
    if (service_id !== undefined) updateData.service_id = service_id;
    if (amount !== undefined) updateData.amount = amount;
    if (charged_amount !== undefined) updateData.charged_amount = charged_amount;
    if (status !== undefined) updateData.status = status;
    if (meta !== undefined) updateData.meta = meta;

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a transaction
export async function DELETE(request: NextRequest) {
  try {
    const adminUserId = await getUserIdFromSession();
    if (!adminUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(adminUserId);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
