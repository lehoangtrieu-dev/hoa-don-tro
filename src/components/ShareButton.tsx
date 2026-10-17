import { type RefObject } from "react";
import { domToBlob } from "modern-screenshot";
import { Button } from "@heroui/react";
import { ArrowShapeTurnUpRight } from "@gravity-ui/icons";

interface Props {
  room: string;
  month: string;
  exportRef: RefObject<HTMLDivElement | null>;
}

export const ShareButton = ({ room, month, exportRef }: Props) => {
  const handleShare = async (imageBlob: Blob) => {
    const fileName = `Hoa-don-${room}-${month}.png`;
    const file = new File([imageBlob], fileName, { type: imageBlob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Hóa đơn phòng ${room}`,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.warn("Share failed, falling back to download", err);
      }
    }

    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const element = exportRef.current;
    if (!element) return;

    try {
      const imageBlob = await domToBlob(element, {
        scale: 2,
        backgroundColor: "#fff",

        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      handleShare(imageBlob);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="secondary" onPress={handleExport}>
      <ArrowShapeTurnUpRight />
      Chia sẻ
    </Button>
  );
};
