import { Button } from "@heroui/react";
import { TrashBin, Camera } from "@gravity-ui/icons";

interface Props {
  image?: string;
  setImage: (val?: string) => void;
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const MeterPhoto = ({ image, setImage }: Props) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await compressImage(file);
      setImage(base64);

      const CLOUD_NAME = "sglsq38j";
      const UPLOAD_PRESET = "hoadontro_preset";

      const formData = new FormData();
      formData.append("file", base64);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      if (data.secure_url) {
        setImage(data.secure_url);
      }
    } catch (err) {
      console.error("Failed to process or upload image:", err);
    }
  };

  return (
    <div className="relative">
      {image ? (
        <>
          <img className="rounded-3xl" src={image} alt="Ảnh công tơ" />
          <Button
            className="absolute top-0 right-0 m-2"
            variant="danger"
            onPress={() => setImage("")}
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
