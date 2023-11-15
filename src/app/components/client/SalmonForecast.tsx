"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number }[] }[];

interface Props {
  darkMode: boolean;
}

const SalmonForecast: React.FC<Props> = ({ darkMode }) => {
  const [chartData, setChartData] = React.useState<ChartSeries | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dailyForecast");
        const data = await response.json();
        processChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processChartData = (data: any) => {
      const usdNokData = data.find((item: any) => item.pair === "USDNOK");
      const eurNokData = data.find((item: any) => item.pair === "EURNOK");

      const usdNokSeries = Object.keys(usdNokData)
        .filter((key) => key.startsWith("date_"))
        .map((key, index) => {
          return {
            x: new Date(usdNokData[key]).getTime(),
            y: usdNokData[`price_${index}`],
          };
        });

      const eurNokSeries = Object.keys(eurNokData)
        .filter((key) => key.startsWith("date_"))
        .map((key, index) => {
          return {
            x: new Date(eurNokData[key]).getTime(),
            y: eurNokData[`price_${index}`],
          };
        });

      setChartData([
        { name: "USDNOK", data: usdNokSeries },
        { name: "EURNOK", data: eurNokSeries },
      ]);
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

  const optionsUSDNOK = {
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
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        lineWidth: 3,
      },
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
      gridLineColor: darkMode ? "" : "",
      title: {
        text: "",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      range: 0.1,
      labels: {
        format: "{value:.2f}",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: chartData
      ?.filter((series) => series.name === "USDNOK")
      .map((series) => ({
        ...series,
        type: "spline",
        color: darkMode ? "#40ca16" : "#40ca16",
        marker: {
          enabled: false,
        },
        zones: [
          {
            value: series.data[0]?.y - 0.001,
            color: darkMode ? "#ff4545" : "#fd2b2b",
          },
          {
            color: darkMode ? "#40ca16" : "#40ca16",
          },
        ],
      })),
  };

  const [isBiomasseChecked, setIsBiomasseChecked] = useState(false);

  const handleBiomasseChange = () => {
    setIsBiomasseChecked(!isBiomasseChecked);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className={`w-full h-auto relative ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      <div className="absolute z-20 left-0 mt-[-40px]">
        <button
          id="multiLevelDropdownButton"
          onClick={toggleDropdown}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Dropdown{" "}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div
            id="multi-dropdown"
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded shadow-md mt-2 p-2"
          >
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={isBiomasseChecked}
                onChange={handleBiomasseChange}
              />
              <span className="ml-2 text-sm font-medium">Biomasse</span>
            </label>
          </div>
        )}
      </div>
      <div className="mt-14">
        {chartData ? (
          <div className="flex flex-col items-start mt-8 ml-1">
            <div className="relative w-full">
              <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-2xl">
                SALMON FORECAST
              </div>
              <div>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={optionsUSDNOK}
                />
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

export default SalmonForecast;
