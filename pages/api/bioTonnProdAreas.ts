// pages/api/productionNumbers.ts
import type { NextApiRequest, NextApiResponse } from "next";
import getBiomasseTonnProd from "@/utilities/dbBioTonnProd";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getBiomasseTonnProd();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
