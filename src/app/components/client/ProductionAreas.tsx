"use client";

import React, { useEffect, useState } from "react";
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

interface MapProps {
  darkMode: boolean;
}

const ProductionAreas: React.FC<MapProps> = ({ darkMode }) => {
  const [mapData, setMapData] = useState(null);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [infoCardContent, setInfoCardContent] = useState<string | null>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchMapData();
      setMapData(data);
    })();
  }, []);

  const options = mapData && {
    chart: {
      height: 520,
      backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
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
      text: "AQUACULTURE",
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
      pointFormat: "{point.properties.name}",
    },
    series: [
      {
        mapData,
        name: "Norway",
        borderColor: "#707070",
        nullColor: "rgba(200, 200, 200, 0.3)",
        showInLegend: false,
        color: darkMode ? "#ffffff" : "#000000", // Font color based on dark mode
      },
      {
        type: "map",
        name: "Production Areas",
        data: areasGeoJson.features,
        joinBy: "name",
        opacity: 0.7,
        states: {
          hover: {
            color: Highcharts.getOptions()?.colors?.[2] || "#7cb5ec", // default color if undefined
          },
        },
        point: {
          events: {
            click: function () {
              const point: any = this;
              const chart = point.series.chart;
              chart.mapZoom(5, point.plotX, point.plotY);

              setShowInfoCard(true);
              setInfoCardContent(point.properties.name);
            },
          },
        },
      },
    ],
  };

  return (
    <div className="h-full w-full relative">
      {" "}
      {/* relative for positioning context */}
      {mapData && (
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
          {" "}
          {/* Modal overlay */}
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-64">
            {" "}
            {/* Modal content */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">{infoCardContent}</span>
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
