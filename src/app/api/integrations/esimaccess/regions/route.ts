import { NextResponse } from 'next/server';
import { listLocations } from '@/lib/esimaccess_v1';

export async function POST() {
  try {
    const locations = await listLocations();
    return NextResponse.json({ success: true, data: locations });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


