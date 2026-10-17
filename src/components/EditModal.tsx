import { PencilToSquare } from "@gravity-ui/icons";
import { Button, Modal, TextField, Label, Input } from "@heroui/react";

export function EditModal() {
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
                <Label>Tiền rác</Label>
                <Input placeholder="30,000" />
              </TextField>
              <TextField
                className="w-full mt-4"
                type="number"
                variant="secondary"
              >
                <Label>Tiền phòng</Label>
                <Input placeholder="2,000,000" />
              </TextField>
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
