import { useState, useEffect } from "react";

import { Navbar } from "./components/Navbar";
import { UtilityTabs } from "./components/UtilityTabs";
import { MonthPicker } from "./components/MonthPicker";
import { RoomSelector } from "./components/RoomSelector";
import { MeterInput } from "./components/MeterInput";
import { MeterPhoto } from "./components/MeterPhoto";
import { LoadingModal } from "./components/LoadingModal";
import { scanMeterWithGemini } from "./services/gemini";

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

  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const houses = Object.keys(data);
  const house =
    (houses.includes(selectedHouse) ? selectedHouse : houses[0]) || "";

  const rooms = data[house] ? Object.keys(data[house]) : [];
  const room = (rooms.includes(selectedRoom) ? selectedRoom : rooms[0]) || "";

  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const utilityRecord = data[house]?.[room]?.[month]?.[utility];

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

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!utilityRecord?.image || utilityRecord?.value !== undefined) return;

    const performScan = async () => {
      setIsScanning(true);
      setScanError(null);

      try {
        const scannedValue = await scanMeterWithGemini(utilityRecord.image);

        if (scannedValue === null || isNaN(scannedValue)) {
          throw new Error(
            "Không nhận diện được số trên công tơ. Vui lòng chụp rõ hơn.",
          );
        }

        updateUtilityRecord({ value: scannedValue });
        setIsScanning(false);
      } catch (err) {
        if (err instanceof Error) {
          const msg =
            err.message?.match(/"message":\s*"([^"]+)"/)?.[1] || err.message;
          setScanError(msg || "Đã xảy ra lỗi khi quét ảnh công tơ.");
          setIsScanning(false);
        }
      } finally {
        setIsScanning(false);
      }
    };

    performScan();
  }, [utilityRecord?.image]);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-4">
      <LoadingModal
        isOpen={isScanning || !!scanError}
        error={scanError}
        onCancel={() => {
          setIsScanning(false);
          setScanError(null);
        }}
      />
      <Navbar
        data={data}
        setData={setData}
        houses={houses}
        house={house}
        setHouse={setSelectedHouse}
      />
      <div className="flex gap-2">
        <UtilityTabs onSelect={setUtility} />
        <MonthPicker month={month} setMonth={setMonth} />
      </div>
      <RoomSelector rooms={rooms} room={room} setRoom={setSelectedRoom} />
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
