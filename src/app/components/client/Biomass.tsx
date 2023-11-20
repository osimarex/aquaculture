"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number | null }[] }[];

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
    "2019": false,
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

  // State for managing selected years for each property
  const [selectedYears, setSelectedYears] = useState({
    Biomasse_tonn: new Set(["2021", "2022", "2023"]), // Directly initializing with desired years
    Eksportert_kvantum_tonn: new Set<string>(),
    Eksportert_verdi_mill_kr: new Set<string>(),
    Utsatt_fisk_mill: new Set<string>(),
    Fôrforbruk_tonn: new Set<string>(),
  });

  // Initialize selected properties with Biomasse_tonn
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(
    new Set(["Biomasse_tonn"])
  );

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

  const toggleBiomassYearDropdown = () => {
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
      text: "ff",
      labels: {
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

  const selectBiomasseTonnData = () => {
    // Update selected years specifically for Biomasse_tonn
    setSelectedYears((prevYears) => ({
      ...prevYears,
      Biomasse_tonn: new Set(["2021", "2022", "2023"]),
    }));

    // Update selected properties to include only Biomasse_tonn
    setSelectedProperties(new Set(["Biomasse_tonn"]));
  };

  const selectBiomasseEverythingData = () => {
    // Update selected years specifically for Biomasse_tonn
    setSelectedYears((prevYears) => ({
      ...prevYears,
      Biomasse_tonn: new Set([
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
      ]),
    }));

    // Update selected properties to include only Biomasse_tonn
    setSelectedProperties(new Set(["Biomasse_tonn"]));
  };

  const selectForforbrukData = () => {
    // Update selected years specifically for Biomasse_tonn
    setSelectedYears((prevYears) => ({
      ...prevYears,
      Fôrforbruk_tonn: new Set(["2021", "2022", "2023"]),
    }));

    // Update selected properties to include only Biomasse_tonn
    setSelectedProperties(new Set(["Fôrforbruk_tonn"]));
  };

  const selectKvantumData = () => {
    // Update selected years specifically for Biomasse_tonn
    setSelectedYears((prevYears) => ({
      ...prevYears,
      Eksportert_kvantum_tonn: new Set(["2021", "2022", "2023"]),
    }));

    // Update selected properties to include only Biomasse_tonn
    setSelectedProperties(new Set(["Eksportert_kvantum_tonn"]));
  };

  const selectVerdiData = () => {
    // Update selected years specifically for Biomasse_tonn
    setSelectedYears((prevYears) => ({
      ...prevYears,
      Eksportert_verdi_mill_kr: new Set(["2021", "2022", "2023"]),
    }));

    // Update selected properties to include only Biomasse_tonn
    setSelectedProperties(new Set(["Eksportert_verdi_mill_kr"]));
  };

  const selectUtsattFiskData = () => {
    // Update selected years specifically for Biomasse_tonn
    setSelectedYears((prevYears) => ({
      ...prevYears,
      Utsatt_fisk_mill: new Set(["2021", "2022", "2023"]),
    }));

    // Update selected properties to include only Biomasse_tonn
    setSelectedProperties(new Set(["Utsatt_fisk_mill"]));
  };

  // Ensure this function is called when the Biomasse button is clicked

  return (
    <div
      className={`w-full h-auto relative ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      <div className="mt-8">
        <div className="absolute left-0 text-2xl font-normal ml-4 mt-14 z-10">
          PRODUCTION NUMBERS
        </div>
        <div className="absolute left-0 ml-4 z-10">
          <ul className="flex list-none">
            <li>
              <button
                id="multiLevelDropdownButton"
                onClick={toggleBiomassDropdown}
                data-dropdown-toggle="multi-dropdown"
                className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
              >
                Biomasse {/* SVG icon here */}
              </button>
              <div
                id="doubleDropdown"
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
                          id={year}
                          type="checkbox"
                          checked={selectedYears["Biomasse_tonn"].has(year)}
                          onChange={() => toggleCheckbox("Biomasse_tonn", year)}
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
                id="multiLevelDropdownButton"
                onClick={toggleForforbrukDropdown}
                data-dropdown-toggle="multi-dropdown"
                className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
              >
                Forforbruk {/* SVG icon here */}
              </button>
              <div
                id="doubleDropdown"
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
                          id={year}
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
                id="multiLevelDropdownButton"
                onClick={toggleKvantumDropdown}
                data-dropdown-toggle="multi-dropdown"
                className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
              >
                Kvantum {/* SVG icon here */}
              </button>
              <div
                id="doubleDropdown"
                className={`z-30 ${
                  isKvantumOpen ? "" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700 relative`}
              >
                <ul>
                  {Object.keys(checkboxStates).map((year) => (
                    <li
                      key={year}
                      onClick={() =>
                        toggleCheckbox("Eksportert_kvantum_tonn", year)
                      }
                    >
                      <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input
                          id={year}
                          type="checkbox"
                          checked={selectedYears["Eksportert_kvantum_tonn"].has(
                            year
                          )}
                          onChange={() =>
                            toggleCheckbox("Eksportert_kvantum_tonn", year)
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
                id="multiLevelDropdownButton"
                onClick={toggleVerdiDropdown}
                data-dropdown-toggle="multi-dropdown"
                className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
              >
                Verdi {/* SVG icon here */}
              </button>
              <div
                id="doubleDropdown"
                className={`z-30 ${
                  isVerdiOpen ? "" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700 relative`}
              >
                <ul>
                  {Object.keys(checkboxStates).map((year) => (
                    <li
                      key={year}
                      onClick={() =>
                        toggleCheckbox("Eksportert_verdi_mill_kr", year)
                      }
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
                id="multiLevelDropdownButton"
                onClick={toggleUtsattFiskDropdown}
                data-dropdown-toggle="multi-dropdown"
                className="text-white bg-[#02273B] hover:bg-black dark:bg-[#ffff] dark:hover:bg-slate-300 dark:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
              >
                Utsatt Fisk {/* SVG icon here */}
              </button>
              <div
                id="doubleDropdown"
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
                          id={year}
                          type="checkbox"
                          checked={selectedYears["Utsatt_fisk_mill"].has(year)}
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
  );
};

export default Biomass;
