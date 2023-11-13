"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number }[] }[];

type CheckboxStates = {
  [key: string]: boolean;
};

interface BiomassProps {
  darkMode: boolean;
}

// Define a type for the API data items
type ApiDataItem = {
  Biomasse_tonn: number;
  Eksportert_kvantum_tonn: number;
  Eksportert_verdi_mill_kr: number;
  Utsatt_fisk_mill: number;
  Fôrforbruk_tonn: number;
  Date: string;
};

const Biomass: React.FC<BiomassProps> = ({ darkMode }) => {
  const [chartData, setChartData] = React.useState<ChartSeries | null>(null);
  const seriesColors = ["#4895EF", "#FF5733", "#C70039", "#900C3F", "#581845"];
  //To check the entire <li>
  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({
    "2020": false,
    "2021": false,
    "2022": false,
    "2023": false,
  });
  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBiomassOpen, setIsBiomassOpen] = useState(false);
  const [isKvantumOpen, setIsKvantumOpen] = useState(false);
  const [isForforbrukOpen, setIsForforbrukOpen] = useState(false);
  const [isVerdiOpen, setIsVerdiOpen] = useState(false);
  const [isUtsattFiskOpen, setIsUtsattFiskOpen] = useState(false);

  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(
    new Set()
  );

  // State for managing selected years for each property
  const [selectedYears, setSelectedYears] = useState({
    Biomasse_tonn: new Set<string>(),
    Eksportert_kvantum_tonn: new Set<string>(),
    Eksportert_verdi_mill_kr: new Set<string>(),
    Utsatt_fisk_mill: new Set<string>(),
    Fôrforbruk_tonn: new Set<string>(),
  });

  type PropertyKey = keyof typeof selectedYears;

  // Function to toggle property selection
  const togglePropertySelection = (propertyKey: string, isOpening: boolean) => {
    setSelectedProperties((prevSelectedProperties) => {
      const newSelectedProperties = new Set(prevSelectedProperties);
      if (isOpening) {
        newSelectedProperties.add(propertyKey);
      } else {
        newSelectedProperties.delete(propertyKey);
      }
      return newSelectedProperties;
    });
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle based on previous state
  };

  // Function to toggle checkbox state
  const toggleCheckbox = (propertyKey: PropertyKey, year: string) => {
    setSelectedYears((prevYears) => {
      const newYears = new Set(prevYears[propertyKey as PropertyKey]); // Type assertion here
      if (newYears.has(year)) {
        newYears.delete(year);
      } else {
        newYears.add(year);
      }
      return { ...prevYears, [propertyKey]: newYears };
    });
  };

  const toggleBiomassDropdown = () => {
    setIsBiomassOpen((prevState) => {
      togglePropertySelection("Biomasse_tonn", !prevState);
      return !prevState;
    });
    setIsKvantumOpen(false);
    setIsForforbrukOpen(false);
    setIsVerdiOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleKvantumDropdown = () => {
    setIsKvantumOpen((prevState) => {
      togglePropertySelection("Eksportert_kvantum_tonn", !prevState);
      return !prevState;
    });
    setIsBiomassOpen(false);
    setIsForforbrukOpen(false);
    setIsVerdiOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleForforbrukDropdown = () => {
    setIsForforbrukOpen((prevState) => {
      togglePropertySelection("Fôrforbruk_tonn", !prevState);
      return !prevState;
    });
    setIsBiomassOpen(false);
    setIsKvantumOpen(false);
    setIsVerdiOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleVerdiDropdown = () => {
    setIsVerdiOpen((prevState) => {
      togglePropertySelection("Eksportert_verdi_mill_kr", !prevState);
      return !prevState;
    });
    setIsBiomassOpen(false);
    setIsKvantumOpen(false);
    setIsForforbrukOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleUtsattFiskDropdown = () => {
    setIsUtsattFiskOpen((prevState) => {
      const propertyKey = "Utsatt_fisk_mill";
      togglePropertySelection(propertyKey, !prevState);
      return !prevState;
    });
    // Close other dropdowns
    setIsBiomassOpen(false);
    setIsKvantumOpen(false);
    setIsForforbrukOpen(false);
    setIsVerdiOpen(false);
  };

  // Function to update chart data
  const updateChartData = (data: ApiDataItem[]) => {
    const chartSeries: ChartSeries = [];

    selectedProperties.forEach((propertyKey) => {
      const yearsSet = selectedYears[propertyKey as PropertyKey]; // Type assertion here
      if (yearsSet.size > 0) {
        const propertyData = data
          .filter((item) =>
            yearsSet.has(new Date(item.Date).getFullYear().toString())
          )
          .map((item) => ({
            x: new Date(item.Date).getTime(),
            y: Number(item[propertyKey as keyof ApiDataItem]), // Type assertion here
          }));

        if (propertyData.length > 0) {
          chartSeries.push({ name: propertyKey, data: propertyData });
        }
      }
    });

    setChartData(chartSeries);
    console.log("Selected Properties:", selectedProperties);
    console.log("Selected Years:", selectedYears);
    console.log("Chart Series:", chartSeries);
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
      height: 355,
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

  return (
    <div
      className={`w-full h-auto relative ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      <div className="absolute left-0 text-3xl font-light ml-4 mt-4 z-10">
        BIOMASS
      </div>
      <div className="absolute z-10 right-0">
        <div className="">
          <button
            id="multiLevelDropdownButton"
            onClick={toggleDropdown}
            data-dropdown-toggle="multi-dropdown"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Dropdown button{" "}
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
          {/* <!-- Dropdown menu --> */}
          <div
            id="multi-dropdown"
            className={`z-10 ${
              isDropdownOpen ? "" : "hidden"
            } bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700`}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="multiLevelDropdownButton"
            >
              <li>
                <button
                  id="doubleDropdownButton"
                  onClick={toggleBiomassDropdown}
                  data-dropdown-toggle="doubleDropdown"
                  data-dropdown-placement="right-start"
                  type="button"
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-2.5 h-2.5 mr-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 1 -4 4 4 4"
                    />
                  </svg>
                  Biomasse
                </button>
                <div
                  id="doubleDropdown"
                  className={`z-10 ${
                    isBiomassOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}
                  style={{ top: "20%", right: "100%" }}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() => toggleCheckbox("Biomasse_tonn", year)} // Pass both property key and year
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={year}
                            type="checkbox"
                            checked={selectedYears["Biomasse_tonn"].has(year)}
                            onChange={() =>
                              toggleCheckbox("Biomasse_tonn", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
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
              <li>
                <button
                  id="doubleDropdownButton"
                  onClick={toggleForforbrukDropdown}
                  data-dropdown-toggle="doubleDropdown"
                  data-dropdown-placement="right-start"
                  type="button"
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-2.5 h-2.5 mr-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 1 -4 4 4 4"
                    />
                  </svg>
                  Forforbruk
                </button>
                <div
                  id="doubleDropdown"
                  className={`z-10 ${
                    isForforbrukOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}
                  style={{ top: "36%", right: "100%" }}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() => toggleCheckbox("Fôrforbruk_tonn", year)} // Pass both property key and year
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={year}
                            type="checkbox"
                            checked={selectedYears["Fôrforbruk_tonn"].has(year)}
                            onChange={() =>
                              toggleCheckbox("Fôrforbruk_tonn", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
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
              <li>
                <button
                  id="doubleDropdownButton"
                  onClick={toggleKvantumDropdown}
                  data-dropdown-toggle="doubleDropdown"
                  data-dropdown-placement="right-start"
                  type="button"
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-2.5 h-2.5 mr-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 1 -4 4 4 4"
                    />
                  </svg>
                  Eks. Kvantum
                </button>
                <div
                  id="doubleDropdown"
                  className={`z-10 ${
                    isKvantumOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}
                  style={{ top: "50%", right: "100%" }}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() =>
                          toggleCheckbox("Eksportert_kvantum_tonn", year)
                        } // Pass both property key and year
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={year}
                            type="checkbox"
                            checked={selectedYears[
                              "Eksportert_kvantum_tonn"
                            ].has(year)}
                            onChange={() =>
                              toggleCheckbox("Eksportert_kvantum_tonn", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
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
              <li>
                <button
                  id="doubleDropdownButton"
                  onClick={toggleVerdiDropdown}
                  data-dropdown-toggle="doubleDropdown"
                  data-dropdown-placement="right-start"
                  type="button"
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-2.5 h-2.5 mr-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 1 -4 4 4 4"
                    />
                  </svg>
                  Eks. verdi
                </button>
                <div
                  id="doubleDropdown"
                  className={`z-10 ${
                    isVerdiOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}
                  style={{ top: "66%", right: "100%" }}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() =>
                          toggleCheckbox("Eksportert_verdi_mill_kr", year)
                        } // Pass both property key and year
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={year}
                            type="checkbox"
                            checked={selectedYears[
                              "Eksportert_verdi_mill_kr"
                            ].has(year)}
                            onChange={() =>
                              toggleCheckbox("Eksportert_verdi_mill_kr", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
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
              <li>
                <button
                  id="doubleDropdownButton"
                  onClick={toggleUtsattFiskDropdown}
                  data-dropdown-toggle="doubleDropdown"
                  data-dropdown-placement="right-start"
                  type="button"
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-2.5 h-2.5 mr-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 1 -4 4 4 4"
                    />
                  </svg>
                  Utsatt Fisk
                </button>
                <div
                  id="doubleDropdown"
                  className={`z-10 ${
                    isUtsattFiskOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}
                  style={{ top: "81%", right: "100%" }}
                >
                  <ul>
                    {Object.keys(checkboxStates).map((year) => (
                      <li
                        key={year}
                        onClick={() => toggleCheckbox("Utsatt_fisk_mill", year)} // Pass both property key and year
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={year}
                            type="checkbox"
                            checked={selectedYears["Utsatt_fisk_mill"].has(
                              year
                            )}
                            onChange={() =>
                              toggleCheckbox("Utsatt_fisk_mill", year)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
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
            </ul>
          </div>
        </div>
      </div>
      {chartData ? (
        <div className="flex flex-col items-start mt-4 ml-1">
          <div className="relative w-full">
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
