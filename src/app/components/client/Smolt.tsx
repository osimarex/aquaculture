"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

declare module "highcharts" {
  interface ChartOptions {
    zoomType?: string;
  }
}

interface Props {
  darkMode: boolean;
}

const defaultColors = [
  "#7cb5ec",
  "#434348",
  "#90ed7d",
  "#f7a35c",
  "#8085e9",
  "#f15c80",
  "#e4d354",
  "#2b908f",
  "#f45b5b",
  "#91e8e1",
];

const ChartComponent: React.FC<Props> = ({ darkMode }) => {
  const themeColors = darkMode
    ? [
        "#DDDF0D",
        "#7798BF",
        "#55BF3B",
        "#DF5353",
        "#aaeeee",
        "#ff0066",
        "#eeaaee",
        "#55BF3B",
        "#DF5353",
        "#7798BF",
      ]
    : [
        "#7cb5ec",
        "#434348",
        "#90ed7d",
        "#f7a35c",
        "#8085e9",
        "#f15c80",
        "#e4d354",
        "#2b908f",
        "#f45b5b",
        "#91e8e1",
      ];

  const backgroundColor = darkMode ? "#2c2c2c" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  const options: Highcharts.Options = {
    chart: {
      zoomType: "xy" as any,
      height: 340,
      backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        lineWidth: 2,
      },
    },
    title: {
      text: "SMOLT",
      align: "left",
      style: {
        color: textColor,
      },
    },
    subtitle: {
      align: "left",
      style: {
        color: textColor,
      },
    },
    xAxis: [
      {
        categories: [
          "Janu",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        crosshair: true,
        labels: {
          style: {
            color: textColor,
          },
        },
      },
    ],
    yAxis: [
      {
        gridLineColor: darkMode ? "#333333" : "",
        labels: {
          format: "{value}°C",
          style: {
            color: defaultColors[2],
          },
        },
        title: {
          text: "Temperature",
          style: {
            color: defaultColors[2],
          },
        },
        opposite: true,
      },
      {
        gridLineWidth: 0,
        title: {
          text: "Smolt volum",
          style: {
            color: defaultColors[0],
          },
        },
        labels: {
          format: "{value} mm",
          style: {
            color: defaultColors[0],
          },
        },
      },
      {
        // Tertiary yAxis
        gridLineWidth: 0,
        title: {
          text: "Smolt price",
          style: {
            color: defaultColors[0],
          },
        },
        labels: {
          format: "{value} mb",
          style: {
            color: defaultColors[0],
          },
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    legend: {
      layout: "vertical",
      align: "left",
      x: 80,
      verticalAlign: "top",
      y: 55,
      floating: true,
      backgroundColor: darkMode ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)",
      itemStyle: {
        color: textColor,
      },
    },
    series: [
      {
        name: "Smolt Volum",
        type: "column",
        yAxis: 1,
        data: [
          49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
        tooltip: {
          valueSuffix: " mm",
        },
      },
      {
        name: "Smolt price",
        type: "spline",
        yAxis: 2,
        data: [
          1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1,
          1016.9, 1018.2, 1016.7,
        ],
        color: darkMode ? "#ffffff" : "#000000",
        marker: {
          enabled: false,
        },
        dashStyle: "ShortDot",
        tooltip: {
          valueSuffix: " mb",
        },
      },
      {
        name: "Slakt volum",
        type: "spline",
        data: [
          7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,
        ],
        tooltip: {
          valueSuffix: " °C",
        },
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              floating: false,
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
              x: 0,
              y: 0,
              itemStyle: {
                color: textColor,
              },
            },
            yAxis: [
              {
                labels: {
                  align: "right",
                  x: 0,
                  y: -6,
                  style: {
                    color: textColor,
                  },
                },
                title: {
                  style: {
                    color: textColor,
                  },
                },
                showLastLabel: false,
              },
              {
                labels: {
                  align: "left",
                  x: 0,
                  y: -6,
                  style: {
                    color: textColor,
                  },
                },
                title: {
                  style: {
                    color: textColor,
                  },
                },
                showLastLabel: false,
              },
              {
                visible: false,
              },
            ],
          },
        },
      ],
    },
  };

  return (
    <figure
      className={`highcharts-figure ${
        darkMode ? "text-white bg-black" : "text-black bg-white"
      }`}
    >
      <div className="min-w-[310px] max-w-[800px] mx-auto">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </figure>
  );
};

export default ChartComponent;
