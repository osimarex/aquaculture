"use client";

import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
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
    };
  };
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

  const options = useMemo(() => {
    if (!mapData) return null;

    return {
      chart: {
        height: 520,
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
          color: darkMode ? "#ffffff" : "#000000", // Font color based on dark mode
        },
      },
      credits: {
        enabled: false,
        style: {
          color: darkMode ? "#ffffff" : "#000000", // Font color based on dark mode
        },
      },
      title: {
        text: "PRODUCTION AREAS",
        style: {
          color: darkMode ? "#ffffff" : "#000000", // Font color based on dark mode
        },
      },
      legend: {
        itemStyle: {
          color: darkMode ? "#ffffff" : "#000000", // Font color based on dark mode
        },
      },
      tooltip: {
        backgroundColor: "#000000",
        style: {
          color: "#fff",
          opacity: 0.6,
        },
        formatter(this: HighchartsPoint) {
          // Explicitly typed 'this'
          const areaName = this.point.properties.name;
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

          return `<b>${areaName}</b> <br>Status: ${translatedStatus}`;
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
              color: "#2b2828",
              opacity: 1,
            },
          },
          point: {
            events: {
              click: function () {
                const point: any = this;
                console.log(point.properties.name);
                const chart = point.series.chart;

                // Deselect previously selected point if any
                if (chart.selectedPoint && chart.selectedPoint !== point) {
                  chart.selectedPoint.select(false);
                }

                point.select(null, true); // Toggle selection of the clicked point
                chart.selectedPoint = point; // Save the reference of the selected point

                point.zoomTo();
                setShowInfoCard(true);
                setInfoCardContent(point.properties.name);
              },
              // Setting the hovered region name on mouse over
              mouseOver: function (this: CustomHighchartsPoint) {
                this.series.chart.setTitle({ text: this.properties.name });
              },
              // Reset the title to "AQUACULTURE" on mouse out
              mouseOut: function (this: CustomHighchartsPoint) {
                this.series.chart.setTitle({ text: "PRODUCTION AREAS" });
              },
            },
          },
        },
      ],
    };
  }, [mapData, darkMode, statusData]);

  return (
    <div className="h-full w-full relative flex justify-start">
      {/* relative for positioning context */}
      {options && (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"mapChart"}
          options={options}
          callback={(chart: any) => {
            setChartInstance(chart);
          }}
        />
      )}
      {showInfoCard && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          {/* Modal overlay */}
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-64">
            {/* Modal content */}
            <div className="flex justify-between items-center">
              <span className="text-black text-lg font-bold">
                {infoCardContent}
              </span>
              <button
                className="ml-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700 focus:outline-none"
                onClick={() => {
                  setShowInfoCard(false);
                  if (chartInstance) {
                    chartInstance.mapZoom(); // This zooms out
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
