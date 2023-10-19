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
        opacity: 0.9,
        states: {
          hover: {
            color: Highcharts.getOptions()?.colors?.[1] || "#7cb5ec", // default color if undefined
          },
        },
        point: {
          events: {
            click: function () {
              const point: any = this;
              const chart = point.series.chart;
              chart.mapZoom(5, point.plotX, point.plotY);
            },
          },
        },
      },
    ],
  };

  return (
    <div className="h-full w-full">
      {mapData && (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"mapChart"}
          options={options}
        />
      )}
    </div>
  );
};

export default ProductionAreas;
