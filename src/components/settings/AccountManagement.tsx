import { useState } from "react";
import { Button, Input, Avatar, Label, Description } from "@heroui/react";
import { ModelSelector } from "./ModelSelector";
import Google from "/src/assets/google.svg";

export const AccountManagement = () => {
  const [user, setUser] = useState(false);
  const [apiKey, SetApiKey] = useState("");

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
          <Label htmlFor="apiKey">Gemini API Key:</Label>
          <Input
            id="apiKey"
            type="password"
            className="w-full mt-2"
            placeholder="Nhập API Key..."
            value={apiKey}
            onChange={(e) => {
              SetApiKey(e.target.value);
            }}
          />
        </div>
        <ModelSelector apiKey={apiKey} />
      </div>
    </>
  );
};
