import { useState } from "react";

import { Button } from "@heroui/react";
import { TrashBin, Camera } from "@gravity-ui/icons";

export const MeterPhoto = () => {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="relative">
      {isUploaded ? (
        <>
          <img
            className="rounded-3xl"
            src="https://placehold.co/3024x4032"
            alt="Ảnh công tơ"
          />
          <Button
            className="absolute top-0 right-0 m-2"
            variant="danger"
            onClick={() => setIsUploaded(false)}
            isIconOnly
          >
            <TrashBin />
          </Button>
        </>
      ) : (
        <div>
          <p className="text-center text-muted mb-2">hoặc</p>
          <Button onClick={() => setIsUploaded(true)}>
            <Camera />
            Tải ảnh lên
          </Button>
        </div>
      )}
    </div>
  );
};
