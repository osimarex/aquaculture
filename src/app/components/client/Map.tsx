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

const Map = () => {
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
    },
    title: {
      text: "AQUACULTURE",
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },
    colorAxis: {
      min: 0,
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
