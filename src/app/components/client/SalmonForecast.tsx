"use client";

import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = {
  [x: string]: any;
  name: string;
  data: { x: number; y: number }[];
}[];

interface Props {
  darkMode: boolean;
}

type CheckedStatesType = {
  isFirstChecked: boolean;
  isSecondChecked: boolean;
  isThirdChecked: boolean;
  isFourthChecked: boolean;
  isQ1Checked: boolean;
  isQ2Checked: boolean;
  isQ3Checked: boolean;
  isQ4Checked: boolean;
};

const SalmonForecast: React.FC<Props> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartSeries | null>(null);
  const [weekNumbers, setWeekNumbers] = useState<string[]>([]);
  const [selectedContractTypes, setSelectedContractTypes] = useState<string[]>(
    []
  );
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [checkedStates, setCheckedStates] = useState<CheckedStatesType>({
    isFirstChecked: false,
    isSecondChecked: false,
    isThirdChecked: false,
    isFourthChecked: false,
    isQ1Checked: false,
    isQ2Checked: false,
    isQ3Checked: false,
    isQ4Checked: false,
  });

  useEffect(() => {
    const fetchForwardPrices = async () => {
      try {
        const response = await fetch("/api/historicFuturePrices");
        const priceData = await response.json();
        const latestPriceData = priceData[priceData.length - 1];
        setPrices(latestPriceData); // Store the latest prices
      } catch (error) {
        console.error("Error fetching forward prices:", error);
      }
    };
    fetchForwardPrices();
  }, []);

  // The logic for handleCheckboxChange function
  const handleCheckboxChange = (
    checkboxName: keyof CheckedStatesType,
    priceKey: string,
    contractText: string
  ) => {
    setCheckedStates((prevStates) => {
      const isChecked = !prevStates[checkboxName];
      const newState = { ...prevStates, [checkboxName]: isChecked };

      setChartData((prevChartData) => {
        if (!prevChartData) {
          prevChartData = [];
        }

        const existingIndex = prevChartData.findIndex(
          (series) => series.name === `${contractText} Price`
        );

        if (isChecked) {
          if (existingIndex === -1) {
            // Add series if it doesn't already exist
            const price = prices[priceKey];
            if (price !== null) {
              const newSeries = {
                name: `${contractText} Price`,
                data: weekNumbers.map((_, index) => ({ x: index, y: price })),
                type: "line",
                dashStyle: "Dash",
                color: "#38B6FF", // Default color for contract series
                isContractSeries: true, // Custom property to identify contract series
              };
              return [...prevChartData, newSeries];
            }
          }
        } else {
          // Remove series if it exists
          if (existingIndex !== -1) {
            return prevChartData.filter((_, index) => index !== existingIndex);
          }
        }

        return prevChartData;
      });

      // Update selected contract types
      setSelectedContractTypes((prev) => {
        if (isChecked) {
          return prev.includes(contractText) ? prev : [...prev, contractText];
        } else {
          return prev.filter((type) => type !== contractText);
        }
      });

      return newState;
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
      // Extract week numbers and remove duplicates
      const weekNumbers = data.map((item) => item.week.trim());
      const uniqueWeekNumbers = Array.from(new Set(weekNumbers)); // Convert Set to Array

      const seriesData = data.map((item) => {
        const weekNumber = item.week.trim();
        const weekIndex = uniqueWeekNumbers.indexOf(weekNumber); // Find the index of the week number
        const price = parseFloat(item.forecasted_price.trim());
        return { x: weekIndex, y: price }; // Use the index as the x value
      });

      setChartData([{ name: "Salmon Price", data: seriesData }]);
      setWeekNumbers(uniqueWeekNumbers); // Use this for the x-axis categories
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
          text: darkMode ? "#ffffff" : "#000000",
        },
      },
      labels: {
        format: "{value:.2f}",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    series: chartData
      ? chartData.map((series) => {
          // Check if the series is for Salmon Price or a contract
          if (series.name === "Salmon Price") {
            return {
              ...series,
              type: "spline",
              color: "#40ca16", // Green color for the forecast line
              marker: {
                enabled: false,
              },
            };
          } else {
            return {
              ...series,
              type: "spline",
              color: "#38B6FF", // Blue color for contract lines
              dashStyle: "Dash",
              marker: {
                enabled: false,
              },
            };
          }
        })
      : [],
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownButton = document.getElementById(
        "multiLevelDropdownButton"
      );

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        (!dropdownButton || !dropdownButton.contains(event.target as Node))
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
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
        {selectedContractTypes.map((type, index) => (
          <span
            key={index}
            className="bg-[#38B6FF] rounded-xl text-white p-2 text-sm ml-2 mb-2 inline-flex items-center"
          >
            {type}
            <button
              className="ml-2"
              onClick={() => {
                // Remove the contract type from the selectedContractTypes
                setSelectedContractTypes((prev) =>
                  prev.filter((t) => t !== type)
                );

                // Also, update the chartData to remove the series related to this contract type
                setChartData((prevChartData) => {
                  if (prevChartData) {
                    return prevChartData.filter(
                      (series) => series.name !== `${type} Price`
                    );
                  }
                  return [];
                });
              }}
            >
              x
            </button>
          </span>
        ))}

        {isDropdownOpen && (
          <div
            id="multi-dropdown"
            ref={dropdownRef}
            className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded shadow-md mt-2 p-2"
          >
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("1st Month")}
                onChange={() =>
                  handleCheckboxChange("isFirstChecked", "0", "1st Month")
                }
              />
              <span className="ml-2 text-sm font-medium">1st Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("2nd Month")}
                onChange={() =>
                  handleCheckboxChange("isSecondChecked", "1", "2nd Month")
                }
              />
              <span className="ml-2 text-sm font-medium">2nd Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("3rd Month")}
                onChange={() =>
                  handleCheckboxChange("isThirdChecked", "2", "3rd Month")
                }
              />
              <span className="ml-2 text-sm font-medium">3rd Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("4th Month")}
                onChange={() =>
                  handleCheckboxChange("isFourthChecked", "3", "4th Month")
                }
              />
              <span className="ml-2 text-sm font-medium">4th Month</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("Q1")}
                onChange={() => handleCheckboxChange("isQ1Checked", "4", "Q1")}
              />
              <span className="ml-2 text-sm font-medium">Q1</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("Q2")}
                onChange={() => handleCheckboxChange("isQ2Checked", "5", "Q2")}
              />
              <span className="ml-2 text-sm font-medium">Q2</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("Q3")}
                onChange={() => handleCheckboxChange("isQ3Checked", "6", "Q3")}
              />
              <span className="ml-2 text-sm font-medium">Q3</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                checked={selectedContractTypes.includes("Q4")}
                onChange={() => handleCheckboxChange("isQ4Checked", "12", "Q4")}
              />
              <span className="ml-2 text-sm font-medium">Q4</span>
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
