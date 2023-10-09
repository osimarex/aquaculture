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
      onClick={handleToggle}
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      {darkMode ? (
        <img src="/moon.png" alt="Toggle to Light Mode" width={"40px"} />
      ) : (
        <img src="/sun.png" alt="Toggle to Dark Mode" width={"40px"} />
      )}
    </button>
  );
};

export default DarkModeToggle;
