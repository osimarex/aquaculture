"use client";

import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number }[] }[];

interface Props {
  darkMode: boolean;
}

const FXDailyForecast: React.FC<Props> = ({ darkMode }) => {
  const [chartData, setChartData] = React.useState<ChartSeries | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dailyForecast");
        const data = await response.json();
        processChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processChartData = (data: any) => {
      const usdNokData = data.find((item: any) => item.pair === "USDNOK");
      const eurNokData = data.find((item: any) => item.pair === "EURNOK");

      const usdNokSeries = Object.keys(usdNokData)
        .filter((key) => key.startsWith("date_"))
        .map((key, index) => {
          return {
            x: new Date(usdNokData[key]).getTime(),
            y: usdNokData[`price_${index}`],
          };
        });

      const eurNokSeries = Object.keys(eurNokData)
        .filter((key) => key.startsWith("date_"))
        .map((key, index) => {
          return {
            x: new Date(eurNokData[key]).getTime(),
            y: eurNokData[`price_${index}`],
          };
        });

      setChartData([
        { name: "USDNOK", data: usdNokSeries },
        { name: "EURNOK", data: eurNokSeries },
      ]);
    };

    fetchData();
  }, []); //

  useEffect(() => {
    if (darkMode) {
      Highcharts.theme = {
        colors: [
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
        ],
        // ...rest of dark theme properties
      };
    } else {
      Highcharts.theme = {
        colors: [
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
        ],
        // ...rest of light theme properties
      };
    }

    Highcharts.setOptions(Highcharts.theme);
  }, [darkMode]);

  const optionsUSDNOK = {
    chart: {
      height: 160,
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
    xAxis: {
      type: "datetime",
      text: "ff",
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    yAxis: {
      gridLineColor: darkMode ? "" : "",
      title: {
        text: "",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      range: 0.1,
      labels: {
        format: "{value:.2f}",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: chartData
      ?.filter((series) => series.name === "USDNOK")
      .map((series) => ({
        ...series,
        type: "spline",
        color: "#40ca16", // Default color is green
        marker: {
          enabled: false,
        },
        zones: [
          {
            value: series.data[0]?.y - 0.001, // Replace with your threshold value
            color: "#fd2b2b", // Color will be red for values less than threshold
          },
          {
            color: "#40ca16", // Color will revert to green for values greater or equal to threshold
          },
        ],
      })),
  };

  const optionsEURNOK = {
    chart: {
      height: 160,
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
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    yAxis: {
      gridLineColor: darkMode ? "" : "",
      title: {
        text: "",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      range: 0.1,
      labels: {
        format: "{value:.2f}",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: chartData
      ?.filter((series) => series.name === "EURNOK")
      .map((series) => ({
        ...series,
        type: "spline",
        color: "#40ca16", // Default color is green
        marker: {
          enabled: false,
        },
        zones: [
          {
            value: series.data[0]?.y - 0.001, // Replace with your threshold value
            color: "#fd2b2b", // Color will be red for values less than threshold
          },
          {
            color: "#40ca16", // Color will revert to green for values greater or equal to threshold
          },
        ],
      })),
  };

  return (
    <div
      className={`w-full h-auto ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      {chartData ? (
        <div className="flex flex-col items-start mt-8 ml-1">
          <div className="relative w-full">
            <div className="absolute top-2 left-16 transform[-50%,-50%] z-10  ">
              USDNOK
            </div>
            <div>
              <HighchartsReact
                highcharts={Highcharts}
                options={optionsUSDNOK}
              />
            </div>
          </div>
          <div className="relative w-full">
            <div className="absolute top-2 left-16 transform[-50%,-50%] z-10">
              EURNOK
            </div>
            <div>
              <HighchartsReact
                highcharts={Highcharts}
                options={optionsEURNOK}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-black">Loading data...</div>
      )}
    </div>
  );
};

export default FXDailyForecast;
