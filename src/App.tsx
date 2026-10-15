import { useState, useEffect } from "react";

import { Navbar } from "./components/Navbar";
import { UtilityTabs } from "./components/UtilityTabs";
import { MonthPicker } from "./components/MonthPicker";
import { RoomSelector } from "./components/RoomSelector";
import { MeterInput } from "./components/MeterInput";
import { MeterPhoto } from "./components/MeterPhoto";

import { type RentalData, type UtilityRecord } from "./type";

const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();

export const App = () => {
  const [data, setData] = useState<RentalData>(() => {
    const savedData = localStorage.getItem("data");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [utility, setUtility] = useState<"dien" | "nuoc">("dien");
  const [month, setMonth] = useState(`${yyyy}-${mm}`);

  const houses = Object.keys(data);
  const [house, setHouse] = useState(houses[0]);

  const rooms = data[house] ? Object.keys(data[house]) : [];
  const [room, setRoom] = useState(rooms[0]);

  const utilityRecord = data[house]?.[room]?.[month]?.[utility];

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!data[house] && houses.length > 0) {
      setHouse(houses[0]);
    }
  }, [data, house, houses]);

  useEffect(() => {
    const rooms = data[house] ? Object.keys(data[house]) : [];
    setRoom(rooms[0]);
  }, [house, data]);

  const updateUtilityRecord = (fields: Partial<UtilityRecord>) => {
    setData((prev) => {
      const next = structuredClone(prev);

      next[house] ??= {};
      next[house][room] ??= {};
      next[house][room][month] ??= { dien: {}, nuoc: {} };
      next[house][room][month][utility] ??= {};

      Object.assign(next[house][room][month][utility], fields);
      return next;
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-4">
      <Navbar
        data={data}
        setData={setData}
        houses={houses}
        house={house}
        setHouse={setHouse}
      />
      <div className="flex gap-2">
        <UtilityTabs onSelect={setUtility} />
        <MonthPicker month={month} setMonth={setMonth} />
      </div>
      <RoomSelector rooms={rooms} room={room} setRoom={setRoom} />
      <MeterInput
        value={utilityRecord?.value}
        setValue={(val) => updateUtilityRecord({ value: val })}
        unit={utility === "dien" ? "kWh" : "m³"}
      />
      <MeterPhoto
        image={utilityRecord?.image}
        setImage={(img) => updateUtilityRecord({ image: img })}
      />
    </div>
  );
};
