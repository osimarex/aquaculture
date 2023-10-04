import FXDailyForecast from "./components/client/FXDailyForecast";
import List from "./components/client/List";

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
      <div className="mt-2 w-fit border-solid border-2 border-slate-200 rounded-xl">
        <List />
        <FXDailyForecast />
      </div>
    </main>
  );
}
