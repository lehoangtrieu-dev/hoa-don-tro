import { Pagination, Select, ListBox } from "@heroui/react";

export const RoomSelector = () => {
  return (
    <Pagination className="w-fit">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous>
            <Pagination.PreviousIcon />
            <span>Phòng trước</span>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Select aria-label="Chọn Phòng" defaultValue="1">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-50 overflow-scroll">
                <ListBox.Item id="1" textValue="1">
                  P.101
                </ListBox.Item>
                <ListBox.Item id="2" textValue="2">
                  P.102
                </ListBox.Item>
                <ListBox.Item id="3" textValue="3">
                  P.103
                </ListBox.Item>
                <ListBox.Item id="4" textValue="4">
                  P.201
                </ListBox.Item>
                <ListBox.Item id="5" textValue="5">
                  P.202
                </ListBox.Item>
                <ListBox.Item id="6" textValue="6">
                  P.203
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next>
            <span>Phòng tiếp theo</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
};
