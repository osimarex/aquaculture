"use client";

import React, { useState, useEffect } from "react";
import useWebSocket from "@/app/hooks/useWebsocket";
import Image from "next/image";

// Utility function to map currency code to flag image file path
const getFlagImagePath = (currencyCode: string) => {
  const countryMap: Record<string, string> = {
    EUR: "europe",
    NOK: "norway",
    USD: "usa",
  };

  const country = countryMap[currencyCode];
  return country ? `/flags/${country}-flag-small.jpg` : "";
};

interface PriceData {
  symbol: string;
  bid: number;
  ask: number;
}

interface SymbolProps extends PriceData {
  prevBid: number | null;
  prevAsk: number | null;
  signal: number | null;
}

const SymbolRow: React.FC<SymbolProps> = ({
  symbol,
  bid,
  ask,
  prevBid = null,
  prevAsk = null,
  signal,
}) => {
  const bidClass =
    prevBid !== null
      ? prevBid < bid
        ? "bg-green-500" // Green for increase
        : prevBid > bid
        ? "bg-red-500" // Red for decrease
        : ""
      : "";
  const askClass =
    prevAsk !== null
      ? prevAsk < ask
        ? "bg-green-500" // Green for increase
        : prevAsk > ask
        ? "bg-red-500" // Red for decrease
        : ""
      : "";
  const [currency1, currency2] = [symbol.slice(0, 3), symbol.slice(3, 6)];

  const circleColor = Number(signal) === 1 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="flex items-center mt-2">
      <div
        className={`w-7 h-7 mr-4 rounded-full flex-shrink-0 ${circleColor}`}
      />{" "}
      <div className="w-8 h-6 hidden sm:block">
        <Image
          src={getFlagImagePath(currency1)}
          alt={`${currency1} flag`}
          width={32}
          height={24}
          className="object-cover w-full h-full min-w-[32px]"
        />
      </div>
      <span className="pl-2">{currency1}</span>
      <span>/</span>
      <span className="pr-2">{currency2}</span>
      <div className="w-8 h-6 hidden sm:block">
        <Image
          src={getFlagImagePath(currency2)}
          alt={`${currency2} flag`}
          width={32}
          height={24}
          className="object-cover w-full h-full min-w-[32px]"
        />
      </div>
      <span
        className={`ml-8 w-24 ${bidClass} hover:text-blue-500 transition duration-200`}
        title="Bid"
      >
        {bid}
      </span>
      <span
        className={` ${askClass} hover:text-blue-500 transition duration-200`}
        title="Ask"
      >
        {ask}
      </span>
    </div>
  );
};

const List: React.FC = () => {
  const data = useWebSocket();
  const [prevData, setPrevData] = useState<{ [key: string]: PriceData } | null>(
    null
  );

  // Declare state variables for the signal values
  const [usdNokSignal, setUsdNokSignal] = useState<number | null>(null);
  const [eurNokSignal, setEurNokSignal] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setPrevData(data as unknown as { [key: string]: PriceData });
    }
  }, [data]);

  useEffect(() => {
    const fetchSignalData = async () => {
      try {
        const response = await fetch("/api/dailyForecast");
        const data = await response.json();
        // Assume the signal data is structured similarly to your chart data
        const usdNokSignalValue = data.find(
          (item: any) => item.pair === "USDNOK"
        ).signal_5;
        const eurNokSignalValue = data.find(
          (item: any) => item.pair === "EURNOK"
        ).signal_5;

        // Update the state with the fetched signal values
        setUsdNokSignal(usdNokSignalValue);
        setEurNokSignal(eurNokSignalValue);

        // console.log("USDNOK Signal:", usdNokSignalValue);
        // console.log("EURNOK Signal:", eurNokSignalValue);
      } catch (error) {
        console.error("Error fetching signal data:", error);
      }
    };

    fetchSignalData();
  }, []);

  return (
    <div className="w-full border-solid border-2 border-sky-800 shadow-lg rounded-xl pr-2">
      {data.USDNOK && (
        <div className="mb-2 ml-4 mt-4">
          <SymbolRow
            {...data.USDNOK}
            prevBid={prevData?.USDNOK?.bid || null}
            prevAsk={prevData?.USDNOK?.ask || null}
            signal={usdNokSignal}
          />
        </div>
      )}

      {data.EURNOK && (
        <div className="mb-2 ml-4">
          <hr className="border-gray-400 mr-4" />
          <SymbolRow
            {...data.EURNOK}
            prevBid={prevData?.EURNOK?.bid || null}
            prevAsk={prevData?.EURNOK?.ask || null}
            signal={eurNokSignal}
          />
          <hr className="border-white mr-4 mt-2" />
        </div>
      )}
    </div>
  );
};

export default List;
