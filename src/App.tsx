import { useState, useEffect } from "react";

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

export const App = () => {
  const [utility, setUtility] = useState<"dien" | "nuoc">("dien");
  const [month, setMonth] = useState(`${yyyy}-${mm}`);

  const houses = Object.keys(rentalData);
  const [house, setHouse] = useState(houses[0]);

  const rooms = Object.keys(rentalData[house]);
  const [room, setRoom] = useState(rooms[0]);

  useEffect(() => {
    const rooms = Object.keys(rentalData[house]);
    setRoom(rooms[0]);
  }, [house]);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-4">
      <Navbar houses={houses} house={house} setHouse={setHouse} />
      <div className="flex gap-2">
        <UtilityTabs onSelect={setUtility} />
        <MonthPicker month={month} setMonth={setMonth} />
      </div>
      <RoomSelector rooms={rooms} room={room} setRoom={setRoom} />
      <MeterInput unit={utility === "dien" ? "kWh" : "m³"} />
      <MeterPhoto />
    </div>
  );
};
