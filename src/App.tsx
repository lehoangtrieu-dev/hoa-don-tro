import { useState } from "react";

import { Navbar } from "./components/Navbar";
import { UtilityTabs } from "./components/UtilityTabs";
import { MonthPicker } from "./components/MonthPicker";
import { RoomSelector } from "./components/RoomSelector";
import { MeterInput } from "./components/MeterInput";
import { MeterPhoto } from "./components/MeterPhoto";

export const App = () => {
  const [utility, setUtility] = useState<"dien" | "nuoc">("dien");

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-4">
      <Navbar />
      <div className="flex gap-2">
        <UtilityTabs onSelect={setUtility} />
        <MonthPicker />
      </div>
      <RoomSelector />
      <MeterInput unit={utility === "dien" ? "kWh" : "m³"} />
      <MeterPhoto />
    </div>
  );
};
