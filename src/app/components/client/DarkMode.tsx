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

  return (
    <button
      className="cursor-pointer fixed bottom-10 right-4"
      onClick={handleToggle}
    >
      {darkMode ? (
        <img src="/moon.png" alt="Toggle to Light Mode" className="w-[60px] " />
      ) : (
        <img src="/sun.png" alt="Toggle to Dark Mode" className="w-[60px]" />
      )}
    </button>
  );
};

export default DarkModeToggle;
