import FXDailyForecast from "./components/client/FXDailyForecast";
import List from "./components/client/List";
import SalmonForecast from "./components/client/SalmonForecast";

export default function Home() {
  return (
    <main>
      <div>
        <img
          src="/imarex-logo.png"
          alt="Logo"
          style={{ width: "142px", height: "52px" }}
        />
        <hr className="border-cyan-500 border-2" />
      </div>
      <div className="flex flex-grow">
        <div className="mt-2 w-fit border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl">
          <div className="">
            <List />
            <FXDailyForecast />
          </div>
        </div>
        <div className="ml-4 mt-2 h-fit w-fit border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl">
          <SalmonForecast />
        </div>
      </div>
    </main>
  );
}
