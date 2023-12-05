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

const BiomassProdArea: React.FC<BiomassProps> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartSeries | null>(null);
  const seriesColors = ["#4895EF", "#FF5733", "#C70039", "#900C3F", "#581845"];

  const [selectedTonnAreas, setSelectedTonnAreas] = useState(new Set<string>());
  const [selectedAntallAreas, setSelectedAntallAreas] = useState(
    new Set<string>()
  );

  const [tonnData, setTonnData] = useState<ApiDataType[]>([]);
  const [antallData, setAntallData] = useState<ApiDataType[]>([]);

  const [tabClickCount, setTabClickCount] = useState<TabClickCountType>({
    Tonn: 0,
    Antall: 0,
    Year: 0,
  });

  const handleTabClick = (tabName: keyof TabClickCountType) => {
    setTabClickCount((prevCount) => ({
      ...prevCount,
      [tabName]: prevCount[tabName] + 1,
    }));

    console.log(
      `Tab pressed: ${tabName} = ${
        tabClickCount[tabName] % 2 === 0 ? "Open" : "Close"
      }`
    );
  };

  const [selectedYears, setSelectedYears] = useState<number[]>([]);

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

    selectedTonnAreas.forEach((area) => {
      selectedYears.forEach((year) => {
        const areaName = area.split(": ")[1] || area;
        const areaYearData = [];

        for (let month = 0; month < 12; month++) {
          const date = new Date(year, month, 1);
          const normalizedDate = new Date(baseYear, month, 1); // Normalize to a base year
          const dataPoint = tonnData.find(
            (d) =>
              new Date(d.Date).getFullYear() === year &&
              new Date(d.Date).getMonth() === month
          );

          areaYearData.push({
            x: normalizedDate.getTime(),
            y: dataPoint ? parseFloat(dataPoint[area] as string) || null : null,
          });
        }

        chartSeries.push({
          name: `${areaName} (Tonn) - ${year}`,
          data: areaYearData,
        });
      });
    });

    selectedAntallAreas.forEach((area) => {
      selectedYears.forEach((year) => {
        const areaName = area.split(": ")[1] || area;
        const areaYearData = [];

        for (let month = 0; month < 12; month++) {
          const date = new Date(year, month, 1);
          const normalizedDate = new Date(baseYear, month, 1); // Normalize to a base year
          const dataPoint = antallData.find(
            (d) =>
              new Date(d.Date).getFullYear() === year &&
              new Date(d.Date).getMonth() === month
          );

          areaYearData.push({
            x: normalizedDate.getTime(),
            y: dataPoint ? parseFloat(dataPoint[area] as string) || null : null,
          });
        }

        chartSeries.push({
          name: `${areaName} (Antall) - ${year}`,
          data: areaYearData,
        });
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
          const combinedData = [...tonnData, ...antallData];
          setYears(extractYears(combinedData));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [selectedTonnAreas, tonnData, antallData]);

  // Fetch and set antallData
  useEffect(() => {
    const fetchData = async () => {
      if (selectedAntallAreas.size > 0) {
        try {
          const response = await fetch("/api/bioAntallProdAreas");
          const data = await response.json();
          setAntallData(data);
          const combinedData = [...tonnData, ...antallData];
          setYears(extractYears(combinedData));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [selectedAntallAreas, tonnData, antallData]);

  // Update chart data when tonnData or antallData changes
  useEffect(() => {
    if (tonnData.length > 0 || antallData.length > 0) {
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

  const handleYearSelection = (year: number) => {
    setSelectedYears((prevYears) => {
      if (prevYears.includes(year)) {
        return prevYears.filter((y) => y !== year); // Deselect the year
      } else {
        return [...prevYears, year]; // Select the year
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
              <button key={area} className="mr-2">
                {areaName} (Tonn)
                <span onClick={() => removeTonnArea(area)}>x</span>
              </button>
            );
          })}
          {Array.from(selectedAntallAreas).map((area) => {
            const areaName = area.split(": ")[1] || area;
            return (
              <button key={area} className="mr-2">
                {areaName} (Antall)
                <span onClick={() => removeAntallArea(area)}>x</span>
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
              className="tab"
              aria-label="Tab Tonn"
              onClick={() => handleTabClick("Tonn")}
            />
            {tabClickCount["Tonn"] % 2 !== 0 && (
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                <ul className="flex flex-col">
                  {areas.map((area) => {
                    const areaName = area.split(": ")[1] || area;
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

            {/* Antall Tab */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Tab Antall"
              onClick={() => handleTabClick("Antall")}
            />
            {tabClickCount["Antall"] % 2 !== 0 && (
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                <ul className="flex flex-col">
                  {areasAntall.map((area) => {
                    const areaName = area.split(": ")[1] || area;
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
            {/* Year Tab */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Tab Year"
              onClick={() => handleTabClick("Year")}
            />
            {tabClickCount["Year"] % 2 !== 0 && (
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                <ul className="flex flex-col">
                  {years.map((year) => (
                    <li
                      key={year}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => handleYearSelection(year)}
                    >
                      {year}
                    </li>
                  ))}
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
