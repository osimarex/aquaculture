"use client";

import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Flex, Text, Button, DropdownMenu } from "@radix-ui/themes";
import { CaretDownIcon } from "@radix-ui/react-icons";

type ChartSeries = { name: string; data: { x: number; y: number | null }[] }[];

type CheckboxStates = {
  [key: string]: boolean;
};

interface BiomassProps {
  darkMode: boolean;
}

type ApiDataItem = {
  Biomasse_tonn: number;
  Utsatt_fisk_mill: number;
  Fôrforbruk_tonn: number;
  Date: string;
};

const Biomass: React.FC<BiomassProps> = ({ darkMode }) => {
  const [chartData, setChartData] = React.useState<ChartSeries | null>(null);
  const seriesColors = ["#4895EF", "#FF5733", "#C70039", "#900C3F", "#581845"];

  const toggleDropdown = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prevState) => !prevState);
  };
  //To check the entire <li>
  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({
    "2019": false,
    "2020": false,
    "2021": false,
    "2022": false,
    "2023": false,
  });

  //Get the count of selected options in the dropdown
  const getSelectedCount = (propertyKey: PropertyKey) => {
    return selectedYears[propertyKey].size;
  };
  const formatDropdownLabel = (label: string, propertyKey: PropertyKey) => {
    const count = getSelectedCount(propertyKey);
    return count > 0 ? `${label} (${count})` : label;
  };

  // State to manage dropdown visibility
  const [isBiomassOpen, setIsBiomassOpen] = useState(false);
  const [isForforbrukOpen, setIsForforbrukOpen] = useState(false);
  const [isUtsattFiskOpen, setIsUtsattFiskOpen] = useState(false);

  // State for managing selected years for each property
  const [selectedYears, setSelectedYears] = useState({
    Biomasse_tonn: new Set(["2021", "2022", "2023"]), // Directly initializing with desired years
    Fôrforbruk_tonn: new Set<string>(),
    Utsatt_fisk_mill: new Set<string>(),
  });

  // Initialize selected properties with Biomasse_tonn
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(
    new Set(["Biomasse_tonn"])
  );

  type PropertyKey = keyof typeof selectedYears;

  // Function to toggle checkbox state
  const toggleCheckbox = (propertyKey: PropertyKey, year: string) => {
    setSelectedYears((prevYears) => {
      const newYears = new Set(prevYears[propertyKey]);
      if (newYears.has(year)) {
        newYears.delete(year);
        if (newYears.size === 0) {
          setSelectedProperties((prevProps) => {
            const newProps = new Set(prevProps);
            newProps.delete(propertyKey);
            return newProps;
          });
        }
      } else {
        newYears.add(year);
        setSelectedProperties((prevProps) =>
          new Set(prevProps).add(propertyKey)
        );
      }
      return { ...prevYears, [propertyKey]: newYears };
    });
  };

  const toggleBiomassDropdown = () => {
    toggleDropdown(setIsBiomassOpen);
    setIsForforbrukOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleForforbrukDropdown = () => {
    toggleDropdown(setIsForforbrukOpen);
    setIsBiomassOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleUtsattFiskDropdown = () => {
    toggleDropdown(setIsUtsattFiskOpen);
    setIsBiomassOpen(false);
    setIsForforbrukOpen(false);
  };

  // Function to update chart data
  const updateChartData = (data: ApiDataItem[]) => {
    const chartSeries: ChartSeries = [];

    selectedProperties.forEach((propertyKey) => {
      selectedYears[propertyKey as keyof typeof selectedYears].forEach(
        (year) => {
          const yearlyData = data
            .filter((d) => new Date(d.Date).getFullYear().toString() === year)
            .map((d) => {
              const normalizedDate = new Date(d.Date);
              normalizedDate.setFullYear(2020); // Normalize to a common year, e.g., 2020
              const value = d[propertyKey as keyof ApiDataItem];
              return {
                x: normalizedDate.getTime(),
                y: typeof value === "number" ? value : null,
              };
            });

          if (yearlyData.length > 0) {
            chartSeries.push({
              name: `${propertyKey} ${year}`,
              data: yearlyData,
            });
          }
        }
      );
    });

    setChartData(chartSeries);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/productionNumbers");
        const data = await response.json();
        updateChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedYears, selectedProperties]);

  const biomasseData = {
    chart: {
      height: 440,
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
      labels: {
        formatter: function (
          this: Highcharts.AxisLabelsFormatterContextObject
        ): string {
          // Check if the value is a string and convert it to a number if needed. Removes year from axis.
          const value =
            typeof this.value === "string"
              ? Date.parse(this.value)
              : this.value;
          return Highcharts.dateFormat("%b", value); // Format as 'Jan', 'Feb', etc.
        },
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    yAxis: {
      gridLineColor: darkMode ? "#333333" : "#ededed",
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
      enabled: true,
      itemStyle: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    series: chartData
      ? chartData.map((seriesItem: any, index: any) => ({
          ...seriesItem,
          type: "spline",
          color: seriesColors[index % seriesColors.length],
          marker: {
            enabled: false,
          },
        }))
      : [],
  };

  function onOpenChange(open: boolean) {
    document.body.style.paddingRight = open ? "0px" : "";
  }

  return (
    <DropdownMenu.Root onOpenChange={onOpenChange}>
      <div
        className={`w-full h-auto relative m-0 ${
          darkMode ? "text-white" : "bg-white text-black"
        }`}
      >
        <div className="mt-8">
          <div className="absolute left-0 text-2xl font-normal ml-4 mt-14 z-10">
            PRODUCTION NUMBERS
          </div>
          <div className="absolute left-0 ml-4 z-10">
            <ul className="flex list-none">
              {/* Dropdowns for Biomasse, Forforbruk, Utsatt Fisk */}
              <li>
                <button
                  onClick={toggleBiomassDropdown}
                  className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                  type="button"
                >
                  {formatDropdownLabel("Biomasse", "Biomasse_tonn")}
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
                <div
                  className={`z-30 ${
                    isBiomassOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700 relative`}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() => toggleCheckbox("Biomasse_tonn", year)}
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedYears["Biomasse_tonn"].has(year)}
                            onChange={() =>
                              toggleCheckbox("Biomasse_tonn", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={year}
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {year}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              <li className="ml-4">
                <button
                  onClick={toggleForforbrukDropdown}
                  className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                  type="button"
                >
                  {formatDropdownLabel("Forforbruk", "Fôrforbruk_tonn")}
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
                <div
                  className={`z-30 ${
                    isForforbrukOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700 relative`}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() => toggleCheckbox("Fôrforbruk_tonn", year)}
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedYears["Fôrforbruk_tonn"].has(year)}
                            onChange={() =>
                              toggleCheckbox("Fôrforbruk_tonn", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={year}
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {year}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              <li className="ml-4">
                <button
                  onClick={toggleUtsattFiskDropdown}
                  className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                  type="button"
                >
                  {formatDropdownLabel("Utsatt Fisk", "Utsatt_fisk_mill")}
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
                <div
                  className={`z-30 ${
                    isUtsattFiskOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700 relative`}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() => toggleCheckbox("Utsatt_fisk_mill", year)}
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedYears["Utsatt_fisk_mill"].has(
                              year
                            )}
                            onChange={() =>
                              toggleCheckbox("Utsatt_fisk_mill", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={year}
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {year}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <div className="ml-4">
                <Flex gap="3" align="center">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="soft" size="2">
                        Options
                        <CaretDownIcon width="16" height="16" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content size="2">
                      <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                      <DropdownMenu.Item shortcut="⌘ D">
                        Duplicate
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item shortcut="⌘ N">
                        Archive
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator />
                      <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Flex>
              </div>
            </ul>
          </div>
        </div>
        <div>
          {chartData ? (
            <div className="flex flex-col items-start mt-4 ml-1">
              <div className="relative w-full">
                <div className="mt-20">
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
      </div>
    </DropdownMenu.Root>
  );
};

export default Biomass;
