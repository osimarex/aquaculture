"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartPaperSeries = {
  name: string;
  data: { x: number; y: number }[];
}[];

interface PropsPaper {
  darkMode: boolean;
}

const PaperForecast: React.FC<PropsPaper> = ({ darkMode }) => {
  const [chartPaperData, setChartPaperData] = useState<ChartPaperSeries | null>(
    null
  );
  const [weekPaperNumbers, setWeekPaperNumbers] = useState<string[]>([]);

  useEffect(() => {
    const fetchPaperData = async () => {
      try {
        const response = await fetch("/api/salmonForecast");
        const data = await response.json();
        processChartPaperData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processChartPaperData = (data: any[]) => {
      const weekPaperNumbers: number[] = data.map((item) =>
        parseInt(item.week.trim(), 10)
      );
      const uniqueWeekPaperNumbers = Array.from(new Set(weekPaperNumbers));

      const seriesData = data.map((item) => {
        const weekPaperNumber = parseInt(item.week.trim(), 10);
        const weekIndex = uniqueWeekPaperNumbers.indexOf(weekPaperNumber);
        const price = parseFloat(item.forecasted_price.trim());
        return { x: weekIndex, y: price };
      });

      const additionalSeries = [
        { startWeek: 48, endWeek: 1, price: 85.5, name: "1st Month" },
        { startWeek: 1, endWeek: 5, price: 106.1, name: "2nd Month" },
        { startWeek: 1, endWeek: 14, price: 109.1, name: "Q1" },
        { startWeek: 14, endWeek: 22, price: 112.3, name: "Q2" },
      ].map((item) => {
        const startIndex = uniqueWeekPaperNumbers.indexOf(item.startWeek);
        const endIndex = uniqueWeekPaperNumbers.indexOf(item.endWeek);
        return {
          name: item.name,
          data: [
            { x: startIndex, y: item.price },
            { x: endIndex, y: item.price },
          ],
        };
      });

      setChartPaperData([
        { name: "Salmon Price", data: seriesData },
        ...additionalSeries.map((series, index) => ({
          ...series,
          color: "#40ca16",
        })),
      ]);
      setWeekPaperNumbers(uniqueWeekPaperNumbers.map(String));
    };

    fetchPaperData();
  }, []);

  const options = {
    chart: {
      height: 380,
      backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
    },
    title: {
      text: "",
      style: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    xAxis: {
      categories: weekPaperNumbers,
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    plotOptions: {
      series: {
        lineWidth: 3,
      },
    },
    legend: {
      itemStyle: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    yAxis: {
      gridLineColor: darkMode ? "#333333" : "#ededed",
      title: {
        text: "",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },

    credits: {
      enabled: false,
    },
    series: chartPaperData?.map((series) => ({
      ...series,
      type: "spline",
      marker: {
        enabled: false,
      },
    })),
  };

  return (
    <div
      className={`w-full h-auto relative ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      <div className="mt-14">
        {chartPaperData ? (
          <div className="flex flex-col items-start mt-8 ml-1">
            <div className="relative w-full">
              <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-2xl">
                FORWARD PRICE
              </div>
              <div>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
            </div>
          </div>
        ) : (
          "Loading data..."
        )}
      </div>
    </div>
  );
};

export default PaperForecast;
