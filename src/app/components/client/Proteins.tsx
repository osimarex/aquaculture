"use client";

import React from "react";

interface CompetingProteins {
  name: string;
  pricePerKg: number;
  date: string;
}

const proteins: CompetingProteins[] = [
  { name: "Salmon", pricePerKg: 20.0, date: "01/01/23" },
  { name: "Beef", pricePerKg: 15.0, date: "01/01/23" },
  { name: "Pork", pricePerKg: 12.0, date: "01/01/23" },
  { name: "Chicken", pricePerKg: 10.0, date: "01/01/23" },
  { name: "Eggs", pricePerKg: 8.0, date: "01/01/23" },
  { name: "Whey Protein", pricePerKg: 25.0, date: "01/01/23" },
  { name: "Insect Protein", pricePerKg: 30.0, date: "01/01/23" },
];

const maxPrice = Math.max(...proteins.map((p) => p.pricePerKg));

const getColor = (price: number, maxPrice: number): string => {
  const percentage = price / maxPrice;
  let hue;

  if (percentage < 0.4) {
    hue = 5 * percentage * 2; // Transition from red (0) to yellow (60) for the first half of the range
  } else {
    hue = 60 + 60 * (percentage - 0.5) * 2; // Transition from yellow (60) to green (120) for the second half of the range
  }

  const lightness = 30 + 30 * percentage; // Transition lightness from 50 to 75
  const saturation = 85 + 25 * percentage; // Transition saturation from 75 to 100

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const Protein: React.FC = () => {
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
          <div>${protein.pricePerKg.toFixed(2)}</div>
          <div>{protein.date}</div>
          <div className="relative h-10">
            <div
              className="absolute bottom-4 bg-green-400 md:block hidden"
              style={{
                width: `${(protein.pricePerKg / maxPrice) * 100}%`,
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
