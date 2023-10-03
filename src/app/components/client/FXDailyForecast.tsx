"use client";
// src/app/components/client/FXDailyForecast.tsx
import React, { useEffect } from "react";

const FXDailyForecast: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dailyForecast");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Check the console for data.</div>;
};

export default FXDailyForecast;
