import { Button } from "@heroui/react";
import { TrashBin, Camera } from "@gravity-ui/icons";

interface Props {
  image?: string;
  setImage: (val?: string) => void;
}

export const MeterPhoto = ({ image, setImage }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImage(base64);
    };
    reader.readAsDataURL(file);

    const uploadToCloudinary = async () => {
      const CLOUD_NAME = "sglsq38j";
      const UPLOAD_PRESET = "hoadontro_preset";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
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
        console.error("Cloudinary upload failed:", err);
      }
    };

    uploadToCloudinary();
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
