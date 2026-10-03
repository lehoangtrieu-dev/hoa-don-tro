import { Gear, ChevronDown, Pencil, TrashBin, Plus } from "@gravity-ui/icons";
import {
  Button,
  Modal,
  Accordion,
  Input,
  Chip,
  CloseButton,
  Separator,
} from "@heroui/react";
import { type RentalData } from "../type";

interface Props {
  data: RentalData;
  houses: string[];
}

const handleRenameHouse = (oldName: string) => {
  const newName = prompt("Nhập tên mới cho nhà trọ:", oldName);
  if (newName && newName.trim() && newName !== oldName) {
  }
};

const handleAddHouse = () => {
  const name = prompt("Nhập tên nhà trọ mới (ví dụ: Trọ Bình Thạnh):");
  if (name && name.trim()) {
  }
};

const handleDeleteHouse = (houseName: string) => {
  if (
    confirm(`Bạn có chắc muốn xóa "${houseName}" và toàn bộ dữ liệu không?`)
  ) {
  }
};

const handleDeleteRoom = (room: string) => {
  if (
    confirm(
      `Bạn có chắc muốn xóa phòng "${room}" không? Toàn bộ số liệu các tháng sẽ bị xóa.`,
    )
  ) {
  }
};

export function SettingsModal({ data, houses }: Props) {
  return (
    <Modal>
      <Button variant="outline" isIconOnly>
        <Gear />
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <Modal.Icon className="bg-default text-foreground">
                  <Gear className="size-5" />
                </Modal.Icon>
                <Modal.Heading>Quản lý Nhà trọ</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Accordion className="w-full max-w-md">
                {houses.map((house) => (
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
                        <div className="flex gap-2 mt-2 mb-4">
                          <Input
                            aria-label="Tên phòng"
                            placeholder="P.101,P.102,P.201..."
                          />
                          <Button variant="tertiary" isIconOnly>
                            <Plus />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(data[house]).map((room) => (
                            <Chip key={room}>
                              {room}
                              <CloseButton
                                onPress={() => handleDeleteRoom(room)}
                              ></CloseButton>
                            </Chip>
                          ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={handleAddHouse}
              >
                <Plus /> Thêm nhà trọ mới
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button className="w-full" slot="close">
                Xong
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
