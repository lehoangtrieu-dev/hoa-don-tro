import { useState } from "react";

import { Navbar } from "./components/Navbar";
import { RoomSelector } from "./components/RoomSelector";
import { UtilityTabs } from "./components/UtilityTabs";

export const App = () => {
  const [utility, setUtility] = useState<"dien" | "nuoc">("dien");

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-2">
      <Navbar />
      <RoomSelector />
      <UtilityTabs onSelect={setUtility} />
    </div>
  );
};
