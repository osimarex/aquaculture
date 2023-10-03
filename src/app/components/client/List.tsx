"use client";

import React, { useState, useEffect } from "react";
import useWebSocket from "../../hooks/useWebsocket";

// Utility function to map currency code to flag image file path
const getFlagImagePath = (currencyCode: string) => {
  const countryMap: Record<string, string> = {
    EUR: "europe",
    NOK: "norway",
    USD: "usa",
    CHF: "switzerland",
    // ... add more later
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
}

const SymbolRow: React.FC<SymbolProps> = ({
  symbol,
  bid,
  ask,
  prevBid = null,
  prevAsk = null,
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

  return (
    <div className="flex items-center">
      <div className="w-6 h-6 rounded-full overflow-hidden">
        <img
          src={getFlagImagePath(currency1)}
          alt={`${currency1} flag`}
          className="object-cover w-full h-full"
        />
      </div>
      <span className="pl-2">{currency1}</span>
      <span>/</span>
      <span className="pr-2">{currency2}</span>
      <div className="w-6 h-6 rounded-full overflow-hidden">
        <img
          src={getFlagImagePath(currency2)}
          alt={`${currency2} flag`}
          className="object-cover w-full h-full"
        />
      </div>
      <span className={`px-2 mx-2 ${bidClass}`}>Bid: {bid}</span>
      <span className={`mx-2 ${askClass}`}>Ask: {ask}</span>
    </div>
  );
};

const List: React.FC = () => {
  const data = useWebSocket();
  const [prevData, setPrevData] = useState<{ [key: string]: PriceData } | null>(
    null
  );

  useEffect(() => {
    if (data) {
      setPrevData(data as unknown as { [key: string]: PriceData });
    }
  }, [data]);

  return (
    <>
      {data.USDNOK && (
        <div className="mb-2">
          <SymbolRow
            {...data.USDNOK}
            prevBid={prevData?.USDNOK?.bid || null}
            prevAsk={prevData?.USDNOK?.ask || null}
          />
        </div>
      )}

      {data.CHFNOK && (
        <div className="mb-2">
          <SymbolRow
            {...data.CHFNOK}
            prevBid={prevData?.CHFNOK?.bid || null}
            prevAsk={prevData?.CHFNOK?.ask || null}
          />
        </div>
      )}

      {data.EURNOK && (
        <div className="mb-2">
          <SymbolRow
            {...data.EURNOK}
            prevBid={prevData?.EURNOK?.bid || null}
            prevAsk={prevData?.EURNOK?.ask || null}
          />
        </div>
      )}
    </>
  );
};

export default List;
