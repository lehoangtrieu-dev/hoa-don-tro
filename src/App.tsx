import { useState } from "react";

import { Navbar } from "./components/Navbar";
import { UtilityTabs } from "./components/UtilityTabs";
import { MonthPicker } from "./components/MonthPicker";
import { RoomSelector } from "./components/RoomSelector";
import { MeterInput } from "./components/MeterInput";
import { MeterPhoto } from "./components/MeterPhoto";

import { type RentalData } from "./type";

const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();

const rentalData: RentalData = {
  "1": {
    "P.101": {
      "2026-09": {
        dien: {
          value: 1485,
          image: undefined,
        },
        nuoc: {
          value: 85,
          image: undefined,
        },
      },
      "2026-10": {
        dien: {},
        nuoc: {},
      },
    },
    "P.102": {},
  },
  "2": {},
};

const houses = Object.keys(rentalData);

export const App = () => {
  const [utility, setUtility] = useState<"dien" | "nuoc">("dien");
  const [month, setMonth] = useState(`${yyyy}-${mm}`);
  const [house, setHouse] = useState(houses[0]);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-4">
      <Navbar houses={houses} house={house} setHouse={setHouse} />
      <div className="flex gap-2">
        <UtilityTabs onSelect={setUtility} />
        <MonthPicker month={month} setMonth={setMonth} />
      </div>
      <RoomSelector />
      <MeterInput unit={utility === "dien" ? "kWh" : "m³"} />
      <MeterPhoto />
    </div>
  );
};
