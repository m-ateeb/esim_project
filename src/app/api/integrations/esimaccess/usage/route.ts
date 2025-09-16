import { NextRequest, NextResponse } from 'next/server';
import { queryUsage } from '@/lib/esimaccess_v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const list: string[] = body?.esimTranNoList || body?.list || body?.ids;
    if (!Array.isArray(list) || list.length === 0) {
      return NextResponse.json({ success: false, error: 'esimTranNoList required' }, { status: 400 });
    }
    const usage = await queryUsage(list);
    return NextResponse.json({ success: true, data: usage });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


