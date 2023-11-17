"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number }[] }[];

interface Props {
  darkMode: boolean;
}

const SalmonForecast: React.FC<Props> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartSeries | null>(null);
  const [weekNumbers, setWeekNumbers] = useState<string[]>([]);

  const [currentMonthPrice, setCurrentMonthPrice] = useState<number | null>(
    null
  );
  // const [chartData, setChartData] = useState<ChartSeries>([]);

  useEffect(() => {
    const fetchForwardPrices = async () => {
      try {
        const response = await fetch("/api/historicFuturePrices");
        const prices = await response.json();
        const latestPriceData = prices[prices.length - 1];
        setCurrentMonthPrice(latestPriceData["0"]);
      } catch (error) {
        console.error("Error fetching forward prices:", error);
      }
    };

    fetchForwardPrices();
  }, []);

  const handleFirstChange = () => {
    // Toggle the checkbox state
    setIsFirstChecked((prevIsFirstChecked) => {
      // If we are now checking the box, add the series
      if (!prevIsFirstChecked && currentMonthPrice !== null) {
        setChartData((prevChartData) => {
          if (prevChartData) {
            const currentMonthSeries = {
              name: "Current Month Price",
              data: weekNumbers.map((_, index) => ({
                x: index,
                y: currentMonthPrice,
              })),
              type: "line",
              dashStyle: "Dash",
              color: "#ff0000",
            };
            // Ensure we don't add the series again if it already exists
            if (
              !prevChartData.some(
                (series) => series.name === "Current Month Price"
              )
            ) {
              return [...prevChartData, currentMonthSeries];
            }
          }
          return prevChartData;
        });
      }

      // If we are now unchecking the box, remove the series
      if (prevIsFirstChecked) {
        setChartData((prevChartData) => {
          // Check if prevChartData is not null and filter
          return prevChartData
            ? prevChartData.filter(
                (series) => series.name !== "Current Month Price"
              )
            : prevChartData;
        });
      }

      return !prevIsFirstChecked;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/salmonForecast");
        const data = await response.json();
        processChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processChartData = (data: any[]) => {
      const weekLabels: string[] = []; // For x-axis labels

      const currentWeek = getCurrentWeekNumber();

      const seriesData = data.map((item, index) => {
        let weekNumber = currentWeek + index;
        if (weekNumber > 52) {
          weekNumber = weekNumber % 52;
        }

        const price = parseFloat(item.forecasted_price.trim());

        // Create a label for the x-axis
        const weekLabel = `${weekNumber === 0 ? 52 : weekNumber}`;
        weekLabels.push(weekLabel);

        return { x: index, y: price };
      });

      setChartData([{ name: "Salmon Price", data: seriesData }]);
      setWeekNumbers(weekLabels);
    };

    // Example function to get the current week number - replace with your actual logic
    const getCurrentWeekNumber = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000; // Convert to milliseconds
      return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      Highcharts.theme = {
        colors: ["#DDDF0D"],
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
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        lineWidth: 3,
      },
    },
    xAxis: {
      categories: weekNumbers,
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
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
      ? chartData.map((series) => ({
          ...series,
          type: "spline",
          color: "#40ca16",
          marker: {
            enabled: false,
          },
        }))
      : [],
  };

  const [isFirstChecked, setIsFirstChecked] = useState(false);

  const [isSecondChecked, setIsSecondChecked] = useState(false);

  const handleSecondChange = () => {
    setIsSecondChecked(!isSecondChecked);
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
      <div className="absolute z-20 left-0 mt-[-50px]">
        <button
          id="multiLevelDropdownButton"
          onClick={toggleDropdown}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Contracts
          <svg
            className="w-2.5 h-2.5 ml-3"
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
                checked={isFirstChecked}
                onChange={handleFirstChange}
              />
              <span className="ml-2 text-sm font-medium">1st Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={isSecondChecked}
                onChange={handleSecondChange}
              />
              <span className="ml-2 text-sm font-medium">2nd Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={isSecondChecked}
                onChange={handleSecondChange}
              />
              <span className="ml-2 text-sm font-medium">3rd Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={isSecondChecked}
                onChange={handleSecondChange}
              />
              <span className="ml-2 text-sm font-medium">4th Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={isSecondChecked}
                onChange={handleSecondChange}
              />
              <span className="ml-2 text-sm font-medium">Q1</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={isSecondChecked}
                onChange={handleSecondChange}
              />
              <span className="ml-2 text-sm font-medium">Q2</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={isSecondChecked}
                onChange={handleSecondChange}
              />
              <span className="ml-2 text-sm font-medium">Q3</span>
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

export default SalmonForecast;
