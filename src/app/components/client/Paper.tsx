"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartSeries = {
  name: string;
  data: { x: number; y: number }[];
}[];

interface Props {
  darkMode: boolean;
}

const SalmonForecast: React.FC<Props> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartSeries | null>(null);
  const [weekNumbers, setWeekNumbers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/salmonForecast");
        const data = await response.json();
        processChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processChartData = (data: any[]) => {
      const weekNumbers: number[] = data.map((item) =>
        parseInt(item.week.trim(), 10)
      );
      const uniqueWeekNumbers = Array.from(new Set(weekNumbers));

      const seriesData = data.map((item) => {
        const weekNumber = parseInt(item.week.trim(), 10);
        const weekIndex = uniqueWeekNumbers.indexOf(weekNumber);
        const price = parseFloat(item.forecasted_price.trim());
        return { x: weekIndex, y: price };
      });

      const additionalSeries = [
        { startWeek: 48, endWeek: 1, price: 77.75, name: "1st Month" },
        { startWeek: 1, endWeek: 5, price: 85.375, name: "2nd Month" },
        { startWeek: 1, endWeek: 14, price: 109.925, name: "Q1" },
        { startWeek: 14, endWeek: 22, price: 112.3, name: "Q2" },
      ].map((item) => {
        const startIndex = uniqueWeekNumbers.indexOf(item.startWeek);
        const endIndex = uniqueWeekNumbers.indexOf(item.endWeek);
        return {
          name: item.name,
          data: [
            { x: startIndex, y: item.price },
            { x: endIndex, y: item.price },
          ],
        };
      });

      setChartData([
        { name: "Salmon Price", data: seriesData },
        ...additionalSeries,
      ]);
      setWeekNumbers(uniqueWeekNumbers.map(String));
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      height: 380,
      backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
    },
    title: {
      text: "",
      style: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    xAxis: {
      categories: weekNumbers,
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    legend: {
      itemStyle: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    yAxis: {
      gridLineColor: darkMode ? "#333333" : "#ededed",
      title: {
        text: "",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },

    credits: {
      enabled: false,
    },
    series: chartData,
  };

  return (
    <div
      className={`w-full h-auto relative ${
        darkMode ? "text-white" : "bg-white text-black"
      }`}
    >
      <div className="mt-14">
        {chartData ? (
          <div className="flex flex-col items-start mt-8 ml-1">
            <div className="relative w-full">
              <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-2xl">
                FORWARD PRICE
              </div>
              <div>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
            </div>
          </div>
        ) : (
          "Loading data..."
        )}
      </div>
    </div>
  );
};

export default SalmonForecast;

// "use client";

// import React, { useEffect, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";

// type ChartSeries = { name: string; data: { x: number; y: number }[] }[];

// interface Props {
//   darkMode: boolean;
// }

// const SalmonForecast: React.FC<Props> = ({ darkMode }) => {
//   const [chartData, setChartData] = useState<ChartSeries | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/dailyForecast");
//         const data = await response.json();
//         processChartData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     const processChartData = (data: any) => {
//       const usdNokData = data.find((item: any) => item.pair === "USDNOK");
//       const eurNokData = data.find((item: any) => item.pair === "EURNOK");

//       const usdNokSeries = Object.keys(usdNokData)
//         .filter((key) => key.startsWith("date_"))
//         .map((key, index) => {
//           return {
//             x: new Date(usdNokData[key]).getTime(),
//             y: usdNokData[`price_${index}`],
//           };
//         });

//       const eurNokSeries = Object.keys(eurNokData)
//         .filter((key) => key.startsWith("date_"))
//         .map((key, index) => {
//           return {
//             x: new Date(eurNokData[key]).getTime(),
//             y: eurNokData[`price_${index}`],
//           };
//         });

//       setChartData([
//         { name: "USDNOK", data: usdNokSeries },
//         { name: "EURNOK", data: eurNokSeries },
//       ]);
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (darkMode) {
//       Highcharts.theme = {
//         // ...dark theme properties
//       };
//     } else {
//       Highcharts.theme = {
//         // ...light theme properties
//       };
//     }
//     Highcharts.setOptions(Highcharts.theme);
//   }, [darkMode]);

//   const optionsUSDNOK = {
//     chart: {
//       height: 380,
//       backgroundColor: darkMode ? "rgb(31 41 55)" : "#ffffff",
//     },
//     title: {
//       text: "",
//       style: {
//         color: darkMode ? "#ffffff" : "#000000",
//       },
//     },
//     credits: {
//       enabled: false,
//     },
//     plotOptions: {
//       series: {
//         lineWidth: 3,
//       },
//     },
//     xAxis: {
//       type: "datetime",
//       labels: {
//         style: {
//           color: darkMode ? "#ffffff" : "#000000",
//         },
//       },
//     },
//     yAxis: {
//       gridLineColor: darkMode ? "#333333" : "#ededed",
//       title: {
//         text: "",
//         style: {
//           color: darkMode ? "#ffffff" : "#000000",
//         },
//       },
//       range: 0.1,
//       labels: {
//         format: "{value:.2f}",
//         style: {
//           color: darkMode ? "#ffffff" : "#000000",
//         },
//       },
//     },
//     legend: {
//       itemStyle: {
//         color: darkMode ? "#ffffff" : "#000000",
//       },
//     },
//     series: chartData
//       ?.filter((series) => series.name === "USDNOK")
//       .map((series) => ({
//         ...series,
//         type: "spline",
//         color: "#40ca16", // Default color is green
//         marker: {
//           enabled: false,
//         },
//         zones: [
//           {
//             value: series.data[0]?.y - 0.001, // Replace with your threshold value
//             color: "#fd2b2b", // Color will be red for values less than threshold
//           },
//           {
//             color: "#40ca16", // Color will revert to green for values greater or equal to threshold
//           },
//         ],
//       })),
//   };

//   return (
//     <div
//       className={`w-full h-auto ${
//         darkMode ? "text-white" : "bg-white text-black"
//       }`}
//     >
//       <div></div>
//       {chartData ? (
//         <div className="flex flex-col items-start mt-8 ml-1">
//           <div className="relative w-full">
//             <div className="absolute top-2 left-16 transform[-50%,-50%] z-10 text-2xl">
//               FORWARD PRICES
//             </div>
//             <div>
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={optionsUSDNOK}
//               />
//             </div>
//           </div>
//         </div>
//       ) : (
//         "Loading data..."
//       )}
//     </div>
//   );
// };

// export default SalmonForecast;
