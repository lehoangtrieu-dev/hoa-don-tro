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
  house: string;
  houses: string[];
  updateHouseConfig: (houseName: string, fields: Partial<HouseConfig>) => void;
}

export function RentalManagement({
  data,
  setData,
  house,
  houses,
  updateHouseConfig,
}: Props) {
  const handleRenameHouse = (oldName: string) => {
    const newName = prompt("Nhập tên mới cho nhà trọ:", oldName);
    if (newName && newName.trim() && newName !== oldName) {
      setData((prev) => {
        const next = structuredClone(prev);
        next[newName.trim()] = next[oldName];
        delete next[oldName];
        return next;
      });
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
    }
  };

  const handleAddRoom = (house: string, value: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      if (next[house]) {
        next[house].roomOrder ??= Object.keys(next[house].rooms);

        value.split(",").forEach((room) => {
          const trimmed = room.trim();
          if (trimmed) {
            next[house].rooms[trimmed] ??= { months: {} };
            if (
              next[house].roomOrder &&
              !next[house].roomOrder.includes(trimmed)
            ) {
              next[house].roomOrder.push(trimmed);
            }
          }
        });
      }
      return next;
    });
  };

  const handleDeleteRoom = (house: string, room: string) => {
    if (
      confirm(
        `Bạn có chắc muốn xóa phòng "${room}" không? Toàn bộ số liệu các tháng sẽ bị xóa.`,
      )
    ) {
      setData((prev) => {
        const next = structuredClone(prev);
        if (next[house]) {
          delete next[house].rooms[room];

          if (next[house].roomOrder) {
            next[house].roomOrder = next[house].roomOrder.filter(
              (r: string) => r !== room,
            );
          }
        }
        return next;
      });
    }
  };

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const roomList =
    data[house]?.roomOrder ?? Object.keys(data[house]?.rooms || {});

  const handleMoveRoom = (direction: "left" | "right") => {
    if (!selectedRoom) return;
    const currentIndex = roomList.indexOf(selectedRoom);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= roomList.length) return;

    // Hoán đổi vị trí trong mảng
    const newOrder = [...roomList];
    [newOrder[currentIndex], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[currentIndex],
    ];

    setData((prev) => {
      const next = structuredClone(prev);
      next[house].roomOrder = newOrder;
      return next;
    });
  };

  const handleConfigChange = (
    house: string,
    field: keyof HouseConfig,
    rawValue: string,
  ) => {
    const val = rawValue.trim() === "" ? undefined : Number(rawValue);
    updateHouseConfig(house, { [field]: val });
  };

  return (
    <>
      <Accordion className="w-full max-w-md">
        {houses.length !== 0 ? (
          houses.map((house) => (
            <Accordion.Item key={house}>
              <Accordion.Heading>
                <Accordion.Trigger className="text-lg font-bold">
                  {house}
                  <Accordion.Indicator>
                    <ChevronDown />
                  </Accordion.Indicator>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="me-2"
                    onPress={() => handleRenameHouse(house)}
                  >
                    <Pencil /> Sửa tên
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onPress={() => handleDeleteHouse(house)}
                  >
                    <TrashBin />
                    Xóa nhà
                  </Button>
                  <h1 className="font-semibold text-sm mb-2 mt-8">
                    Bảng giá dịch vụ
                  </h1>
                  <div className="rounded-xl border divide-y divide-border/50">
                    <PriceInputItem
                      icon={<Thunderbolt className="size-4 text-amber-600" />}
                      label="Giá điện"
                      value={data[house]?.config?.electricityRate}
                      placeholder="3.500"
                      unit="đ/kWh"
                      onChange={(val: string) =>
                        handleConfigChange(house, "electricityRate", val)
                      }
                    />

                    <PriceInputItem
                      icon={<Droplet className="size-4 text-cyan-600" />}
                      label="Giá nước"
                      value={data[house]?.config?.waterRate}
                      placeholder="28.000"
                      unit="đ/m³"
                      onChange={(val: string) =>
                        handleConfigChange(house, "waterRate", val)
                      }
                    />

                    <PriceInputItem
                      icon={<TrashBin className="size-4" />}
                      label="Tiền rác"
                      value={data[house]?.config?.defaultTrashFee}
                      placeholder="30.000"
                      unit="đ"
                      onChange={(val: string) =>
                        handleConfigChange(house, "defaultTrashFee", val)
                      }
                    />

                    <PriceInputItem
                      icon={<House className="size-4" />}
                      label="Tiền phòng"
                      value={data[house]?.config?.defaultRoomPrice}
                      placeholder="2.000.000"
                      unit="đ"
                      onChange={(val: string) =>
                        handleConfigChange(house, "defaultRoomPrice", val)
                      }
                    />
                  </div>
                  <h1 className="font-medium mt-8">Danh sách phòng</h1>
                  <form
                    className="flex gap-2 mt-2 mb-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem(
                        "roomInput",
                      ) as HTMLInputElement;
                      if (input && input.value.trim()) {
                        handleAddRoom(house, input.value);
                        input.value = "";
                      }
                    }}
                  >
                    <Input
                      name="roomInput"
                      aria-label="Tên phòng"
                      placeholder="P.101,P.102,P.201..."
                    />
                    <Button type="submit" variant="tertiary" isIconOnly>
                      <Plus />
                    </Button>
                  </form>
                  {/* Danh sách Chip phòng */}
                  <div className="flex flex-wrap gap-2">
                    {roomList.map((room) => {
                      const isSelected = room === selectedRoom;
                      return (
                        <Chip
                          key={room}
                          className={`cursor-pointer select-none hover:bg-default-hover ${
                            isSelected &&
                            "ring-1 ring-accent bg-primary-soft text-accent"
                          }`}
                          onClick={() =>
                            setSelectedRoom(isSelected ? null : room)
                          }
                        >
                          {room}
                        </Chip>
                      );
                    })}
                  </div>

                  {selectedRoom && (
                    <div className="flex justify-center items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="tertiary"
                        isIconOnly
                        isDisabled={roomList.indexOf(selectedRoom) === 0}
                        onPress={() => handleMoveRoom("left")}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="danger-soft"
                        isIconOnly
                        onPress={() => {
                          handleDeleteRoom(house, selectedRoom);
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
                          roomList.indexOf(selectedRoom) === roomList.length - 1
                        }
                        onPress={() => handleMoveRoom("right")}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))
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
        className="w-full mt-2"
        onClick={handleAddHouse}
      >
        <Plus /> Thêm nhà trọ mới
      </Button>
    </>
  );
}
