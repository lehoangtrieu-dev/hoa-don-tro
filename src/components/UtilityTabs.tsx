import { Tabs } from "@heroui/react";
import { Thunderbolt, Droplet } from "@gravity-ui/icons";
import { type UtilityType } from "../type";

interface Props {
  onSelect: React.Dispatch<React.SetStateAction<UtilityType>>;
}

export const UtilityTabs = ({ onSelect }: Props) => {
  return (
    <Tabs
      defaultSelectedKey="electricity"
      onSelectionChange={(e) => onSelect(e as UtilityType)}
    >
      <Tabs.ListContainer>
        <Tabs.List>
          <Tabs.Tab id="electricity">
            <span className="flex items-center gap-1 text-amber-600">
              <Thunderbolt />
              Điện
              <Tabs.Indicator />
            </span>
          </Tabs.Tab>
          <Tabs.Tab id="water">
            <span className="flex items-center gap-1 text-cyan-600">
              <Droplet />
              Nước
              <Tabs.Indicator />
            </span>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
