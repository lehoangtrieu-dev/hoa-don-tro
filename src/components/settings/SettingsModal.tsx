import { useState } from "react";
import { Gear, House, Person } from "@gravity-ui/icons";
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
  const [activeTab, setActiveTab] = useState<"1" | "2">("1");

  return (
    <Modal>
      <Button variant="outline" isIconOnly aria-label="Cài đặt hệ thống">
        <Gear />
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md md:max-w-lg lg:max-w-4xl">
            <Modal.CloseTrigger />
            <Modal.Header className="flex-row items-center">
              <Modal.Icon className="bg-default text-foreground">
                <Gear className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Cài đặt hệ thống</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {/* Mobile horizontal tabs */}
              <div className="lg:hidden mb-4">
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={(key) =>
                    setActiveTab(String(key) as "1" | "2")
                  }
                >
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
                </Tabs>
              </div>

              {/* Desktop left vertical nav + right content pane */}
              <div className="lg:flex lg:gap-6 lg:min-h-104">
                <nav
                  aria-label="Danh mục cài đặt"
                  className="hidden lg:flex lg:flex-col gap-1 w-48 shrink-0 border-r border-border/60 pr-4"
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("1")}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                      activeTab === "1"
                        ? "bg-default font-semibold text-foreground"
                        : "text-muted hover:bg-default/50 hover:text-foreground"
                    }`}
                  >
                    <House className="size-4 shrink-0" />
                    <span>Nhà & Phòng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("2")}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                      activeTab === "2"
                        ? "bg-default font-semibold text-foreground"
                        : "text-muted hover:bg-default/50 hover:text-foreground"
                    }`}
                  >
                    <Person className="size-4 shrink-0" />
                    <span>Tài Khoản</span>
                  </button>
                </nav>

                <div className="flex-1 min-w-0 lg:max-h-[62vh] lg:overflow-y-auto lg:pr-1">
                  {activeTab === "1" ? (
                    <RentalManagement
                      data={data}
                      setData={setData}
                      houses={houses}
                      updateHouseConfig={updateHouseConfig}
                    />
                  ) : (
                    <div className="p-2 lg:p-0">
                      <AccountManagement
                        user={user}
                        setUser={setUser}
                        data={data}
                        house={house}
                        updateHouseConfig={updateHouseConfig}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="w-full lg:w-auto lg:min-w-28" slot="close">
                Xong
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
