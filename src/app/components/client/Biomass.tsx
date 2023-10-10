"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number }[] }[];

interface BiomassProps {
  darkMode: boolean;
}

const Biomass: React.FC<BiomassProps> = ({ darkMode }) => {
  const [chartData, setChartData] = React.useState<ChartSeries | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/productionNumbers");
        const data = await response.json();
        processChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processChartData = (data: any) => {
      const biomassSeries = data.map((item: any) => {
        return [new Date(item.Date).getTime(), item.Biomasse_tonn];
      });

      setChartData([{ name: "Biomasse_tonn", data: biomassSeries }]);
    };

    fetchData();
  }, []);

  const biomasseData = {
    chart: {
      height: 255,
      backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
    },
    title: {
      text: "",
      style: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        lineWidth: 3,
      },
    },
    rangeSelector: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      text: "ff",
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    yAxis: {
      gridLineColor: darkMode ? "#333333" : "",
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      title: {
        text: "",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: chartData
      ? chartData.map((seriesItem: any) => ({
          ...seriesItem,
          type: "spline",
          color: "#4895EF",
          marker: {
            enabled: false,
          },
        }))
      : [],
  };

  return (
    <div
      className={`w-full h-auto ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      {chartData ? (
        <div className="flex flex-col items-start mt-4 ml-1">
          <div className="relative w-full">
            <div className="absolute top-1 left-16 transform[-50%,-50%] z-10 text-2xl">
              BIOMASS
            </div>
            <div>
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={biomasseData}
              />
            </div>
          </div>
        </div>
      ) : (
        "Loading data..."
      )}
    </div>
  );
};

export default Biomass;
