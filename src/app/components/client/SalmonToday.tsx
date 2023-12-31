"use client";

import React, { useState, useEffect } from "react";

const List: React.FC = () => {
  const [usdNokPrice, setUsdNokPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch("/api/dailyForecast");
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        const usdNokItem = data.find((item: any) => item.pair === "USDNOK");
        if (usdNokItem && usdNokItem.price_10) {
          setUsdNokPrice(usdNokItem.price_10);
        } else {
          console.error("USDNOK price_10 not found in the data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPriceData();
  }, []);

  return (
    <div className="h-[105px] w-fit border-solid border-2 border-sky-800 bg-sky-900 dark:bg-sky-600 font-bold shadow-lg rounded-xl px-3 pb-2 text-white flex items-center justify-center">
      {usdNokPrice !== null && (
        <div>
          <span>Now: ${usdNokPrice}</span>
        </div>
      )}
    </div>
  );
};

export default List;
