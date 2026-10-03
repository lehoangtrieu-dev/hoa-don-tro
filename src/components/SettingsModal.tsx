import { Gear, ChevronDown, Pencil, TrashBin, Plus } from "@gravity-ui/icons";
import {
  Button,
  Modal,
  Accordion,
  Input,
  Chip,
  Separator,
} from "@heroui/react";
import { type RentalData } from "../type";

interface Props {
  data: RentalData;
  houses: string[];
}

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
                        <Button variant="secondary" className="me-2">
                          <Pencil /> Sửa tên
                        </Button>
                        <Button variant="danger">
                          <TrashBin />
                          Xóa nhà
                        </Button>
                        <Separator className="my-4" />
                        <h1 className="font-medium">Danh sách phòng</h1>
                        <div className="flex gap-2 mt-2 mb-4">
                          <Input
                            aria-label="Name"
                            placeholder="P.101,P.102,P.201..."
                          />
                          <Button variant="tertiary" isIconOnly>
                            <Plus />
                          </Button>
                        </div>
                        {Object.keys(data[house]).map((room) => (
                          <Chip
                            key={room}
                            className="me-2 hover:text-danger-soft-foreground hover:bg-danger-soft hover:line-through cursor-pointer"
                          >
                            {room}
                          </Chip>
                        ))}
                      </Accordion.Body>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
              <Button variant="outline" className="w-full mt-2">
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
