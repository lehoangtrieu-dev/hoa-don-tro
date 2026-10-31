import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Avatar,
  Label,
  Description,
  Select,
  ListBox,
} from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { ModelSelector } from "./ModelSelector";
import Google from "/src/assets/google.svg";
import { auth, googleProvider } from "./../../services/firebase";
import { type User, signInWithPopup, signOut } from "firebase/auth";

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AUTO_DELETE_OPTIONS = [
  { value: "never", label: "Không tự động xóa" },
  { value: "1", label: "Cũ hơn 1 tháng" },
  { value: "2", label: "Cũ hơn 2 tháng" },
  { value: "3", label: "Cũ hơn 3 tháng" },
  { value: "6", label: "Cũ hơn 6 tháng" },
  { value: "12", label: "Cũ hơn 12 tháng" },
];

export const AccountManagement = ({ user, setUser }: Props) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    return savedApiKey ? savedApiKey : "";
  });

  const [autoDeleteMonths, setAutoDeleteMonths] = useState(() => {
    return localStorage.getItem("autoDeleteMonths") || "never";
  });

  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("autoDeleteMonths", autoDeleteMonths);
  }, [autoDeleteMonths]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Google sign-out failed:", err);
    }
  };

  return (
    <>
      {user ? (
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image
                alt={user?.displayName || "Người dùng"}
                src={user?.photoURL || ""}
              />
              <Avatar.Fallback>{user?.displayName?.[0] || "U"}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <Label>{user?.displayName || "Người dùng"}</Label>
              <Description>{user?.email || ""}</Description>
            </div>
          </div>
          <div>
            <Button variant="danger-soft" onPress={handleSignOut}>
              Đăng Xuất
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onPress={handleGoogleSignIn}
        >
          <img src={Google} alt="" />
          Đăng nhập bằng Google
        </Button>
      )}
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <Select
            value={autoDeleteMonths}
            onChange={(key) => {
              if (key) setAutoDeleteMonths(String(key));
            }}
          >
            <Label>Tự động xóa hóa đơn cũ:</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {AUTO_DELETE_OPTIONS.map((opt) => (
                  <ListBox.Item
                    id={opt.value}
                    key={opt.value}
                    textValue={opt.label}
                  >
                    {opt.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

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
