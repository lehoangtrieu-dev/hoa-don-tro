import { useState, useEffect, useRef } from "react";
import { Alert } from "@heroui/react";

import { SettingsModal } from "./components/settings/SettingsModal";
import { UtilityTabs } from "./components/UtilityTabs";
import { PeriodModal } from "./components/PeriodModal";
import { RoomSelector } from "./components/RoomSelector";
import { MeterInput } from "./components/MeterInput";
import { MeterPhoto } from "./components/MeterPhoto";
import { MeterOutput } from "./components/MeterOutput";
import { LoadingModal } from "./components/LoadingModal";
import { scanMeterWithGemini } from "./services/gemini";
import {
  auth,
  saveToFirestore,
  subscribeToFirestore,
} from "./services/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import type {
  RentalData,
  UtilityRecord,
  UtilityType,
  HouseConfig,
  RoomConfig,
} from "./type";

const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();

export const App = () => {
  const [data, setData] = useState<RentalData>(() => {
    const savedData = localStorage.getItem("data");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [user, setUser] = useState<User | null>(null);
  const isRemoteUpdateRef = useRef(false);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (currentUser) {
        unsubscribeFirestore = subscribeToFirestore(
          currentUser.uid,
          (cloudData) => {
            if (cloudData && Object.keys(cloudData).length > 0) {
              isRemoteUpdateRef.current = true;
              setData(cloudData);
            }
          },
        );
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const [utility, setUtility] = useState<UtilityType>("electricity");
  const [month, setMonth] = useState(() => {
    return localStorage.getItem("selectedMonth") || `${yyyy}-${mm}`;
  });

  const [selectedHouse, setSelectedHouse] = useState(() => {
    return localStorage.getItem("selectedHouse") || "";
  });
  const [selectedRoom, setSelectedRoom] = useState(() => {
    return localStorage.getItem("selectedRoom") || "";
  });

  useEffect(() => {
    localStorage.setItem("selectedMonth", month);
  }, [month]);

  useEffect(() => {
    if (selectedHouse) {
      localStorage.setItem("selectedHouse", selectedHouse);
    }
  }, [selectedHouse]);

  useEffect(() => {
    if (selectedRoom) {
      localStorage.setItem("selectedRoom", selectedRoom);
    }
  }, [selectedRoom]);

  const houses = Object.keys(data).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
  const house =
    (houses.includes(selectedHouse) ? selectedHouse : houses[0]) || "";

  const rooms =
    data[house]?.roomOrder ??
    (data[house]?.rooms
      ? Object.keys(data[house].rooms).sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
        )
      : []);
  const room = (rooms.includes(selectedRoom) ? selectedRoom : rooms[0]) || "";

  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const lastScannedKeyRef = useRef<string | null>(null);

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

  const updateHouseConfig = (
    houseName: string,
    fields: Partial<HouseConfig>,
  ) => {
    setData((prev) => {
      const next = structuredClone(prev);

      next[houseName] ??= { rooms: {} };
      next[houseName].config ??= {};

      Object.assign(next[houseName].config!, fields);
      return next;
    });
  };

  const updateRoomConfig = (fields: Partial<RoomConfig>) => {
    setData((prev) => {
      const next = structuredClone(prev);

      next[house] ??= { rooms: {} };
      next[house].rooms[room] ??= { months: {} };
      next[house].rooms[room].config ??= {};

      Object.assign(next[house].rooms[room].config!, fields);
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    if (!user) return;

    const timer = setTimeout(async () => {
      try {
        await saveToFirestore(user.uid, data);
      } catch (err) {
        console.error("Failed to sync data to Firestore:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [data, user]);

  useEffect(() => {
    const currentKey = `${house}-${room}-${month}-${utility}`;

    if (!utilityRecord?.image) {
      lastScannedKeyRef.current = null;
      return;
    }

    if (
      utilityRecord?.value !== undefined ||
      lastScannedKeyRef.current === currentKey
    ) {
      return;
    }

    lastScannedKeyRef.current = currentKey;

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
      } catch (err) {
        if (err instanceof Error) {
          const msg =
            err.message?.match(/"message":\s*"([^"]+)"/)?.[1] || err.message;
          setScanError(msg || "Đã xảy ra lỗi khi quét ảnh công tơ.");
        }
      } finally {
        setIsScanning(false);
      }
    };

    performScan();
  }, [utilityRecord?.image, house, room, month, utility]);

  return (
    <div className="w-full lg:max-w-5xl mx-auto flex flex-col items-center p-4 md:py-8 md:px-6 gap-4 md:gap-6 min-h-screen">
      <LoadingModal
        isOpen={isScanning || !!scanError}
        error={scanError}
        onCancel={() => {
          setIsScanning(false);
          setScanError(null);
        }}
      />
      <div className="w-full flex justify-between items-center max-w-xs">
        <SettingsModal
          data={data}
          setData={setData}
          house={house}
          houses={houses}
          updateHouseConfig={updateHouseConfig}
          user={user}
          setUser={setUser}
        />
        <PeriodModal
          data={data}
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
          <MeterOutput
            month={month}
            data={data}
            house={house}
            room={room}
            updateRoomConfig={updateRoomConfig}
          />
        ) : (
          <>
            {utility === "water" &&
              data[house]?.config?.waterBillingType === "person" && (
                <Alert status="accent" className="w-full max-w-xs">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>
                      Nhà này tính tiền nước <strong>theo số người</strong>
                    </Alert.Title>
                    <Alert.Description>
                      Bạn có thể chỉnh số người ở trong tab{" "}
                      <strong>Hóa đơn &gt; Chỉnh sửa</strong>.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
              )}
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
