import { useState } from "react";

import { Navbar } from "./components/Navbar";
import { RoomSelector } from "./components/RoomSelector";
import { UtilityTabs } from "./components/UtilityTabs";
import { MeterInput } from "./components/MeterInput";
import { MeterPhoto } from "./components/MeterPhoto";

export const App = () => {
  const [utility, setUtility] = useState<"dien" | "nuoc">("dien");

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-4">
      <Navbar />
      <RoomSelector />
      <UtilityTabs onSelect={setUtility} />
      <MeterInput unit={utility === "dien" ? "kWh" : "m³"} />
      <MeterPhoto />
    </div>
  );
};
