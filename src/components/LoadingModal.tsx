import { Button, Modal, Spinner } from "@heroui/react";
import { CircleExclamation } from "@gravity-ui/icons";

interface Props {
  isOpen: boolean;
  error: string | null;
  onCancel: () => void;
}

export const LoadingModal = ({ isOpen, error, onCancel }: Props) => {
  return (
    <Modal isOpen={isOpen}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-xs">
            <Modal.Body className="overflow-hidden p-3">
              {error ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-danger">
                    <CircleExclamation className="size-4 shrink-0 mt-0.5" />
                    <span className="text-xs wrap-break-word">{error}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="danger-soft"
                    className="w-full mt-1"
                    onPress={onCancel}
                  >
                    Đóng
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-2">
                  <div className="flex gap-2.5 items-center">
                    <Spinner size="sm" />
                    <span className="text-sm font-medium">
                      Đang nhận diện...
                    </span>
                  </div>
                  <Button size="sm" variant="danger-soft" onPress={onCancel}>
                    Hủy
                  </Button>
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
