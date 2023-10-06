"use client";

import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = { name: string; data: { x: number; y: number }[] }[];

const FXDailyForecast: React.FC = () => {
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
  }, []);

  const optionsUSDNOK = {
    chart: {
      height: 160,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      text: "ff",
    },
    yAxis: {
      title: {
        text: "",
      },
      range: 0.1,
      labels: {
        format: "{value:.2f}",
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
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "",
      },
      range: 0.1,
      labels: {
        format: "{value:.2f}",
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
    <div className="w-full h-auto">
      {chartData ? (
        <div className="flex flex-col items-start mt-4 ml-1">
          <div className="relative w-full">
            <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-black text-2xl">
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
            <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-black text-2xl">
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
        "Loading data..."
      )}
    </div>
  );
};

export default FXDailyForecast;
