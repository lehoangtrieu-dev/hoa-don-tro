import { Pagination, Select, ListBox } from "@heroui/react";
import type { RentalData } from "../type";

interface Props {
  rooms: string[];
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  data: RentalData;
  house: string;
  month: string;
}

type PaymentStatus = "paid" | "unfilled" | "unpaid";

export const RoomSelector = ({
  rooms,
  room,
  setRoom,
  data,
  house,
  month,
}: Props) => {
  const getRoomStatus = (roomName: string): PaymentStatus => {
    const houseData = data[house];
    const roomData = houseData?.rooms?.[roomName];
    const monthRecord = roomData?.months?.[month];

    if (monthRecord?.paid) {
      return "paid";
    }

    const isWaterByPerson = houseData?.config?.waterBillingType === "person";
    const hasElectricity = monthRecord?.electricity?.value !== undefined;
    const hasWater = isWaterByPerson || monthRecord?.water?.value !== undefined;

    // Both electricity AND water must be filled for it to turn unpaid (red)
    if (hasElectricity && hasWater) {
      return "unpaid";
    }

    return "unfilled";
  };

  const getContainerBgClass = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-success-soft";
      case "unpaid":
        return "bg-danger-soft";
      case "unfilled":
      default:
        return "";
    }
  };

  const getStatusTextClass = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "text-success-soft-foreground font-medium";
      case "unpaid":
        return "text-danger-soft-foreground font-medium";
      case "unfilled":
      default:
        return "text-foreground";
    }
  };

  const currentRoomStatus = room ? getRoomStatus(room) : "unfilled";

  return (
    <Pagination className="w-fit">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={room === rooms[0]}
            onPress={() => setRoom((room) => rooms[rooms.indexOf(room) - 1])}
          >
            <Pagination.PreviousIcon />
            <span>Phòng trước</span>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Select
            aria-label="Chọn Phòng"
            placeholder="—"
            value={room}
            onChange={(key) => {
              if (key) setRoom(String(key));
            }}
          >
            <Select.Trigger
              className={`${getContainerBgClass(currentRoomStatus)} ${getStatusTextClass(currentRoomStatus)}`}
            >
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-96 overflow-y-auto">
                {rooms.map((value) => {
                  const status = getRoomStatus(value);
                  const bgClass = getContainerBgClass(status);
                  const textClass = getStatusTextClass(status);

                  return (
                    <ListBox.Item
                      id={value}
                      key={value}
                      textValue={value}
                      className={bgClass}
                    >
                      <span className={textClass}>{value}</span>
                    </ListBox.Item>
                  );
                })}
              </ListBox>
            </Select.Popover>
          </Select>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next
            isDisabled={room === rooms.at(-1)}
            onPress={() => setRoom((room) => rooms[rooms.indexOf(room) + 1])}
          >
            <span>Phòng tiếp theo</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
};
