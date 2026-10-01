import { Button } from "@heroui/react";
import { TrashBin, Camera } from "@gravity-ui/icons";

interface Props {
  image?: string;
  setImage: (val?: string) => void;
}

export const MeterPhoto = ({ image, setImage }: Props) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImage(localUrl);
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
