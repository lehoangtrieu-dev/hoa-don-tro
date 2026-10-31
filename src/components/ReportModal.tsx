import { useMemo } from "react";
import { Modal, Button, Table } from "@heroui/react";
import { ArrowDownToLine, LayoutHeaderCellsLarge } from "@gravity-ui/icons";
import {
  generateHouseBillingReport,
  downloadBillingReportCSV,
} from "../services/exportCsv";
import type { RentalData } from "../type";

const formatNumber = (val?: number) =>
  val !== undefined ? val.toLocaleString("vi-VN") : "-";

const formatVND = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  house: string;
  month: string;
  data: RentalData;
}

export const ReportModal = ({ isOpen, onClose, house, month, data }: Props) => {
  const report = useMemo(() => {
    if (!isOpen) return null;
    return generateHouseBillingReport(house, month, data);
  }, [isOpen, house, month, data]);

  if (!isOpen || !report) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-full">
            <Modal.CloseTrigger />
            <Modal.Header className="flex-row items-center">
              <Modal.Icon className="bg-default text-foreground">
                <LayoutHeaderCellsLarge className="size-5" />
              </Modal.Icon>
              <div>
                <Modal.Heading>Báo cáo tổng hợp</Modal.Heading>
                <p className="text-xs text-muted">
                  {house} • Tháng {month}
                </p>
              </div>
            </Modal.Header>
            <Modal.Body className="mt-4 p-0">
              <Table className="whitespace-nowrap [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap text-xs">
                <Table.ScrollContainer className="max-h-[60vh]">
                  <Table.Content aria-label={`Báo cáo ${house} ${month}`}>
                    <Table.Header>
                      <Table.Column isRowHeader>Tên phòng</Table.Column>
                      <Table.Column>Tiền phòng</Table.Column>
                      <Table.Column>Điện Mới</Table.Column>
                      <Table.Column>Điện Cũ</Table.Column>
                      <Table.Column>Điện sd</Table.Column>
                      <Table.Column>Tiền điện</Table.Column>
                      <Table.Column>Nước Mới</Table.Column>
                      <Table.Column>Nước Cũ</Table.Column>
                      <Table.Column>
                        {report.isWaterByPerson ? "Số người" : "Nước sd"}
                      </Table.Column>
                      <Table.Column>Tiền nước</Table.Column>
                      <Table.Column>Tiền rác</Table.Column>
                      <Table.Column>Tổng Tiền</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {report.rows.map((row) => (
                        <Table.Row key={row.room}>
                          <Table.Cell className="font-medium">
                            {row.room}
                          </Table.Cell>
                          <Table.Cell>{formatVND(row.roomPrice)}</Table.Cell>
                          <Table.Cell>{formatNumber(row.elecNew)}</Table.Cell>
                          <Table.Cell>{formatNumber(row.elecOld)}</Table.Cell>
                          <Table.Cell>{formatNumber(row.elecUsage)}</Table.Cell>
                          <Table.Cell>{formatVND(row.elecCost)}</Table.Cell>
                          <Table.Cell>
                            {report.isWaterByPerson
                              ? "-"
                              : formatNumber(row.waterNew)}
                          </Table.Cell>
                          <Table.Cell>
                            {report.isWaterByPerson
                              ? "-"
                              : formatNumber(row.waterOld)}
                          </Table.Cell>
                          <Table.Cell>
                            {report.isWaterByPerson
                              ? `${formatNumber(row.peopleCount)} người`
                              : formatNumber(row.waterUsage)}
                          </Table.Cell>
                          <Table.Cell>{formatVND(row.waterCost)}</Table.Cell>
                          <Table.Cell>{formatVND(row.trashCost)}</Table.Cell>
                          <Table.Cell className="font-semibold text-primary">
                            {formatVND(row.total)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                      <Table.Row className="font-bold border-t">
                        <Table.Cell>TỔNG CỘNG</Table.Cell>
                        <Table.Cell>
                          {formatVND(report.totalRoomPrice)}
                        </Table.Cell>
                        <Table.Cell>-</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                        <Table.Cell>
                          {formatNumber(report.totalElecUsage)}
                        </Table.Cell>
                        <Table.Cell>
                          {formatVND(report.totalElecCost)}
                        </Table.Cell>
                        <Table.Cell>-</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                        <Table.Cell>
                          {report.isWaterByPerson
                            ? "-"
                            : formatNumber(report.totalWaterUsage)}
                        </Table.Cell>
                        <Table.Cell>
                          {formatVND(report.totalWaterCost)}
                        </Table.Cell>
                        <Table.Cell>
                          {formatVND(report.totalTrashCost)}
                        </Table.Cell>
                        <Table.Cell className="text-primary font-bold">
                          {formatVND(report.totalRevenue)}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Modal.Body>
            <Modal.Footer className="flex justify-between items-center">
              <Button
                variant="outline"
                onPress={() => downloadBillingReportCSV(report)}
              >
                <ArrowDownToLine /> Xuất Excel / CSV
              </Button>
              <Button onPress={onClose}>Xong</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
