import { NextResponse } from 'next/server';
import { getAllApplications } from '@/lib/db';

export async function GET() {
  try {
    const applications = getAllApplications();
    return NextResponse.json({ applications });
  } catch (err) {
    console.error('Error fetching applications:', err);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
