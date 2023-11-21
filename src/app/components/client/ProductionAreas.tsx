"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Highcharts, { Chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "jquery";
import "highcharts/modules/map";
import { areasGeoJson } from "../../../../serverRendered/coordinates";

if (typeof Highcharts === "object") {
  require("highcharts/modules/map")(Highcharts);
}

const fetchMapData = async () => {
  const response = await fetch(
    "https://code.highcharts.com/mapdata/countries/no/no-all.topo.json"
  );
  const mapData = await response.json();
  return mapData;
};

const fetchStatusData = async () => {
  const response = await fetch(
    "https://gis.fiskeridir.no/server/rest/services/Yggdrasil/Produksjonsomr%C3%A5der/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  );
  const statusData = await response.json();
  return statusData.features;
};

interface MapProps {
  darkMode: boolean;
}

interface CustomHighchartsPoint {
  properties: {
    name: string;
  };
  series: {
    chart: {
      setTitle: (options: { text: string }) => void;
    };
  };
}

interface StatusFeature {
  attributes: {
    name: string;
    status: string;
  };
}

interface HighchartsPoint {
  point: {
    properties: {
      name: string;
      biomasse: string;
      romming: string;
      romming2: string;
      romming3: string;
      romming4: string;
      romming5: string;
      temperatur: string;
    };
  };
}

declare module "highcharts" {
  interface Chart {
    selectedPoint?: Highcharts.Point;
  }
}

const statusColors: { [key: string]: string } = {
  grønn: "green",
  rød: "red",
  gul: "yellow",
};

const ProductionAreas: React.FC<MapProps> = ({ darkMode }) => {
  const [mapData, setMapData] = useState(null);
  const [statusData, setStatusData] = useState<StatusFeature[]>([]);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [infoCardContent, setInfoCardContent] = useState<string | null>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchMapData();
      setMapData(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await fetchStatusData();
      setStatusData(data);
    })();
  }, []);

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const options = useMemo(() => {
    if (!mapData) return null;

    return {
      chart: {
        height: 550,
        backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
        options3d: {
          enabled: true,
          alpha: 15, // tilt down angle, 0 is viewing from top, 90 is from side
          beta: 0, // rotation around the vertical axis, similar to rotating a globe
          depth: 100, // depth of the 3D chart, how thick it appears
          viewDistance: 25, // adjust if needed
        },
        style: {
          fontFamily: "Arial",
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      credits: {
        enabled: false,
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      title: {
        text: "PRODUCTION AREAS",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      legend: {
        itemStyle: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      tooltip: {
        backgroundColor: "#000000",
        style: {
          color: "#fff",
          opacity: 0.6,
        },
        formatter(this: HighchartsPoint) {
          const areaName = this.point.properties.name;
          const biomasseAmount = this.point.properties.biomasse;
          const romming = this.point.properties.romming;
          const romming2 = this.point.properties.romming2;
          const romming3 = this.point.properties.romming3;
          const romming4 = this.point.properties.romming4;
          const romming5 = this.point.properties.romming5;
          const temperatur = this.point.properties.temperatur;
          const areaStatusEntry = statusData.find(
            (area) => area.attributes.name === areaName
          );

          if (!areaStatusEntry) return `<b>${areaName}</b> <br>Status: Unknown`;

          const translatedStatus =
            {
              grønn: "green",
              rød: "red",
              gul: "yellow",
            }[areaStatusEntry.attributes.status] ||
            areaStatusEntry.attributes.status;

          return `<b>${areaName}</b> <br>Status: ${translatedStatus} <br>Biomasse: ${biomasseAmount}  <br>Rømming: ${romming}  <br>Temperatur: ${temperatur}`;
        },
      },
      series: [
        {
          mapData,
          name: "Norway",
          borderColor: "#707070",
          nullColor: "rgba(200, 200, 200, 0.3)",
          showInLegend: false,
          color: darkMode ? "#ffffff" : "#000000",
        },
        {
          type: "map",
          name: "Production Areas",
          data: areasGeoJson.features.map((feature) => {
            const name = feature.properties.name;
            const areaStatus = statusData.find(
              (area) => area.attributes.name === name
            )?.attributes.status;
            const statusColor = {
              grønn: "green",
              rød: "red",
              gul: "yellow",
            }[areaStatus || ""];

            return {
              ...feature,
              color: statusColor || "gray", // Fallback to gray if status isn't recognized
            };
          }),
          joinBy: "name",
          opacity: 0.7,
          states: {
            hover: {
              color: "#00ff37",
              opacity: 1,
            },
          },
          point: {
            events: {
              click: function (this: Highcharts.Point) {
                const point: Highcharts.Point = this;

                if (chartInstance && chartInstance.selectedPoint) {
                  if (chartInstance.selectedPoint !== point) {
                    // Safely call select with optional chaining
                    chartInstance.selectedPoint?.select(false);
                  }
                }

                point.select(false, true);

                // Set the selected point on the chartInstance
                if (chartInstance) {
                  chartInstance.selectedPoint = point;
                }

                (point as any).zoomTo();
                setShowInfoCard(true);
                setInfoCardContent(
                  "<div className=text-bold> Rømming:</div> <hr/>" +
                    point.properties.name +
                    "<hr /><br/><span className=text-white>2022: </span>" +
                    point.properties.romming2 +
                    "<hr /><br/><span className=text-black>2021: </span>" +
                    point.properties.romming3 +
                    "<hr /><br/><span className=text-black>2020: </span>" +
                    point.properties.romming4 +
                    "<hr /><br/><span className=text-black>2019: </span>" +
                    point.properties.romming5
                );
              },
              mouseOver: function (this: Highcharts.Point) {
                const areaName = this.properties.name;
                this.series.chart.setTitle({ text: areaName });
              },
              mouseOut: function (this: Highcharts.Point) {
                this.series.chart.setTitle({ text: "PRODUCTION AREAS" });
              },
            },
          },
        },
      ],
    };
  }, [mapData, darkMode, statusData]);

  return (
    <div className="h-fit w-full relative flex justify-start">
      {/* relative for positioning context */}
      {options && (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"mapChart"}
          options={options}
          ref={chartRef}
        />
      )}
      {showInfoCard && infoCardContent && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-64">
            <div className="flex justify-between items-center">
              {/* Ensure infoCardContent is not null before rendering */}
              <span
                className="text-md font-normal text-gray-800"
                dangerouslySetInnerHTML={{ __html: infoCardContent }}
              />
              <button
                className="ml-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700 focus:outline-none"
                onClick={() => {
                  setShowInfoCard(false);
                  if (chartRef.current && chartRef.current.chart) {
                    chartRef.current.chart.mapZoom();
                  }
                }}
              >
                ×
              </button>
            </div>
            <div className="mt-4">
              {/* Any other content you want in your modal */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionAreas;
