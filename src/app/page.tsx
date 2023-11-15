"use client";

import React, { useState } from "react";
import Biomass from "./components/client/Biomass";
import FXDailyForecast from "./components/client/FXDailyForecast";
import List from "./components/client/List";
import Paper from "./components/client/Paper";
import SalmonForecast from "./components/client/SalmonForecast";
import dynamic from "next/dynamic";
import Smolt from "./components/client/Smolt";
import DarkModeToggle from "./components/client/DarkMode";
import SalmonToday from "./components/client/SalmonToday";
import SwitchButton from "./components/client/SwitchButton";
import ProductionAreas from "./components/client/ProductionAreas";
import Proteins from "./components/client/Proteins";
import Image from "next/image";

// const Proteins = dynamic(() => import("./components/client/Proteins"), {
//   ssr: false, // This will disable Server Side Rendering for this component
//   loading: () => <p>Loading...</p>, // This will display a loading text while the component is being loaded
// });

export default function Home() {
  const [darkMode, setDarkMode] = useState(false); // Manage darkMode state here
  const [activeComponent, setActiveComponent] = useState("SalmonForecast");

  const showSalmonForecast = () => setActiveComponent("SalmonForecast");
  const showPaper = () => setActiveComponent("Paper");

  const salmonForecastDivClasses = `lg:ml-2 text-black h-full w-full overflow-hidden border-solid border-2 rounded-xl bg-white shadow-xl ${
    activeComponent === "SalmonForecast"
      ? "border-blue-700"
      : "border-green-700"
  } ${darkMode ? "dark:text-white dark:bg-gray-800" : ""}`;

  return (
    <main className={darkMode ? "dark" : ""}>
      <div className="">
        <Image
          src={darkMode ? "/imarex-logo-dark.png" : "/imarex-logo.png"}
          width={142}
          height={52}
          alt="Logo"
          priority={true}
        />
        <hr className="border-cyan-500 border-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:ml-2 text-black dark:text-white h-fit w-full overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <List />
          <FXDailyForecast darkMode={darkMode} />
        </div>
        <div className={salmonForecastDivClasses}>
          <SwitchButton
            darkMode={darkMode}
            onShowSalmonForecast={showSalmonForecast}
            onShowPaper={showPaper}
          />
          {activeComponent === "SalmonForecast" && (
            <SalmonForecast darkMode={darkMode} />
          )}
          {activeComponent === "Paper" && <Paper darkMode={darkMode} />}
          {/* <SalmonForecast darkMode={darkMode} /> */}
        </div>
        <div className="lg:ml-2 h-full w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <Smolt darkMode={darkMode} />
        </div>
        <div className="lg:ml-2 h-full w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:text-white dark:border-transparent">
          <Proteins />
        </div>
        <div className="lg:ml-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:text-white dark:border-transparent">
          <Biomass darkMode={darkMode} />
          {/* <Paper darkMode={darkMode} /> */}
        </div>
        <div className="lg:ml-2 text-white h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl dark:bg-gray-800 dark:border-transparent">
          <ProductionAreas darkMode={darkMode} />
        </div>
      </div>
      <div className="text-black dark:text-white">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />{" "}
      </div>
    </main>
  );
}
