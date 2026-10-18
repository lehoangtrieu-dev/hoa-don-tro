import { useState } from "react";
import { PencilToSquare, TrashBin, House } from "@gravity-ui/icons";
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
              <Modal.Heading>Chỉnh sửa giá phòng</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <TextField
                className="w-full mt-2"
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
                className="w-full mt-4"
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
