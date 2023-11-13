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

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle based on previous state
  };

  // Function to toggle checkbox state
  const toggleCheckbox = (checkboxId: string) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [checkboxId]: !prevStates[checkboxId],
    }));
  };

  const toggleBiomassDropdown = () => {
    setIsBiomassOpen((prevState) => !prevState);
    setIsKvantumOpen(false);
    setIsForforbrukOpen(false);
    setIsVerdiOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleKvantumDropdown = () => {
    setIsKvantumOpen((prevState) => !prevState);
    setIsBiomassOpen(false);
    setIsForforbrukOpen(false);
    setIsVerdiOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleForforbrukDropdown = () => {
    setIsForforbrukOpen((prevState) => !prevState);
    setIsBiomassOpen(false);
    setIsKvantumOpen(false);
    setIsVerdiOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleVerdiDropdown = () => {
    setIsVerdiOpen((prevState) => !prevState);
    setIsBiomassOpen(false);
    setIsKvantumOpen(false);
    setIsForforbrukOpen(false);
    setIsUtsattFiskOpen(false);
  };

  const toggleUtsattFiskDropdown = () => {
    setIsUtsattFiskOpen((prevState) => !prevState);
    setIsBiomassOpen(false);
    setIsKvantumOpen(false);
    setIsForforbrukOpen(false);
    setIsVerdiOpen(false);
  };

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

    const processChartData = (data: any[]) => {
      const chartSeries = [
        { name: "Biomasse_tonn", dataKey: "Biomasse_tonn" },
        { name: "Eksportert_kvantum_tonn", dataKey: "Eksportert_kvantum_tonn" },
        {
          name: "Eksportert_verdi_mill_kr",
          dataKey: "Eksportert_verdi_mill_kr",
        },
        { name: "Utsatt_fisk_mill", dataKey: "Utsatt_fisk_mill" },
        { name: "Fôrforbruk_tonn", dataKey: "Fôrforbruk_tonn" },
      ].map((series) => ({
        name: series.name,
        data: data.map((item) => ({
          x: new Date(item.Date).getTime(),
          y: item[series.dataKey],
        })),
      }));

      setChartData(chartSeries);
    };

    fetchData();
  }, []);

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
                  style={{ top: "20%", right: "100%" }} // Position to the right of the button
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="doubleDropdownButton"
                  >
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2020
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2021
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2022
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2023
                    </li>
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
                  style={{ top: "36%", right: "100%" }} // Position to the right of the button
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="doubleDropdownButton"
                  >
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2020
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2021
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2022
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2023
                    </li>
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
                  Eks. kvantum
                </button>
                <div
                  id="doubleDropdown"
                  className={`z-10 ${
                    isKvantumOpen ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}
                  style={{ top: "51%", right: "100%" }} // Position to the right of the button
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="doubleDropdownButton"
                  >
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2020
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2021
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2022
                    </li>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      2023
                    </li>
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
                  style={{ top: "66%", right: "100%" }} // Position to the right of the button
                >
                  <ul>
                    {Object.keys(checkboxStates).map((checkboxId) => (
                      <li
                        key={checkboxId}
                        onClick={() => toggleCheckbox(checkboxId)}
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={checkboxStates[checkboxId]}
                            onChange={() => toggleCheckbox(checkboxId)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={checkboxId}
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {checkboxId}
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
                  style={{ top: "81%", right: "100%" }} // Position to the right of the button
                >
                  <ul>
                    {Object.keys(checkboxStates).map((checkboxId) => (
                      <li
                        key={checkboxId}
                        onClick={() => toggleCheckbox(checkboxId)}
                      >
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={checkboxStates[checkboxId]}
                            onChange={() => toggleCheckbox(checkboxId)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={checkboxId}
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {checkboxId}
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
