"use client";

// DarkModeToggle.tsx
import { useEffect, useState } from "react";

type DarkModeToggleProps = {
  onToggle: () => void;
};

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ onToggle }) => {
  return <button onClick={onToggle}>Toggle Dark Mode</button>;
};

export default DarkModeToggle;
