/*"use client";

import { useEffect, useState } from "react";
import Highcharts from "highcharts";

const currencyToCountryMap = {
  usd: "united-states-of-america",
  eur: "europe",
  nok: "norway",
  sek: "sweden",
  dkk: "denmark",
  chf: "switzerland",
  gbp: "united-kingdom",
};

interface DataItem {
  price_0: number;
  price_1: number;
  price_2: number;
  price_3: number;
  price_4: number;
  price_5: number;
  price_6: number;
  price_7: number;
  price_8: number;
  price_9: number;
  price_10: number;
  pair: string;
}

const fetchForecastData = async () => {
  try {
    const response = await fetch(
      "https://trafficlights.neptune-software.cloud/api/entity/fxdailyforecast"
    );
    return response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

const createForecastChart = (data: DataItem[], currencyPair: string) => {
  try {
    if (!currencyPair) {
      console.error("currencyPair not defined.");
      return;
    }

    const currency1 = currencyPair
      .substring(0, 3)
      .toLowerCase() as keyof typeof currencyToCountryMap;
    const currency2 = currencyPair
      .substring(3)
      .toLowerCase() as keyof typeof currencyToCountryMap;

    const flag1 = currencyToCountryMap[currency1];
    const flag2 = currencyToCountryMap[currency2];

    const flag1URL = `https://trafficlights.neptune-software.cloud/media/root/FX/${flag1}-flag-round-icon-64.png`;
    const flag2URL = `https://trafficlights.neptune-software.cloud/media/root/FX/${flag2}-flag-round-icon-64.png`;

    const titleHTML = `
        <div style="text-align: center;">
          <img class="flagcurrency" src="${flag1URL}" alt="${flag1}">
            ${currency1.toUpperCase()}/${currency2.toUpperCase()} 
          <img class="flagcurrency" src="${flag2URL}" alt="${flag2}"> 
          <div class="forecastText">Daily Forecast</div>
        </div>`;

    // Transform data into chart-friendly arrays
    let price_0 = [];
    let price_1 = [];
    let price_2 = [];
    let price_3 = [];
    let price_4 = [];
    let price_5 = [];
    let price_6 = [];
    let price_7 = [];
    let price_8 = [];
    let price_9 = [];
    let price_10 = [];

    for (let obs of data) {
      price_0.push(obs.price_0);
      price_1.push(obs.price_1);
      price_2.push(obs.price_2);
      price_3.push(obs.price_3);
      price_4.push(obs.price_4);
      price_5.push(obs.price_5);
      price_6.push(obs.price_6);
      price_7.push(obs.price_7);
      price_8.push(obs.price_8);
      price_9.push(obs.price_9);
      price_10.push(obs.price_10);
    }

    var minPrice = Math.min.apply(null, [
      price_0[0],
      price_1[0],
      price_2[0],
      price_3[0],
      price_4[0],
      price_5[0],
      price_6[0],
      price_7[0],
      price_8[0],
      price_9[0],
      price_10[0],
    ]);
    var maxPrice = Math.max.apply(null, [
      price_0[0],
      price_1[0],
      price_2[0],
      price_3[0],
      price_4[0],
      price_5[0],
      price_6[0],
      price_7[0],
      price_8[0],
      price_9[0],
      price_10[0],
    ]);

    // Initialize Highcharts
    Highcharts.chart("FX_Forecast", {
      chart: {
        height: 350,
        type: "line",
      },
      title: {
        text: titleHTML,
        useHTML: true,
        style: {
          fontSize: "1.2em",
        },
      },
      yAxis: {
        title: {
          text: "Quality Price",
        },
        min: minPrice - 0.01,
        max: maxPrice + 0.01,
        labels: {
          format: "{value:.2f}",
        },
      },
      xAxis: {
        categories: [
          "Today",
          "Day 1",
          "Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
          "Day 8",
          "Day 9",
          "Day 10",
        ],
      },
      series: [
        {
          name: "Forecast",
          data: [
            price_0[0],
            price_1[0],
            price_2[0],
            price_3[0],
            price_4[0],
            price_5[0],
            price_6[0],
            price_7[0],
            price_8[0],
            price_9[0],
            price_10[0],
          ],
          type: "spline",
          dashStyle: "Solid",
          color: "#40ca16",
          lineWidth: 3,
          marker: {
            enabled: false,
          },
          zones: [
            {
              value: price_0[0] - 0.001,
              color: "#fd2b2b",
            },
            {
              color: "#40ca16",
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Failed to create chart:", error);
  }
};

const ChartComponent = () => {
  const [data, setData] = useState<DataItem[] | null>(null);
  const [selectedPair, setSelectedPair] = useState("USDNOK");

  useEffect(() => {
    fetchForecastData().then(setData).catch(console.error);
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filteredData = data.filter(
        (item: { pair: string }) => item.pair === selectedPair
      );
      createForecastChart(filteredData, selectedPair);
    }
  }, [data, selectedPair]);

  return (
    <div className="wrapper">
      <select
        id="forecastMenu"
        value={selectedPair}
        onChange={(e) => setSelectedPair(e.target.value)}
        className="mb-4" // Tailwind CSS margin-bottom utility
      >
        {data &&
          Array.from(new Set(data.map((item) => item.pair))).map((pair) => (
            <option key={pair} value={pair}>{`${pair.substring(
              0,
              3
            )}/${pair.substring(3)}`}</option>
          ))}
      </select>
      <div id="FX_Forecast"></div>
    </div>
  );
};

export default ChartComponent;*/
