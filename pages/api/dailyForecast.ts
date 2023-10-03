// pages/api/dailyForecast.ts
import type { NextApiRequest, NextApiResponse } from "next";
import getDailyForecast from "@/utilities/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getDailyForecast();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
