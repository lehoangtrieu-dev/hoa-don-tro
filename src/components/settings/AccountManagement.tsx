import { useState, useEffect } from "react";
import { Button, Input, Avatar, Label, Description } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { ModelSelector } from "./ModelSelector";
import Google from "/src/assets/google.svg";
import { auth, googleProvider } from "./../../services/firebase";
import { type User, signInWithPopup, signOut } from "firebase/auth";

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AccountManagement = ({ user, setUser }: Props) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    return savedApiKey ? savedApiKey : "";
  });

  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

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
