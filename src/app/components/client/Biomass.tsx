"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

interface SeriesData {
  name: string;
  data: [number, number][];
}

interface BiomassProps {
  series: SeriesData[];
}

const Biomass: React.FC<BiomassProps> = ({}) => {
  const [chartData, setChartData] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/productionNumbers");
        const data = await response.json();
        processChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processChartData = (data: any) => {
      console.log("Biomasse data: ", data);
      const biomassSeries = data.map((item: any) => {
        return [
          new Date(item.Date).getTime(), // x-value as timestamp
          item.Biomasse_tonn, // y-value
        ];
      });

      // Find the minimum and maximum dates from your data
      const minDate = Math.min(...biomassSeries.map((item: any) => item[0]));
      const maxDate = Math.max(...biomassSeries.map((item: any) => item[0]));

      setChartData([{ name: "Biomasse_tonn", data: biomassSeries }]);
      setDateRange({ min: minDate, max: maxDate });
      console.log(biomassSeries); // Add this line in processChartData function
    };

    fetchData();
  }, []);

  const biomasseData = {
    chart: {
      height: 255,
    },
    rangeSelector: {
      selected: 1,
      inputEnabled: true,
      allButtonsEnabled: true,
    },

    xAxis: {
      type: "datetime",
      // Optionally, set the min and max dates for the x-axis based on your data
      min: dateRange ? dateRange.min : undefined,
      max: dateRange ? dateRange.max : undefined,
    },
    series: chartData
      ? chartData.map((seriesItem: any) => ({
          ...seriesItem,
          type: "line", // or 'spline' or other chart type if preferred
        }))
      : [],
  };

  return (
    <div className="w-full h-auto">
      {chartData ? (
        <div className="flex flex-col items-start mt-4 ml-1">
          <div className="relative w-full">
            <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-black text-2xl">
              BIOMASS
            </div>
            <div>
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
  );
};

export default Biomass;
