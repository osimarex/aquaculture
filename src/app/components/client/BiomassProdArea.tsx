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

const BiomassProdArea: React.FC<BiomassProps> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartSeries | null>(null);
  const seriesColors = ["#4895EF", "#FF5733", "#C70039", "#900C3F", "#581845"];

  const [selectedTonnAreas, setSelectedTonnAreas] = useState(new Set<string>());
  const [selectedAntallAreas, setSelectedAntallAreas] = useState(
    new Set<string>()
  );

  const [tonnData, setTonnData] = useState<ApiDataType[]>([]);
  const [antallData, setAntallData] = useState<ApiDataType[]>([]);

  const [isProdAreasOpen, setIsProdAreasOpen] = useState(false);
  const [isProdAreasAntallOpen, setIsProdAreasAntallOpen] = useState(false);

  const removeTonnArea = (area: string) => {
    setSelectedTonnAreas(
      (prevAreas) => new Set([...prevAreas].filter((x) => x !== area))
    );
  };

  const removeAntallArea = (area: string) => {
    setSelectedAntallAreas(
      (prevAreas) => new Set([...prevAreas].filter((x) => x !== area))
    );
  };

  const toggleProdAreasTonnDropdown = () => {
    setIsProdAreasOpen((prevState) => !prevState);
  };

  const toggleProdAreasAntallDropdown = () => {
    setIsProdAreasAntallOpen((prevState) => !prevState);
  };

  // Modified toggle functions for each dropdown
  const toggleTonnAreaCheckbox = (area: string) => {
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

  const updateChartData = () => {
    const chartSeries: ChartSeries = [];

    selectedTonnAreas.forEach((area) => {
      const areaName = area.split(": ")[1] || area;
      const areaTonnData = tonnData.map((d) => {
        const yValue = parseFloat(d[area] as string);
        return {
          x: new Date(d.Date).getTime(),
          y: isNaN(yValue) ? null : yValue, // Convert to number or null
        };
      });
      chartSeries.push({
        name: `${areaName} (Tonn)`,
        data: areaTonnData,
      });
    });

    selectedAntallAreas.forEach((area) => {
      const areaName = area.split(": ")[1] || area;
      const areaAntallData = antallData.map((d) => {
        const yValue = parseFloat(d[area] as string);
        return {
          x: new Date(d.Date).getTime(),
          y: isNaN(yValue) ? null : yValue, // Convert to number or null
        };
      });
      chartSeries.push({
        name: `${areaName} (Antall)`,
        data: areaAntallData,
      });
    });

    setChartData(chartSeries);
  };

  // Fetch and set tonnData
  useEffect(() => {
    const fetchData = async () => {
      if (selectedTonnAreas.size > 0) {
        try {
          const response = await fetch("/api/bioTonnProdAreas");
          const data = await response.json();
          setTonnData(data);
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
          const data = await response.json();
          setAntallData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [selectedAntallAreas]);

  // Update chart data when tonnData or antallData changes
  useEffect(() => {
    if (tonnData.length > 0 || antallData.length > 0) {
      updateChartData();
    }
  }, [selectedTonnAreas, selectedAntallAreas, tonnData, antallData]);

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
            const areaName = area.split(": ")[1] || area; // Extract the part after ': '
            return (
              <button key={area} className="mr-2">
                {areaName} (Tonn){" "}
                <span onClick={() => removeTonnArea(area)}>x</span>
              </button>
            );
          })}
          {Array.from(selectedAntallAreas).map((area) => {
            const areaName = area.split(": ")[1] || area; // Extract the part after ': '
            return (
              <button key={area} className="mr-2">
                {areaName} (Antall){" "}
                <span onClick={() => removeAntallArea(area)}>x</span>
              </button>
            );
          })}
        </div>

        <div className="absolute left-0 ml-4 z-10">
          <ul className="flex list-none">
            <li>
              <button
                id="doubleDropdownButton"
                type="button"
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggleProdAreasTonnDropdown}
              >
                Prod.Areas in tonn
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
              {isProdAreasOpen && (
                <div
                  id="doubleDropdown"
                  className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 overflow-y-auto"
                  style={{ maxHeight: "300px" }} // Set a maximum height and enable scrolling
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="doubleDropdownButton"
                  >
                    {areas.map((area) => {
                      const areaName = area.split(": ")[1] || area; // Extract the part after ': '
                      return (
                        <li
                          key={area}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={() => toggleTonnAreaCheckbox(area)}
                        >
                          {areaName}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>

            <li>
              <button
                id="doubleDropdownButton"
                type="button"
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggleProdAreasAntallDropdown}
              >
                Prod.Areas antall
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
              {isProdAreasAntallOpen && (
                <div
                  id="doubleDropdown"
                  className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 overflow-y-auto"
                  style={{ maxHeight: "300px" }} // Set a maximum height and enable scrolling
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="doubleDropdownButton"
                  >
                    {areasAntall.map((area) => {
                      const areaName = area.split(": ")[1] || area; // Extract the part after ': '
                      return (
                        <li
                          key={area}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={() => toggleAntallAreaCheckbox(area)}
                        >
                          {areaName}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
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

export default BiomassProdArea;
