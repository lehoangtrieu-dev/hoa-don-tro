import { ChevronDown, Pencil, TrashBin, Plus } from "@gravity-ui/icons";
import {
  Button,
  Accordion,
  Input,
  Chip,
  CloseButton,
  Separator,
} from "@heroui/react";
import { type RentalData } from "../../type";

interface Props {
  data: RentalData;
  setData: React.Dispatch<React.SetStateAction<RentalData>>;
  houses: string[];
}

export function RentalManagement({ data, setData, houses }: Props) {
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
        value.split(",").forEach((room) => {
          const trimmed = room.trim();
          if (trimmed) {
            next[house].rooms[trimmed] ??= { months: {} };
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
        }
        return next;
      });
    }
  };

  return (
    <>
      <Accordion className="w-full max-w-md">
        {houses.length !== 0 ? (
          houses.map((house) => (
            <Accordion.Item key={house}>
              <Accordion.Heading>
                <Accordion.Trigger>
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
                  <Separator className="my-4" />
                  <h1 className="font-medium">Danh sách phòng</h1>
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
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(data[house]?.rooms || {}).map((room) => (
                      <Chip key={room}>
                        {room}
                        <CloseButton
                          onPress={() => handleDeleteRoom(house, room)}
                        ></CloseButton>
                      </Chip>
                    ))}
                  </div>
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
