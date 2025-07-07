// app/api/cron/daily.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("✅ Running daily cron job...");

    // TODO: Add your real logic here (e.g., database updates, cleanup)

    return NextResponse.json({ message: 'Cron job ran successfully ✅' });
  } catch (error) {
    console.error("❌ Cron job error:", error);
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
