"use client";

import React, { useState } from "react";
import Biomass from "./components/client/Biomass";
import FXDailyForecast from "./components/client/FXDailyForecast";
import List from "./components/client/List";
import Paper from "./components/client/Paper";
import SalmonForecast from "./components/client/SalmonForecast";
import dynamic from "next/dynamic";
import Map from "./components/client/Map";
import Smolt from "./components/client/Smolt";
import DarkModeToggle from "./components/client/DarkMode";

const Proteins = dynamic(() => import("./components/client/Proteins"), {
  ssr: false, // This will disable Server Side Rendering for this component
  loading: () => <p>Loading...</p>, // This will display a loading text while the component is being loaded
});

export default function Home() {
  const [darkMode, setDarkMode] = useState(false); // Manage darkMode state here

  return (
    <main className={darkMode ? "dark" : ""}>
      <div className="">
        <img
          src={darkMode ? "/imarex-logo-dark.png" : "/imarex-logo.png"}
          alt="Logo"
          style={{ width: "142px", height: "52px" }}
        />
        <hr className="border-cyan-500 border-2" />
      </div>
      <div className="flex flex-1">
        <div className="mt-2 h-fit w-full max-w-lg overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <List />
          <FXDailyForecast darkMode={darkMode} />
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <SalmonForecast darkMode={darkMode} />
          {/* Pass darkMode state here */}
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <Smolt darkMode={darkMode} />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="mt-2 h-fit w-full max-w-lg overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:text-white dark:border-transparent">
          <Proteins />
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:text-white dark:border-transparent">
          <Biomass series={[]} darkMode={darkMode} />
          <Paper darkMode={darkMode} />
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <Map darkMode={darkMode} />
        </div>
      </div>
      <div className="text-black dark:text-white">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />{" "}
        {/* Pass darkMode state and setDarkMode function here */}
      </div>
    </main>
  );
}
