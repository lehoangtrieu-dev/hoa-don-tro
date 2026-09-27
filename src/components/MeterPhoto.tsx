import { useState } from "react";

import { Button } from "@heroui/react";
import { TrashBin, Camera } from "@gravity-ui/icons";

export const MeterPhoto = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsUploaded(true);
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
    }
  };

  return (
    <div className="relative">
      {isUploaded ? (
        <>
          <img className="rounded-3xl" src={imagePreview} alt="Ảnh công tơ" />
          <Button
            className="absolute top-0 right-0 m-2"
            variant="danger"
            onPress={() => setIsUploaded(false)}
            isIconOnly
          >
            <TrashBin />
          </Button>
        </>
      ) : (
        <div>
          <p className="text-center text-muted mb-4">hoặc</p>
          <Button>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
              className="absolute inset-0 opacity-0 size-full"
            />
            <Camera />
            Tải ảnh lên
          </Button>
        </div>
      )}
    </div>
  );
};
