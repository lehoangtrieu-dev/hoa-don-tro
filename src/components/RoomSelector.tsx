import { Pagination, Select, ListBox } from "@heroui/react";

interface Props {
  rooms: string[];
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}

export const RoomSelector = ({ rooms, room, setRoom }: Props) => {
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
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-96 overflow-y-auto">
                {rooms.map((value) => (
                  <ListBox.Item id={value} key={value} textValue={value}>
                    {value}
                  </ListBox.Item>
                ))}
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
