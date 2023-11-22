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
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchForwardPrices = async () => {
      try {
        const response = await fetch("/api/historicFuturePrices");
        const priceData = await response.json();
        const latestPriceData = priceData[priceData.length - 1];
        setPrices(latestPriceData); // Store the latest prices
      } catch (error) {
        console.error("Error fetching forward prices:", error);
      }
    };
    fetchForwardPrices();
  }, []);

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
      // Extract week numbers and remove duplicates
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

      setChartData([{ name: "Salmon Price", data: seriesData }]);
      setWeekNumbers(uniqueWeekNumbers.map(String)); // Use this for the x-axis categories
      addContractSeries(uniqueWeekNumbers);
    };

    type DataPoint = { x: number; y: number };

    const addContractSeries = (uniqueWeekNumbers: any[]) => {
      const currentDate = new Date();
      const endDate29Weeks = addWeeks(currentDate, 29);
      const currentYear = currentDate.getFullYear();
      const nextMonth = currentDate.getMonth() + 1;

      // Helper function to get the last day of a month
      const lastDayOfMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0);
      };

      // Helper function to calculate the end of a quarter
      const getQuarterEndMonth = (quarter: number) => {
        return quarter * 3;
      };

      // Expected contract keys
      const expectedKeys = ["0", "1", "2", "3", "4", "5", "6", "12"];

      // Adjusted single series for all contracts
      let combinedContractSeries: {
        name: string;
        data: DataPoint[];
        type: string;
        dashStyle: string;
        color: string;
      } = {
        name: "Combined Contracts",
        data: [],
        type: "line",
        dashStyle: "Solid",
        color: "#38B6FF",
      };

      // Helper function to calculate week number from a date
      const getWeekNumber = (date: Date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceYearStart =
          (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000);
        return Math.ceil(
          (daysSinceYearStart + firstDayOfYear.getDay() + 1) / 7
        );
      };

      let lastContractEndDate = currentDate; // Start from the current date

      // Loop through each key in the prices object
      Object.keys(prices).forEach((key) => {
        // Skip if the key is not expected or the price is not a number
        if (!expectedKeys.includes(key) || isNaN(prices[key])) {
          return;
        }

        const contractPrice = prices[key];
        let contractEndDate;

        if (key === "0" || key === "1" || key === "2" || key === "3") {
          // Monthly contracts
          const monthOffset = parseInt(key, 10);
          contractEndDate = lastDayOfMonth(
            currentYear,
            nextMonth + monthOffset
          );
        } else {
          // Quarterly contracts
          const quarter = parseInt(key, 10) / 3;
          const quarterEndMonth = getQuarterEndMonth(quarter);
          contractEndDate = lastDayOfMonth(
            currentYear + 1,
            quarterEndMonth - 1
          );
        }

        // Check if the contract end date is within the 29-week range
        const isWithinRange = contractEndDate <= endDate29Weeks;

        if (isWithinRange) {
          const startWeekNumber = getWeekNumber(lastContractEndDate);
          const endWeekNumber = getWeekNumber(contractEndDate);

          // Map these week numbers to x-axis indices
          let startIndex = uniqueWeekNumbers.indexOf(startWeekNumber);
          let endIndex = uniqueWeekNumbers.indexOf(endWeekNumber);

          // Log for debugging
          console.log(
            `Contract ${key}: Start Week: ${startWeekNumber}, End Week: ${endWeekNumber}`
          );
          console.log(
            `Indices: Start Index: ${startIndex}, End Index: ${endIndex}`
          );

          // Create data points for this contract
          for (let i = startIndex; i <= endIndex; i++) {
            combinedContractSeries.data.push({ x: i, y: contractPrice });
          }

          // Update lastContractEndDate
          lastContractEndDate = contractEndDate;
        }
      });

      // Add the combined series to the chart data
      setChartData((prevChartData) =>
        prevChartData
          ? [...prevChartData, combinedContractSeries]
          : [combinedContractSeries]
      );
    };

    fetchData();
  }, [prices]);

  // Helper function to calculate the week number of a date
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Helper function to add weeks to a date
  const addWeeks = (date: Date, weeks: number) => {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  };

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
    yAxis: {
      gridLineColor: darkMode ? "#333333" : "#ededed",
      title: {
        text: "",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
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
                SALMON FORECAST
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
