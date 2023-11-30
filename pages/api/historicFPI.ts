import type { NextApiRequest, NextApiResponse } from "next";
import getHistoricFPI from "@/utilities/dbHistoricFPI";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getHistoricFPI();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
