"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

interface SeriesData {
  name: string;
  data: [number, number][];
}

interface BiomassProps {
  series: SeriesData[];
  darkMode: boolean;
}

const Biomass: React.FC<BiomassProps> = ({ series, darkMode }) => {
  const [chartData, setChartData] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState<any | null>(null);

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

      const minDate = Math.min(...biomassSeries.map((item: any) => item[0]));
      const maxDate = Math.max(...biomassSeries.map((item: any) => item[0]));

      setChartData([{ name: "Biomasse_tonn", data: biomassSeries }]);
      setDateRange({ min: minDate, max: maxDate });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      Highcharts.theme = {
        colors: [
          "#DDDF0D",
          "#7798BF",
          "#55BF3B",
          "#DF5353",
          "#aaeeee",
          "#ff0066",
          "#eeaaee",
          "#55BF3B",
          "#DF5353",
          "#7798BF",
        ],
      };
    } else {
      Highcharts.theme = {
        colors: [
          "#7cb5ec",
          "#434348",
          "#90ed7d",
          "#f7a35c",
          "#8085e9",
          "#f15c80",
          "#e4d354",
          "#2b908f",
          "#f45b5b",
          "#91e8e1",
        ],
      };
    }
    Highcharts.setOptions(Highcharts.theme);
  }, [darkMode]);

  const biomasseData = {
    chart: {
      height: 255,
      backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
    },
    title: {
      style: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      min: dateRange ? dateRange.min : undefined,
      max: dateRange ? dateRange.max : undefined,
    },
    yAxis: {
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    series: chartData
      ? chartData.map((seriesItem: any) => ({
          ...seriesItem,
          type: "line",
        }))
      : [],
  };

  return (
    <div
      className={`w-full h-auto ${
        darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
      }`}
    >
      {chartData ? (
        <div className="flex flex-col items-start mt-4 ml-1">
          <div className="relative w-full">
            <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-2xl">
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
