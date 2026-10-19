import { Gear } from "@gravity-ui/icons";
import { Button, Modal, Tabs } from "@heroui/react";
import { RentalManagement } from "./RentalManagement";
import { AccountManagement } from "./AccountManagement";
import type { RentalData, HouseConfig } from "../../type";
import { type User } from "firebase/auth";

interface Props {
  data: RentalData;
  setData: React.Dispatch<React.SetStateAction<RentalData>>;
  house: string;
  houses: string[];
  updateHouseConfig: (houseName: string, fields: Partial<HouseConfig>) => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export function SettingsModal({
  data,
  setData,
  house,
  houses,
  updateHouseConfig,
  user,
  setUser,
}: Props) {
  return (
    <Modal>
      <Button variant="outline" isIconOnly>
        <Gear />
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header className="flex-row items-center">
              <Modal.Icon className="bg-default text-foreground">
                <Gear className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Cài đặt hệ thống</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Tabs>
                <Tabs.ListContainer>
                  <Tabs.List>
                    <Tabs.Tab id="1">
                      Nhà & Phòng
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="2">
                      Tài Khoản
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel id="1" className="p-0">
                  <RentalManagement
                    data={data}
                    setData={setData}
                    house={house}
                    houses={houses}
                    updateHouseConfig={updateHouseConfig}
                  />
                </Tabs.Panel>
                <Tabs.Panel id="2">
                  <AccountManagement user={user} setUser={setUser} />
                </Tabs.Panel>
              </Tabs>
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
