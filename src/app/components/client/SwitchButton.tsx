import React from "react";

// SwitchButton component
interface Props {
  onShowSalmonForecast: () => void;
  onShowPaper: () => void;
  darkMode: boolean;
}

const SwitchButton: React.FC<Props> = ({
  onShowSalmonForecast,
  onShowPaper,
  darkMode,
}) => {
  return (
    <div className="flex justify-between items-center">
      <button
        className="bg-blue-700 hover:bg-sky-400 text-white font-bold py-6 w-3/4 rounded"
        onClick={onShowSalmonForecast}
      >
        Salmon Forecast
      </button>
      <button
        className="bg-green-700 hover:bg-green-500 text-white font-bold py-6 w-3/4 rounded"
        onClick={onShowPaper}
      >
        Forward Price
      </button>
    </div>
  );
};

export default SwitchButton;
