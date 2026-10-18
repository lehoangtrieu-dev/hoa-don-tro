import { useState, useEffect } from "react";

import { SettingsModal } from "./components/settings/SettingsModal";
import { UtilityTabs } from "./components/UtilityTabs";
import { PeriodModal } from "./components/PeriodModal";
import { RoomSelector } from "./components/RoomSelector";
import { MeterInput } from "./components/MeterInput";
import { MeterPhoto } from "./components/MeterPhoto";
import { MeterOutput } from "./components/MeterOutput";
import { LoadingModal } from "./components/LoadingModal";
import { scanMeterWithGemini } from "./services/gemini";

import { type RentalData, type UtilityRecord, type UtilityType } from "./type";

const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();

export const App = () => {
  const [data, setData] = useState<RentalData>(() => {
    const savedData = localStorage.getItem("data");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [utility, setUtility] = useState<UtilityType>("electricity");
  const [month, setMonth] = useState(`${yyyy}-${mm}`);

  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const houses = Object.keys(data);
  const house =
    (houses.includes(selectedHouse) ? selectedHouse : houses[0]) || "";

  const rooms = data[house]?.rooms ? Object.keys(data[house].rooms) : [];
  const room = (rooms.includes(selectedRoom) ? selectedRoom : rooms[0]) || "";

  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const utilityRecord =
    utility !== "bill"
      ? data[house]?.rooms[room]?.months[month]?.[utility]
      : undefined;

  const updateUtilityRecord = (fields: Partial<UtilityRecord>) => {
    if (utility === "bill") return;
    setData((prev) => {
      const next = structuredClone(prev);

      next[house] ??= { rooms: {} };
      next[house].rooms[room] ??= { months: {} };
      next[house].rooms[room].months[month] ??= {};
      next[house].rooms[room].months[month][utility] ??= {};

      Object.assign(next[house].rooms[room].months[month][utility]!, fields);
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
      <div className="w-full flex justify-between items-center">
        <SettingsModal data={data} setData={setData} houses={houses} />
        <PeriodModal
          houses={houses}
          house={house}
          setHouse={setSelectedHouse}
          month={month}
          setMonth={setMonth}
        />
      </div>
      <UtilityTabs onSelect={setUtility} />
      <RoomSelector rooms={rooms} room={room} setRoom={setSelectedRoom} />
      {room ? (
        utility === "bill" ? (
          <MeterOutput month={month} data={data} house={house} room={room} />
        ) : (
          <>
            <MeterInput
              value={utilityRecord?.value}
              setValue={(val) => updateUtilityRecord({ value: val })}
              unit={utility === "electricity" ? "kWh" : "m³"}
            />
            <MeterPhoto
              image={utilityRecord?.image}
              setImage={(img) => updateUtilityRecord({ image: img })}
            />
          </>
        )
      ) : (
        <div className="text-center py-6 text-muted">
          <p className="text-sm font-medium">Chưa có phòng trọ nào</p>
          <p className="text-xs mt-1">Vào cài đặt để thêm phòng trọ đầu tiên</p>
        </div>
      )}
    </div>
  );
};
