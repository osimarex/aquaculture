import FXDailyForecast from "./components/client/FXDailyForecast";
import List from "./components/client/List";

export default function Home() {
  return (
    <main>
      <h1 className="text-red-600">Aquaculture</h1>
      <List />
      <FXDailyForecast />
    </main>
  );
}
