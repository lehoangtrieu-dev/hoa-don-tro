import { Gear } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import { RentalManagement } from "./RentalManagement";
import { type RentalData } from "../../type";

interface Props {
  data: RentalData;
  setData: React.Dispatch<React.SetStateAction<RentalData>>;
  houses: string[];
}

export function SettingsModal({ data, setData, houses }: Props) {
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
                <Modal.Heading>Cài đặt</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body>
              <RentalManagement data={data} setData={setData} houses={houses} />
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
