import { NextResponse } from 'next/server';
import { queryBalance } from '@/lib/esimaccess_v1';

export async function POST() {
  try {
    const res = await queryBalance();
    return NextResponse.json({ success: true, data: res });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


