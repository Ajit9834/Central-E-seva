import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = getApplicationById(id);

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (err) {
    console.error('Error fetching application:', err);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}
