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
import SalmonToday from "./components/client/SalmonToday";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-fit">
        <div className="text-black dark:text-white h-fit w-full overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <List />
          <FXDailyForecast darkMode={darkMode} />
        </div>
        <div className="lg:ml-2 text-black dark:text-white h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <SalmonToday />
          <SalmonForecast darkMode={darkMode} />
        </div>
        <div className="lg:ml-2 w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <Smolt darkMode={darkMode} />
        </div>
        <div className="lg:ml-2 h-full w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:text-white dark:border-transparent">
          <Proteins />
        </div>
        <div className="lg:ml-2 h-full w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:text-white dark:border-transparent">
          <Biomass darkMode={darkMode} />
          <Paper darkMode={darkMode} />
        </div>
        <div className="lg:ml-2 h-full w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <Map darkMode={darkMode} />
        </div>
      </div>
      <div className="text-black dark:text-white">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />{" "}
      </div>
    </main>
  );
}
