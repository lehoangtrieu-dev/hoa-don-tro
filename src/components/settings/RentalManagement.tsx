import { useState } from "react";
import {
  ChevronDown,
  Pencil,
  TrashBin,
  Plus,
  Thunderbolt,
  Droplet,
  House,
  ChevronLeft,
  ChevronRight,
} from "@gravity-ui/icons";
import { Button, Accordion, Input, Chip } from "@heroui/react";
import { PriceInputItem } from "./PriceInputItem";
import type { RentalData, HouseConfig } from "../../type";

interface Props {
  data: RentalData;
  setData: React.Dispatch<React.SetStateAction<RentalData>>;
  houses: string[];
  updateHouseConfig: (houseName: string, fields: Partial<HouseConfig>) => void;
}

interface SelectedRoom {
  house: string;
  room: string;
}

export function RentalManagement({
  data,
  setData,
  houses,
  updateHouseConfig,
}: Props) {
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null);

  const getRoomList = (houseName: string) =>
    data[houseName]?.roomOrder ??
    (data[houseName]?.rooms
      ? Object.keys(data[houseName].rooms).sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
        )
      : []);

  const handleRenameHouse = (oldName: string) => {
    const newName = prompt("Nhập tên mới cho nhà trọ:", oldName);
    if (newName && newName.trim() && newName !== oldName) {
      const trimmed = newName.trim();
      setData((prev) => {
        const next = structuredClone(prev);
        next[trimmed] = next[oldName];
        delete next[oldName];
        return next;
      });
      if (selectedRoom?.house === oldName) {
        setSelectedRoom({ house: trimmed, room: selectedRoom.room });
      }
    }
  };

  const handleAddHouse = () => {
    const name = prompt("Nhập tên nhà trọ mới (ví dụ: Trọ Bình Thạnh):");
    if (name && name.trim()) {
      setData((prev) => ({
        ...prev,
        [name.trim()]: { rooms: {} },
      }));
    }
  };

  const handleDeleteHouse = (houseName: string) => {
    if (
      confirm(`Bạn có chắc muốn xóa "${houseName}" và toàn bộ dữ liệu không?`)
    ) {
      setData((prev) => {
        const next = structuredClone(prev);
        delete next[houseName];
        return next;
      });
      if (selectedRoom?.house === houseName) {
        setSelectedRoom(null);
      }
    }
  };

  const handleAddRoom = (houseName: string, value: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      if (next[houseName]) {
        next[houseName].roomOrder ??= Object.keys(next[houseName].rooms);

        value.split(",").forEach((room) => {
          const trimmed = room.trim();
          if (trimmed) {
            next[houseName].rooms[trimmed] ??= { months: {} };
            if (
              next[houseName].roomOrder &&
              !next[houseName].roomOrder.includes(trimmed)
            ) {
              next[houseName].roomOrder.push(trimmed);
            }
          }
        });
      }
      return next;
    });
  };

  const handleDeleteRoom = (houseName: string, room: string) => {
    if (
      confirm(
        `Bạn có chắc muốn xóa phòng "${room}" không? Toàn bộ số liệu các tháng sẽ bị xóa.`,
      )
    ) {
      setData((prev) => {
        const next = structuredClone(prev);
        if (next[houseName]) {
          delete next[houseName].rooms[room];

          if (next[houseName].roomOrder) {
            next[houseName].roomOrder = next[houseName].roomOrder.filter(
              (r: string) => r !== room,
            );
          }
        }
        return next;
      });
    }
  };

  const handleMoveRoom = (houseName: string, direction: "left" | "right") => {
    if (!selectedRoom || selectedRoom.house !== houseName) return;
    const roomList = getRoomList(houseName);
    const currentIndex = roomList.indexOf(selectedRoom.room);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= roomList.length) return;

    const newOrder = [...roomList];
    [newOrder[currentIndex], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[currentIndex],
    ];

    setData((prev) => {
      const next = structuredClone(prev);
      next[houseName].roomOrder = newOrder;
      return next;
    });
  };

  const handleConfigChange = (
    houseName: string,
    field: keyof HouseConfig,
    rawValue: string,
  ) => {
    const val = rawValue.trim() === "" ? undefined : Number(rawValue);
    updateHouseConfig(houseName, { [field]: val });
  };

  return (
    <>
      <Accordion className="w-full max-w-md lg:max-w-none">
        {houses.length !== 0 ? (
          houses.map((houseName) => {
            const roomList = getRoomList(houseName);
            const activeRoomInHouse =
              selectedRoom?.house === houseName ? selectedRoom.room : null;

            return (
              <Accordion.Item key={houseName}>
                <Accordion.Heading>
                  <Accordion.Trigger className="text-lg font-bold">
                    {houseName}
                    <Accordion.Indicator>
                      <ChevronDown />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onPress={() => handleRenameHouse(houseName)}
                      >
                        <Pencil /> Sửa tên
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onPress={() => handleDeleteHouse(houseName)}
                      >
                        <TrashBin />
                        Xóa nhà
                      </Button>
                    </div>

                    <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
                      <div>
                        <h3 className="font-semibold text-sm mb-2">
                          Bảng giá dịch vụ
                        </h3>
                        <div className="rounded-xl border divide-y divide-border/50">
                          <PriceInputItem
                            icon={
                              <Thunderbolt className="size-4 text-amber-600" />
                            }
                            label="Giá điện"
                            value={data[houseName]?.config?.electricityRate}
                            placeholder="3.500"
                            unit="đ/kWh"
                            onChange={(val: string) =>
                              handleConfigChange(
                                houseName,
                                "electricityRate",
                                val,
                              )
                            }
                          />

                          <PriceInputItem
                            icon={<Droplet className="size-4 text-cyan-600" />}
                            label="Giá nước"
                            value={data[houseName]?.config?.waterRate}
                            placeholder={
                              data[houseName]?.config?.waterBillingType ===
                              "person"
                                ? "100.000"
                                : "28.000"
                            }
                            unit={
                              <Button
                                variant="outline"
                                className="text-[11px] text-inherit w-fit whitespace-nowrap px-1 h-7"
                                onPress={() => {
                                  const current =
                                    data[houseName]?.config?.waterBillingType;
                                  updateHouseConfig(houseName, {
                                    waterBillingType:
                                      current === "person" ? "m3" : "person",
                                  });
                                }}
                              >
                                {data[houseName]?.config?.waterBillingType ===
                                "person"
                                  ? "đ/người"
                                  : "đ/m³"}
                              </Button>
                            }
                            onChange={(val: string) =>
                              handleConfigChange(houseName, "waterRate", val)
                            }
                          />

                          <PriceInputItem
                            icon={<TrashBin className="size-4" />}
                            label="Tiền rác"
                            value={data[houseName]?.config?.defaultTrashFee}
                            placeholder="30.000"
                            unit="đ"
                            onChange={(val: string) =>
                              handleConfigChange(
                                houseName,
                                "defaultTrashFee",
                                val,
                              )
                            }
                          />

                          <PriceInputItem
                            icon={<House className="size-4" />}
                            label="Tiền phòng"
                            value={data[houseName]?.config?.defaultRoomPrice}
                            placeholder="2.000.000"
                            unit="đ"
                            onChange={(val: string) =>
                              handleConfigChange(
                                houseName,
                                "defaultRoomPrice",
                                val,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm mb-2">
                          Danh sách phòng
                        </h3>
                        <form
                          className="flex gap-2 mb-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const input = form.elements.namedItem(
                              "roomInput",
                            ) as HTMLInputElement;
                            if (input && input.value.trim()) {
                              handleAddRoom(houseName, input.value);
                              input.value = "";
                            }
                          }}
                        >
                          <Input
                            name="roomInput"
                            aria-label="Tên phòng"
                            placeholder="P.101,P.102,P.201..."
                            className="w-full"
                          />
                          <Button type="submit" variant="tertiary" isIconOnly>
                            <Plus />
                          </Button>
                        </form>

                        <div className="flex flex-wrap gap-2">
                          {roomList.map((room) => {
                            const isSelected = activeRoomInHouse === room;
                            return (
                              <Chip
                                key={room}
                                className={`cursor-pointer select-none hover:bg-default-hover ${
                                  isSelected &&
                                  "ring-1 ring-accent bg-primary-soft text-accent"
                                }`}
                                onClick={() =>
                                  setSelectedRoom(
                                    isSelected
                                      ? null
                                      : { house: houseName, room },
                                  )
                                }
                              >
                                {room}
                              </Chip>
                            );
                          })}
                        </div>

                        {activeRoomInHouse && (
                          <div className="flex justify-center items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="tertiary"
                              isIconOnly
                              isDisabled={
                                roomList.indexOf(activeRoomInHouse) === 0
                              }
                              onPress={() => handleMoveRoom(houseName, "left")}
                            >
                              <ChevronLeft className="size-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="danger-soft"
                              isIconOnly
                              onPress={() => {
                                handleDeleteRoom(houseName, activeRoomInHouse);
                                setSelectedRoom(null);
                              }}
                            >
                              <TrashBin className="size-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="tertiary"
                              isIconOnly
                              isDisabled={
                                roomList.indexOf(activeRoomInHouse) ===
                                roomList.length - 1
                              }
                              onPress={() => handleMoveRoom(houseName, "right")}
                            >
                              <ChevronRight className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })
        ) : (
          <div className="text-center py-6 text-muted">
            <p className="text-sm font-medium">Chưa có nhà trọ nào</p>
            <p className="text-xs mt-1">
              Bấm nút bên dưới để thêm nhà trọ đầu tiên
            </p>
          </div>
        )}
      </Accordion>
      <Button
        variant="outline"
        className="w-full mt-4"
        onPress={handleAddHouse}
      >
        <Plus /> Thêm nhà trọ
      </Button>
    </>
  );
}
