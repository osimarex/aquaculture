import Biomass from "./components/client/Biomass";
import FXDailyForecast from "./components/client/FXDailyForecast";
import List from "./components/client/List";
import Paper from "./components/client/Paper";
import SalmonForecast from "./components/client/SalmonForecast";
import dynamic from "next/dynamic";
import Map from "./components/client/Map";
import Smolt from "./components/client/Smolt";
import { useState } from "react";

const Proteins = dynamic(() => import("./components/client/Proteins"), {
  ssr: false, // This will disable Server Side Rendering for this component
  loading: () => <p>Loading...</p>, // This will display a loading text while the component is being loaded
});

export default function Home() {
  return (
    <main className="">
      <div className="">
        <img
          src="/imarex-logo.png"
          alt="Logo"
          style={{ width: "142px", height: "52px" }}
        />
        <hr className="border-cyan-500 border-2" />
      </div>
      <div className="flex flex-1">
        <div className="mt-2 h-fit w-full max-w-lg overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl">
          <List />
          <FXDailyForecast />
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl">
          <SalmonForecast />
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl ">
          <Smolt />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="mt-2 h-fit w-full max-w-lg overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl ">
          <Proteins />
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl ">
          <Biomass series={[]} />
          <Paper />
        </div>
        <div className="ml-4 mt-2 h-fit w-full overflow-hidden border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl ">
          <Map />
        </div>
      </div>
    </main>
  );
}
