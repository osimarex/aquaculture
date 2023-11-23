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

type ApiDataItem = {
  Biomasse_tonn: number;
  Date: string;
};

const BiomassProdArea: React.FC<BiomassProps> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartSeries | null>(null);
  const seriesColors = ["#4895EF", "#FF5733", "#C70039", "#900C3F", "#581845"];

  const [selectedAreas, setSelectedAreas] = useState(new Set<string>());

  const toggleDropdown = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prevState) => !prevState);
  };

  const [isProdAreasOpen, setIsProdAreasOpen] = useState(false);

  const toggleProdAreasDropdown = () => {
    setIsProdAreasOpen((prevState) => !prevState);
  };

  const toggleAreaCheckbox = (area: string) => {
    setSelectedAreas((prevAreas) => {
      const newAreas = new Set(prevAreas);
      if (newAreas.has(area)) {
        newAreas.delete(area);
      } else {
        newAreas.add(area);
      }
      return newAreas;
    });
  };

  const updateChartData = (data: any[]) => {
    const chartSeries: ChartSeries = [];

    selectedAreas.forEach((area) => {
      const areaData = data.map((d) => {
        const date = new Date(d.Date);
        return {
          x: date.getTime(),
          y: d[area] ?? null,
        };
      });

      chartSeries.push({
        name: area,
        data: areaData,
      });
    });

    setChartData(chartSeries);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/bioTonnProdAreas");
        const data = await response.json();
        updateChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedAreas.size > 0) {
      fetchData();
    }
  }, [selectedAreas]);

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
        <div className="absolute left-0 ml-4 z-10">
          <ul className="flex list-none">
            <li>
              <button
                id="doubleDropdownButton"
                type="button"
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggleProdAreasDropdown}
              >
                Prod.Areas
                {/* SVG Icon here */}
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
                    {areas.map((area) => (
                      <li
                        key={area}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => toggleAreaCheckbox(area)}
                      >
                        {area}
                      </li>
                    ))}
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
