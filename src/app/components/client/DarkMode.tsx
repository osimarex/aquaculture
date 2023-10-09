// components/client/DarkMode.tsx or similar file path
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

const DarkModeToggle: React.FC<Props> = ({ darkMode, setDarkMode }) => {
  const handleToggle = () => {
    setDarkMode((prevMode) => {
      if (!prevMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return !prevMode;
    });
  };

  return <button onClick={handleToggle}>Toggle Dark Mode</button>;
};

export default DarkModeToggle;
