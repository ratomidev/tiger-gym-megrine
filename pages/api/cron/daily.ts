// pages/api/cron/daily.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  schedule: '0 0 * * *', // runs daily at midnight UTC
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("✅ Running daily cron job...");

    // Your logic here (e.g., expire subscriptions, cleanup)

    res.status(200).json({ message: 'Cron job ran successfully ✅' });
  } catch (error) {
    console.error("❌ Cron job error:", error);
    res.status(500).json({ error: 'Cron job failed' });
  }
}
