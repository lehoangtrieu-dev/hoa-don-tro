import { useState, useEffect } from "react";
import { Button, Input, Avatar, Label, Description } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { ModelSelector } from "./ModelSelector";
import Google from "/src/assets/google.svg";

export const AccountManagement = () => {
  const [user, setUser] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    return savedApiKey ? savedApiKey : "";
  });

  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

  return (
    <>
      {user ? (
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image
                alt="Bob"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              />
              <Avatar.Fallback>B</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <Label>Bob</Label>
              <Description>bob@heroui.com</Description>
            </div>
          </div>
          <div>
            <Button
              variant="danger-soft"
              onPress={() => {
                setUser(false);
              }}
            >
              Đăng Xuất
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onPress={() => {
            setUser(true);
          }}
        >
          <img src={Google} alt="" />
          Đăng nhập bằng Google
        </Button>
      )}
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <Label>Gemini API Key:</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type={showApiKey ? "text" : "password"}
              className="w-full"
              placeholder="Nhập API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button
              isIconOnly
              variant="tertiary"
              className="aspect-square"
              onPress={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeSlash /> : <Eye />}
            </Button>
          </div>
        </div>
        <ModelSelector apiKey={apiKey} />
      </div>
    </>
  );
};
