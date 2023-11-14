import React from "react";
import useWebSocket from "@/app/hooks/useWebsocket";

interface CompetingProteins {
  name: string;
  pricePerKg: number;
  date: string;
  currency: "USD" | "GBP" | "AUD";
}

const proteins: CompetingProteins[] = [
  { name: "Poultry", pricePerKg: 1.33, date: "10/11/23", currency: "USD" },
  { name: "Pig", pricePerKg: 2.85, date: "10/11/23", currency: "USD" },
  { name: "Bovine", pricePerKg: 8.93, date: "10/11/23", currency: "USD" },
  { name: "Ovine", pricePerKg: 5.65, date: "10/11/23", currency: "AUD" },
  { name: "White fish", pricePerKg: 19.66, date: "10/11/23", currency: "GBP" },
];

const Protein: React.FC = () => {
  const exchangeRates = useWebSocket();

  const convertPriceToEur = (
    price: number,
    currency: "USD" | "GBP" | "AUD"
  ): number => {
    const usdNokRate = exchangeRates.USDNOK?.bid || 0;
    const eurNokRate = exchangeRates.EURNOK?.bid || 0;
    const conversionRateUsdToEur = usdNokRate / eurNokRate;
    let priceInUsd;

    switch (currency) {
      case "USD":
        priceInUsd = price;
        break;
      case "AUD":
        const audToUsdRate = 0.72; // Assuming 1 AUD = 0.72 USD
        priceInUsd = price * audToUsdRate;
        break;
      case "GBP":
        const gbpToUsdRate = 1.31; // Assuming 1 GBP = 1.31 USD
        priceInUsd = price * gbpToUsdRate;
        break;
      default:
        priceInUsd = 0;
    }
    return priceInUsd * conversionRateUsdToEur;
  };

  const maxPrice = Math.max(
    ...proteins.map((p) => convertPriceToEur(p.pricePerKg, p.currency))
  );

  // const getColor = (price: number, maxPrice: number): string => {
  //   // ... Your existing getColor function ...
  // };

  return (
    <div className="mt-4">
      <h2 className="ml-4 mb-4 font-semibold text-gray-800 dark:text-white">
        Competing Proteins
      </h2>
      <div className="grid grid-cols-4 text-left text-gray-400 mb-2 ml-4 ">
        <div>Protein</div>
        <div>Price per kg</div>
        <div>Date</div>
        <div className="md:block hidden">Price Chart</div>
      </div>
      {proteins.map((protein, index) => (
        <div
          key={index}
          className="grid grid-cols-4 text-left border-t py-2 ml-4 mb-2 text-gray-800 dark:text-white"
        >
          <div>{protein.name}</div>
          <div>
            {`€${convertPriceToEur(
              protein.pricePerKg,
              protein.currency
            ).toFixed(5)}`}
          </div>
          <div>{protein.date}</div>
          <div className="relative h-10">
            <div
              className="absolute bottom-4 bg-green-400 sm:block hidden"
              style={{
                width: `${
                  (convertPriceToEur(protein.pricePerKg, protein.currency) /
                    maxPrice) *
                  100
                }%`,
                height: "70%",
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Protein;
