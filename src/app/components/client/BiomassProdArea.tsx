"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number | null }[] }[];

interface BiomassProps {
  darkMode: boolean;
}

type ApiDataType = {
  Date: string;
  [key: string]: string | number;
};

type TabClickCountType = Record<string, number>;

type TabState = {
  Tonn: { isOpen: boolean; isSelected: boolean };
  Antall: { isOpen: boolean; isSelected: boolean };
  Year: { isOpen: boolean; isSelected: boolean };
};

const BiomassProdArea: React.FC<BiomassProps> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartSeries | null>(null);
  const seriesColors = ["#4895EF", "#FF5733", "#C70039", "#900C3F", "#581845"];

  const [selectedTonnAreas, setSelectedTonnAreas] = useState(
    new Set<string>(["Totalt"])
  );

  useEffect(() => {
    console.log("Initial selectedTonnAreas:", selectedTonnAreas);
    console.log("Initial selectedYears:", selectedYears);
  }, []);

  const [selectedAntallAreas, setSelectedAntallAreas] = useState(
    new Set<string>()
  );

  const [tabState, setTabState] = useState({
    Tonn: { isOpen: false, isSelected: false },
    Antall: { isOpen: false, isSelected: false },
    Year: { isOpen: false, isSelected: false },
  });

  const [openTab, setOpenTab] = useState<keyof TabClickCountType | null>(
    "Tonn"
  );

  const [tonnData, setTonnData] = useState<ApiDataType[]>([]);
  const [antallData, setAntallData] = useState<ApiDataType[]>([]);

  const handleTabClick = (tabName: keyof TabState) => {
    setTabState((prevState) => {
      const newTabState = { ...prevState };

      // Toggle the isOpen state of the clicked tab
      // isSelected remains true if it was already selected
      newTabState[tabName] = {
        isOpen: !prevState[tabName].isOpen,
        isSelected: true,
      };

      // Set isSelected to false for other tabs
      Object.keys(newTabState).forEach((key) => {
        if (key !== tabName) {
          newTabState[key as keyof TabState].isSelected = false;
        }
      });

      return newTabState;
    });

    setOpenTab((prevOpenTab) => (prevOpenTab === tabName ? null : tabName));
  };

  //   console.log(
  //     `Tab pressed: ${tabName} = ${
  //       tabClickCount[tabName] % 2 === 0 ? "Open" : "Close"
  //     }`
  //   );
  // };

  const [selectedYears, setSelectedYears] = useState<(number | string)[]>([
    2021, 2022, 2023,
  ]);

  const removeTonnArea = (area: string) => {
    setSelectedTonnAreas((prevAreas) => {
      const newAreas = new Set(prevAreas);
      newAreas.delete(area);
      return newAreas;
    });
  };

  const removeAntallArea = (area: string) => {
    setSelectedAntallAreas(
      (prevAreas) => new Set([...prevAreas].filter((x) => x !== area))
    );
  };

  // Modified toggle functions for each dropdown
  const toggleTonnAreaCheckbox = (area: string) => {
    console.log("toggleTonnAreaCheckbox called with area:", area);
    setSelectedTonnAreas((prevAreas) => {
      const newAreas = new Set(prevAreas);
      if (newAreas.has(area)) {
        newAreas.delete(area);
      } else {
        newAreas.add(area);
      }
      return newAreas;
    });
  };

  const toggleAntallAreaCheckbox = (area: string) => {
    setSelectedAntallAreas((prevAreas) => {
      const newAreas = new Set(prevAreas);
      if (newAreas.has(area)) {
        newAreas.delete(area);
      } else {
        newAreas.add(area);
      }
      return newAreas;
    });
  };

  const extractYears = (data: ApiDataType[]): number[] => {
    const years = new Set<number>();
    data.forEach((item) => {
      const year = new Date(item.Date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => a - b);
  };

  // Call this function after fetching the data to set the years
  const [years, setYears] = useState<number[]>([]);
  const baseYear = 2000; // Example base year

  const updateChartData = () => {
    const chartSeries: ChartSeries = [];
    const isTotalSelected = selectedYears.includes("Total");
    const numericYears = selectedYears.filter(
      (y) => typeof y === "number"
    ) as number[];

    const yearsToUse = isTotalSelected ? years : numericYears;

    if (isTotalSelected) {
      // Aggregate data for 'Total' across all years
      const aggregateData = (dataSet: ApiDataType[], area: string) => {
        const areaYearData: { x: number; y: number | null }[] = [];

        dataSet.forEach((dataPoint) => {
          const date = new Date(dataPoint.Date);
          const timeStamp = date.getTime();

          let value = dataPoint[area];
          let yValue: number | null = null;

          // Check if value is a number or a string that can be converted to a number
          if (typeof value === "number") {
            yValue = value;
          } else if (typeof value === "string") {
            let parsedNumber = parseFloat(value);
            yValue = isNaN(parsedNumber) ? null : parsedNumber;
          }

          areaYearData.push({
            x: timeStamp,
            y: yValue,
          });
        });

        return areaYearData;
      };

      selectedTonnAreas.forEach((area) => {
        const areaName = area.split(": ")[1] || area;
        chartSeries.push({
          name: `${areaName} (Ton) - Total`,
          data: aggregateData(tonnData, area),
        });
      });

      selectedAntallAreas.forEach((area) => {
        const areaName = area.split(": ")[1] || area;
        chartSeries.push({
          name: `${areaName} (Amount) - Total`,
          data: aggregateData(antallData, area),
        });
      });
    } else {
      // Handle individual years
      const processData = (dataSet: any[], area: string, year: number) => {
        const areaYearData = [];
        for (let month = 0; month < 12; month++) {
          const normalizedDate = new Date(baseYear, month, 1);
          const dataPoint = dataSet.find(
            (d) =>
              new Date(d.Date).getFullYear() === year &&
              new Date(d.Date).getMonth() === month
          );
          areaYearData.push({
            x: normalizedDate.getTime(),
            y: dataPoint ? parseFloat(dataPoint[area] as string) || null : null,
          });
        }
        return areaYearData;
      };

      selectedTonnAreas.forEach((area) => {
        yearsToUse.forEach((year) => {
          const areaName = area.split(": ")[1] || area;
          chartSeries.push({
            name: `${areaName} (Ton) - ${year}`,
            data: processData(tonnData, area, year),
          });
        });
      });

      selectedAntallAreas.forEach((area) => {
        yearsToUse.forEach((year) => {
          const areaName = area.split(": ")[1] || area;
          chartSeries.push({
            name: `${areaName} (Amount) - ${year}`,
            data: processData(antallData, area, year),
          });
        });
      });
    }

    setChartData(chartSeries);
  };

  // Fetch and set tonnData
  useEffect(() => {
    const fetchData = async () => {
      if (selectedTonnAreas.size > 0) {
        try {
          const response = await fetch("/api/bioTonnProdAreas");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          // Here, ensure that 'data' is an array before setting it
          setTonnData(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedTonnAreas]);

  // Fetch and set antallData
  useEffect(() => {
    const fetchData = async () => {
      if (selectedAntallAreas.size > 0) {
        try {
          const response = await fetch("/api/bioAntallProdAreas");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          // Here, ensure that 'data' is an array before setting it
          setAntallData(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedAntallAreas]);

  // Update chart data when tonnData or antallData changes
  useEffect(() => {
    if (
      (tonnData && tonnData.length > 0) ||
      (antallData && antallData.length > 0)
    ) {
      updateChartData();
    }
  }, [
    selectedTonnAreas,
    selectedAntallAreas,
    tonnData,
    antallData,
    selectedYears,
  ]);

  useEffect(() => {
    const combinedData = [...tonnData, ...antallData];
    setYears(extractYears(combinedData));
  }, [tonnData, antallData]);

  const handleYearSelection = (year: number | string) => {
    console.log("handleYearSelection called with year:", year);
    setSelectedYears((prevYears) => {
      if (year === "Total") {
        // Toggle "Total" selection
        return prevYears.includes("Total") ? [] : ["Total"];
      } else {
        const numericYear = year as number;
        if (prevYears.includes("Total")) {
          // If "Total" is selected, deselect it and select the new year
          return [numericYear];
        } else {
          // If "Total" is not selected, toggle the specific year
          const yearIndex = prevYears.indexOf(numericYear);
          if (yearIndex >= 0) {
            return prevYears.filter((y) => y !== numericYear);
          } else {
            return [...prevYears, numericYear];
          }
        }
      }
    });
  };

  const areas = [
    "Område 1: Svenskegrensen til Jæren",
    "Område 2: Ryfylke",
    "Område 3: Karmøy til Sotra",
    "Område 4: Nordhordland til Stadt",
    "Område 5: Stadt til Hustadvika",
    "Område 6: Nordmøre og Sør-Trøndelag",
    "Område 7: Nord-Trøndelag med Bindal",
    "Område 8: Helgeland til Bodø",
    "Område 9: Vestfjorden og Vesterålen",
    "Område 10: Andøya til Senja",
    "Område 11: Kvaløy til Loppa",
    "Område 12: Vest-Finnmark",
    "Område 13: Øst-Finnmark",
    "Stamfisk, forskning og undervisning",
    "Totalt",
  ];

  const areasAntall = [
    "Område 1: Svenskegrensen til Jæren",
    "Område 2: Ryfylke",
    "Område 3: Karmøy til Sotra",
    "Område 4: Nordhordland til Stadt",
    "Område 5: Stadt til Hustadvika",
    "Område 6: Nordmøre og Sør-Trøndelag",
    "Område 7: Nord-Trøndelag med Bindal",
    "Område 8: Helgeland til Bodø",
    "Område 9: Vestfjorden og Vesterålen",
    "Område 10: Andøya til Senja",
    "Område 11: Kvaløy til Loppa",
    "Område 12: Vest-Finnmark",
    "Område 13: Øst-Finnmark",
    "Stamfisk, forskning og undervisning",
    "Totalt",
  ];

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
      // min: selectedYears ? new Date(selectedYears, 0, 1).getTime() : undefined,
      // max: selectedYears
      //   ? new Date(selectedYears, 11, 31, 23, 59, 59).getTime()
      //   : undefined,
      labels: {
        formatter: function (
          this: Highcharts.AxisLabelsFormatterContextObject
        ): string {
          const value =
            typeof this.value === "string"
              ? Date.parse(this.value)
              : this.value;
          return Highcharts.dateFormat("%b", value);
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

  return (
    <div
      className={`w-full h-auto relative m-0 ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      <div className="mt-8">
        <div className="absolute left-0 text-2xl font-normal ml-4 mt-14 z-10">
          PRODUCTION NUMBERS
        </div>
        <div className="absolute right-0 text-md font-normal ml-4 z-10">
          {Array.from(selectedTonnAreas).map((area) => {
            const areaName = area.split(": ")[1] || area;
            return (
              <button
                key={area}
                className="mr-2 bg-[#38B6FF] rounded-xl text-white p-2 text-sm ml-2 mb-2 inline-flex items-center cursor-default"
              >
                <span className="mr-1">{areaName} (Ton)</span>
                <span
                  className="cursor-pointer text-black bold"
                  onClick={() => removeTonnArea(area)}
                >
                  x
                </span>
              </button>
            );
          })}

          {Array.from(selectedAntallAreas).map((area) => {
            const areaName = area.split(": ")[1] || area;
            return (
              <button
                key={area}
                className="mr-2 bg-[#38B6FF] rounded-xl text-white p-2 text-sm ml-2 mb-2 inline-flex items-center cursor-default"
              >
                <span className="mr-1">{areaName} (Amount)</span>
                <span
                  className="cursor-pointer text-black bold"
                  onClick={() => removeAntallArea(area)}
                >
                  x
                </span>
              </button>
            );
          })}
        </div>

        <div className="absolute left-0 ml-4 z-10">
          <div role="tablist" className="tabs tabs-lifted">
            {/* Tonn Tab */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className={`tab ${
                tabState.Tonn.isSelected
                  ? tabState.Tonn.isOpen
                    ? "bg-red-100"
                    : "bg-green-100"
                  : "bg-blue-100"
              } ${darkMode ? "text-black" : "text-black"}`}
              aria-label="Biomass"
              onClick={() => handleTabClick("Tonn")}
            />
            {openTab === "Tonn" && (
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-3"
                style={{ maxHeight: "400px", overflowY: "scroll" }}
              >
                <ul className="flex flex-col">
                  {areas.map((area) => {
                    const areaName = area.split(": ")[1] || area;
                    const isSelected = selectedTonnAreas.has(area);
                    return (
                      <li
                        key={area}
                        className={`block px-4 py-2 hover:bg-zinc-300 dark:hover:bg-blue-400 ${
                          isSelected
                            ? "bg-[#38B6FF] text-white hover:text-black flex justify-between items-center"
                            : "dark:text-black"
                        }`}
                        onClick={() => toggleTonnAreaCheckbox(area)}
                      >
                        {areaName}
                        {isSelected && (
                          <svg
                            height="20px"
                            width="20px"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="Check_Square">
                              <path
                                d="M30,0H2C0.895,0,0,0.895,0,2v28c0,1.105,0.895,2,2,2h28c1.104,0,2-0.895,2-2V2C32,0.895,31.104,0,30,0z M30,30H2V2h28V30z"
                                fill="#121313"
                              />
                              <path
                                d="M12.301,22.607c0.382,0.379,1.044,0.384,1.429,0l10.999-10.899c0.394-0.39,0.394-1.024,0-1.414c-0.394-0.391-1.034-0.391-1.428,0L13.011,20.488l-4.281-4.196c-0.394-0.391-1.034-0.391-1.428,0c-0.395,0.391-0.395,1.024,0,1.414L12.301,22.607z"
                                fill="#121313"
                              />
                            </g>
                          </svg>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Antall Tab */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className={`tab ${
                tabState.Antall.isSelected
                  ? tabState.Antall.isOpen
                    ? "bg-red-100"
                    : "bg-green-100"
                  : "bg-blue-100"
              } ${darkMode ? "text-black" : "text-black"}`}
              aria-label="Amount"
              onClick={() => handleTabClick("Antall")}
            />
            {openTab === "Antall" && (
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-3"
                style={{ maxHeight: "400px", overflowY: "scroll" }}
              >
                <ul className="flex flex-col">
                  {areas.map((area) => {
                    const areaName = area.split(": ")[1] || area;
                    const isSelected = selectedAntallAreas.has(area);
                    return (
                      <li
                        key={area}
                        className={`block px-4 py-2 hover:bg-zinc-300 dark:hover:bg-blue-400 ${
                          isSelected
                            ? "bg-[#38B6FF] text-white hover:text-black flex justify-between items-center"
                            : "dark:text-black"
                        }`}
                        onClick={() => toggleAntallAreaCheckbox(area)}
                      >
                        {areaName}
                        {isSelected && (
                          <svg
                            height="20px"
                            width="20px"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="Check_Square">
                              <path
                                d="M30,0H2C0.895,0,0,0.895,0,2v28c0,1.105,0.895,2,2,2h28c1.104,0,2-0.895,2-2V2C32,0.895,31.104,0,30,0z M30,30H2V2h28V30z"
                                fill="#121313"
                              />
                              <path
                                d="M12.301,22.607c0.382,0.379,1.044,0.384,1.429,0l10.999-10.899c0.394-0.39,0.394-1.024,0-1.414c-0.394-0.391-1.034-0.391-1.428,0L13.011,20.488l-4.281-4.196c-0.394-0.391-1.034-0.391-1.428,0c-0.395,0.391-0.395,1.024,0,1.414L12.301,22.607z"
                                fill="#121313"
                              />
                            </g>
                          </svg>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {/* Year Tab */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className={`tab ${
                tabState.Year.isSelected
                  ? tabState.Year.isOpen
                    ? "bg-red-100"
                    : "bg-green-100"
                  : "bg-blue-100"
              } ${darkMode ? "text-black" : "text-black"}`}
              aria-label={`Year${
                selectedYears.length > 0 ? ` (${selectedYears.length})` : ""
              }`}
              onClick={() => handleTabClick("Year")}
            />
            {openTab === "Year" && (
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-3"
                style={{ maxHeight: "400px", overflowY: "scroll" }}
              >
                <ul className="flex flex-col">
                  {years.map((year) => {
                    const isSelected = selectedYears.includes(year);
                    return (
                      <li
                        key={year}
                        className={`block px-4 py-2 hover:bg-zinc-300 dark:hover:bg-blue-400 ${
                          isSelected
                            ? "bg-[#38B6FF] text-white hover:text-black flex justify-between items-center"
                            : "dark:text-black"
                        }`}
                        onClick={() => handleYearSelection(year)}
                      >
                        {year}
                        {isSelected && (
                          <svg
                            height="20px"
                            width="20px"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="Check_Square">
                              <path
                                d="M30,0H2C0.895,0,0,0.895,0,2v28c0,1.105,0.895,2,2,2h28c1.104,0,2-0.895,2-2V2C32,0.895,31.104,0,30,0z M30,30H2V2h28V30z"
                                fill="#121313"
                              />
                              <path
                                d="M12.301,22.607c0.382,0.379,1.044,0.384,1.429,0l10.999-10.899c0.394-0.39,0.394-1.024,0-1.414c-0.394-0.391-1.034-0.391-1.428,0L13.011,20.488l-4.281-4.196c-0.394-0.391-1.034-0.391-1.428,0c-0.395,0.391-0.395,1.024,0,1.414L12.301,22.607z"
                                fill="#121313"
                              />
                            </g>
                          </svg>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
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

export default BiomassProdArea;
