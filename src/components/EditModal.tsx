import { useState, useEffect } from "react";
import { PencilToSquare, TrashBin, House, Person } from "@gravity-ui/icons";
import { Button, Modal, TextField, Input, Label } from "@heroui/react";
import type { RoomConfig, HouseConfig } from "./../type";

interface Props {
  config?: RoomConfig;
  houseConfig?: HouseConfig;
  onSave: (fields: Partial<RoomConfig>) => void;
}

export function EditModal({ config, houseConfig, onSave }: Props) {
  const [price, setPrice] = useState(config?.roomPrice?.toString() ?? "");
  const [trash, setTrash] = useState(config?.trashFee?.toString() ?? "");
  const [people, setPeople] = useState(
    config?.peopleCount !== undefined ? config.peopleCount.toString() : "",
  );

  useEffect(() => {
    setPrice(config?.roomPrice?.toString() ?? "");
    setTrash(config?.trashFee?.toString() ?? "");
    setPeople(
      config?.peopleCount !== undefined ? config.peopleCount.toString() : "",
    );
  }, [config]);

  const isWaterByPerson = houseConfig?.waterBillingType === "person";

  const defaultPriceText = houseConfig?.defaultRoomPrice
    ? `${houseConfig.defaultRoomPrice.toLocaleString("vi-VN")}`
    : "2.000.000";

  const defaultTrashText = houseConfig?.defaultTrashFee
    ? `${houseConfig.defaultTrashFee.toLocaleString("vi-VN")}`
    : "30.000";

  const handleSave = () => {
    onSave({
      roomPrice: price.trim() === "" ? undefined : Number(price),
      trashFee: trash.trim() === "" ? undefined : Number(trash),
      peopleCount: people.trim() === "" ? undefined : Number(people),
    });
  };

  return (
    <Modal>
      <Button variant="secondary">
        <PencilToSquare />
        Chỉnh sửa
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header className="flex-row items-center">
              <Modal.Icon className="bg-default text-foreground">
                <PencilToSquare className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Chỉnh sửa phòng</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {isWaterByPerson && (
                <TextField
                  className="w-full mt-2"
                  type="number"
                  variant="secondary"
                >
                  <Label className="flex items-center gap-1.5">
                    <Person className="size-4" />
                    Số người ở (tính tiền nước)
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      className="w-full"
                      type="number"
                      min={1}
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      placeholder="1"
                    />
                    <span>người</span>
                  </div>
                </TextField>
              )}
              <TextField
                className="w-full mt-3"
                type="number"
                variant="secondary"
              >
                <Label className="flex items-center gap-1.5">
                  <TrashBin className="size-4" />
                  Tiền rác
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    className="w-full"
                    value={trash}
                    onChange={(e) => setTrash(e.target.value)}
                    placeholder={defaultTrashText}
                  />
                  <span>đ</span>
                </div>
              </TextField>
              <TextField
                className="w-full mt-3"
                type="number"
                variant="secondary"
              >
                <Label className="flex items-center gap-1.5">
                  <House className="size-4" />
                  Tiền phòng
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    className="w-full"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={defaultPriceText}
                  />
                  <span>đ</span>
                </div>
              </TextField>
            </Modal.Body>
            <Modal.Footer>
              <Button className="w-full" slot="close" onPress={handleSave}>
                Xong
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
