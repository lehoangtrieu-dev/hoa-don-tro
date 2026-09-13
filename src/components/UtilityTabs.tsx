import { Tabs } from "@heroui/react";
import { Thunderbolt, Droplet } from "@gravity-ui/icons";

interface Props {
  onSelect: React.Dispatch<React.SetStateAction<"dien" | "nuoc">>;
}

export const UtilityTabs = ({ onSelect }: Props) => {
  return (
    <Tabs
      defaultSelectedKey="dien"
      onSelectionChange={(e) => onSelect(e as "dien" | "nuoc")}
    >
      <Tabs.ListContainer>
        <Tabs.List>
          <Tabs.Tab id="dien">
            <span className="flex items-center gap-1 text-amber-600">
              <Thunderbolt />
              Điện
              <Tabs.Indicator />
            </span>
          </Tabs.Tab>
          <Tabs.Tab id="nuoc">
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
