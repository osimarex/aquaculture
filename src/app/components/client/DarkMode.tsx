import React, { Dispatch, SetStateAction, useEffect } from "react";
import Image from "next/image";

interface Props {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

const DarkModeToggle: React.FC<Props> = ({ darkMode, setDarkMode }) => {
  // Check localStorage when component mounts
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      const isDarkMode = storedDarkMode === "true";
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const handleToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", newMode.toString()); // Save preference in localStorage
      return newMode;
    });
  };

  return (
    <button
      className="cursor-pointer fixed bottom-10 right-4"
      onClick={handleToggle}
    >
      {darkMode ? (
        <Image
          src="/moon.png"
          alt="Toggle to Light Mode"
          width={60}
          height={40}
          priority={true}
        />
      ) : (
        <Image
          src="/sun.png"
          alt="Toggle to Dark Mode"
          width={60}
          height={40}
          priority={true}
          className="bg-white rounded-full"
        />
      )}
    </button>
  );
};

export default DarkModeToggle;
