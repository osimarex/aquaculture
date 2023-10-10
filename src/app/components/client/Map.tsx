"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/map";

if (typeof Highcharts === "object") {
  require("highcharts/modules/map")(Highcharts);
}

const fetchMapData = async () => {
  const response = await fetch(
    "https://code.highcharts.com/mapdata/countries/no/no-all.topo.json"
  );
  const topology = await response.json();
  return topology;
};

interface MapProps {
  darkMode: boolean;
}

const Map: React.FC<MapProps> = ({ darkMode }) => {
  const [topology, setTopology] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchMapData();
      setTopology(data);
    })();
  }, []);

  const options = {
    chart: {
      map: topology,
      height: 543,
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
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
        theme: {
          fill: darkMode ? "#505365" : "#f0f0f0", // Fill color based on dark mode
          "stroke-width": 1,
          stroke: darkMode ? "#707070" : "#e6e6e6", // Stroke color based on dark mode
          r: 0,
          states: {
            hover: {
              fill: darkMode ? "#ffffff" : "#e6e6e6", // Hover fill color based on dark mode
            },
            select: {
              stroke: darkMode ? "#000000" : "#000000",
              fill: darkMode ? "#707070" : "#e6e6e6", // Select fill color based on dark mode
            },
          },
        },
      },
    },
    colorAxis: {
      min: 0,
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000", // Font color based on dark mode
        },
      },
    },
    series: [
      {
        data: [
          ["no-vl", 10],
          ["no-mr", 11],
          ["no-ag", 12],
          ["no-no", 13],
          ["no-vi", 14],
          ["no-ro", 15],
          ["no-tf", 16],
          ["no-td", 17],
          ["no-os", 18],
          ["no-vt", 19],
          ["no-in", 20],
        ],
        name: "Water Temperature",
        states: {
          hover: {
            color: "#BADA55",
          },
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          color: darkMode ? "#ffffff" : "#000000", // Font color based on dark mode
          style: {
            textOutline: "none", // Optional: This will remove the text outline
          },
        },
      },
    ],
  };

  return (
    <div className="h-fit min-w-[320px] max-w-[600px] mx-auto">
      {topology && (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"mapChart"}
          options={options}
        />
      )}
    </div>
  );
};

export default Map;
