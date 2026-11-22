import { useState, useEffect, useRef } from "react";
import { Alert, Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "@gravity-ui/icons";

import { SettingsModal } from "./components/settings/SettingsModal";
import { UtilityTabs } from "./components/UtilityTabs";
import { PeriodModal } from "./components/PeriodModal";
import { RoomSelector } from "./components/RoomSelector";
import { DesktopSidebar } from "./components/DesktopSidebar";
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

const getPreviousMonth = (monthStr: string): string => {
  const [year, m] = monthStr.split("-").map(Number);
  const prevDate = new Date(year, m - 2, 1);
  return `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
};

const cleanExpiredMonths = (rawData: RentalData): RentalData => {
  const currentDate = new Date();
  const currentMonthIndex =
    currentDate.getFullYear() * 12 + currentDate.getMonth();

  let hasChanged = false;
  const nextData = structuredClone(rawData);

  for (const houseKey of Object.keys(nextData)) {
    const houseObj = nextData[houseKey];
    const autoDeleteSetting = houseObj?.config?.autoDeleteMonths;
    if (!autoDeleteSetting || autoDeleteSetting === "never") continue;

    const thresholdMonths = Number(autoDeleteSetting);
    if (isNaN(thresholdMonths) || thresholdMonths <= 0) continue;

    if (!houseObj?.rooms) continue;

    for (const roomKey of Object.keys(houseObj.rooms)) {
      const roomObj = houseObj.rooms[roomKey];
      if (!roomObj?.months) continue;

      for (const mStr of Object.keys(roomObj.months)) {
        const [yearStr, monthStr] = mStr.split("-");
        const y = Number(yearStr);
        const m = Number(monthStr);

        if (!isNaN(y) && !isNaN(m)) {
          const recordMonthIndex = y * 12 + (m - 1);
          if (currentMonthIndex - recordMonthIndex > thresholdMonths) {
            delete roomObj.months[mStr];
            hasChanged = true;
          }
        }
      }
    }
  }

  return hasChanged ? nextData : rawData;
};

export const App = () => {
  const [data, setData] = useState<RentalData>(() => {
    const savedData = localStorage.getItem("data");
    const parsed: RentalData = savedData ? JSON.parse(savedData) : {};
    return cleanExpiredMonths(parsed);
  });

  const [user, setUser] = useState<User | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const isRemoteUpdateRef = useRef(false);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsCloudSynced(false);

      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (currentUser) {
        unsubscribeFirestore = subscribeToFirestore(
          currentUser.uid,
          (cloudData) => {
            if (cloudData && Object.keys(cloudData).length > 0) {
              const cleanedData = cleanExpiredMonths(cloudData);
              isRemoteUpdateRef.current = cleanedData === cloudData;
              setData(cleanedData);
            }
            setIsCloudSynced(true);
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

  const prevMonth = getPreviousMonth(month);
  const prevUtilityValue =
    utility !== "bill"
      ? data[house]?.rooms[room]?.months[prevMonth]?.[utility]?.value
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

  const updateMonthPaid = (paid: boolean) => {
    setData((prev) => {
      const next = structuredClone(prev);

      next[house] ??= { rooms: {} };
      next[house].rooms[room] ??= { months: {} };
      next[house].rooms[room].months[month] ??= {};

      next[house].rooms[room].months[month].paid = paid;
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

  const deleteMonthData = (houseName: string, targetMonth: string) => {
    if (!houseName || !targetMonth) return;
    setData((prev) => {
      const houseObj = prev[houseName];
      if (!houseObj?.rooms) return prev;

      let hasChanged = false;
      const next = structuredClone(prev);

      for (const roomKey of Object.keys(next[houseName].rooms)) {
        const roomObj = next[houseName].rooms[roomKey];
        if (roomObj?.months && targetMonth in roomObj.months) {
          delete roomObj.months[targetMonth];
          hasChanged = true;
        }
      }

      return hasChanged ? next : prev;
    });
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    if (!user || !isCloudSynced) return;

    const timer = setTimeout(async () => {
      try {
        await saveToFirestore(user.uid, data);
      } catch (err) {
        console.error("Failed to sync data to Firestore:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [data, user, isCloudSynced]);

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

  const currentRoomIndex = rooms.indexOf(room);

  return (
    <div className="min-h-screen w-full lg:flex lg:flex-row">
      <LoadingModal
        isOpen={isScanning || !!scanError}
        error={scanError}
        onCancel={() => {
          setIsScanning(false);
          setScanError(null);
        }}
      />

      <DesktopSidebar
        data={data}
        houses={houses}
        house={house}
        setHouse={setSelectedHouse}
        month={month}
        setMonth={setMonth}
        deleteMonthData={deleteMonthData}
        rooms={rooms}
        room={room}
        setRoom={setSelectedRoom}
      />

      <main className="w-full flex-1 flex flex-col items-center p-4 md:py-8 md:px-6 lg:px-10 gap-4 md:gap-6 min-w-0">
        <div className="w-full flex flex-col items-center gap-4 md:gap-6 lg:max-w-4xl lg:flex-row lg:justify-between">
          {/* Mobile header (unchanged) */}
          <div className="w-full flex justify-between items-center max-w-xs lg:hidden">
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
              deleteMonthData={deleteMonthData}
            />
          </div>

          {/* Desktop left: Active room title + prev/next */}
          <div className="hidden lg:flex items-center gap-1.5 min-w-44">
            {room && (
              <>
                <Button
                  variant="tertiary"
                  size="sm"
                  isIconOnly
                  aria-label="Phòng trước"
                  isDisabled={currentRoomIndex <= 0}
                  onPress={() => setSelectedRoom(rooms[currentRoomIndex - 1])}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="font-bold text-lg px-2 truncate max-w-28">
                  {room}
                </span>
                <Button
                  variant="tertiary"
                  size="sm"
                  isIconOnly
                  aria-label="Phòng tiếp theo"
                  isDisabled={
                    currentRoomIndex === -1 ||
                    currentRoomIndex >= rooms.length - 1
                  }
                  onPress={() => setSelectedRoom(rooms[currentRoomIndex + 1])}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </>
            )}
          </div>

          <UtilityTabs selectedKey={utility} onSelect={setUtility} />

          {/* Desktop right: Settings */}
          <div className="hidden lg:flex justify-end min-w-44">
            <SettingsModal
              data={data}
              setData={setData}
              house={house}
              houses={houses}
              updateHouseConfig={updateHouseConfig}
              user={user}
              setUser={setUser}
            />
          </div>
        </div>

        {/* Mobile room selector (unchanged) */}
        <div className="lg:hidden">
          <RoomSelector
            rooms={rooms}
            room={room}
            setRoom={setSelectedRoom}
            data={data}
            house={house}
            month={month}
          />
        </div>

        {room ? (
          utility === "bill" ? (
            <div className="w-full flex flex-col items-center gap-4 md:gap-6 lg:max-w-4xl">
              <MeterOutput
                month={month}
                data={data}
                house={house}
                room={room}
                updateRoomConfig={updateRoomConfig}
                updateMonthPaid={updateMonthPaid}
              />
            </div>
          ) : (
            <>
              {utility === "water" &&
                data[house]?.config?.waterBillingType === "person" && (
                  <Alert status="accent" className="w-full max-w-xs lg:max-w-4xl">
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
              <div className="w-full flex flex-col items-center gap-4 md:gap-6 lg:max-w-4xl lg:mt-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:rounded-3xl lg:border lg:border-border/60 lg:bg-surface/40 lg:p-10">
                <div className="flex flex-col items-center justify-center gap-3">
                  <MeterInput
                    value={utilityRecord?.value}
                    setValue={(val) => updateUtilityRecord({ value: val })}
                    unit={utility === "electricity" ? "kWh" : "m³"}
                  />
                  {prevUtilityValue !== undefined && (
                    <p className="hidden lg:block text-sm text-muted">
                      Tháng trước:{" "}
                      <span className="font-semibold text-foreground">
                        {prevUtilityValue.toLocaleString("vi-VN")}{" "}
                        {utility === "electricity" ? "kWh" : "m³"}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex justify-center">
                  <MeterPhoto
                    image={utilityRecord?.image}
                    setImage={(img) => updateUtilityRecord({ image: img })}
                  />
                </div>
              </div>
            </>
          )
        ) : (
          <div className="text-center py-6 text-muted">
            <p className="text-sm font-medium">Chưa có phòng trọ nào</p>
            <p className="text-xs mt-1">
              Vào cài đặt để thêm phòng trọ đầu tiên
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
