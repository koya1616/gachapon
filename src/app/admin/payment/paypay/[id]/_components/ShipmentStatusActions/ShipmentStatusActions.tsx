"use client";

import type { UpdateShipmentStatusRequest } from "@/app/api/shipment/status/route";
import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import type { ShipmentStatus } from "@/lib/db/shipments/query";
import type { Shipment } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StatusConfig = {
  type: ShipmentStatus;
  label: string;
  color: "blue" | "gray" | "red" | "green";
};

type StatusButtonProps = {
  config: StatusConfig;
  onUpdateStatus: (status: ShipmentStatus) => Promise<void>;
};

const StatusButton = ({ config, onUpdateStatus }: StatusButtonProps) => {
  const { type, label, color } = config;

  return <Button label={label} color={color} onClick={() => onUpdateStatus(type)} />;
};

const statusConfigs: Record<ShipmentStatus, StatusConfig> = {
  shipped: {
    type: "shipped",
    label: "発送済みにする",
    color: "blue",
  },
  delivered: {
    type: "delivered",
    label: "配達済みにする",
    color: "green",
  },
  payment_failed: {
    type: "payment_failed",
    label: "決済失敗にする",
    color: "red",
  },
  cancelled: {
    type: "cancelled",
    label: "キャンセルする",
    color: "gray",
  },
};

interface ShipmentStatusActionsLogic {
  isLoading: boolean;
  showShipped: boolean;
  showDelivered: boolean;
  showPaymentFailed: boolean;
  showCancelled: boolean;
  statusConfigs: Record<ShipmentStatus, StatusConfig>;
  updateStatus: (status: ShipmentStatus) => Promise<void>;
}

export const ShipmentStatusActionsView = ({
  isLoading,
  showShipped,
  showDelivered,
  showPaymentFailed,
  showCancelled,
  statusConfigs,
  updateStatus,
}: ShipmentStatusActionsLogic) => {
  if (isLoading) return <Loading />;
  const showButtons = showShipped || showDelivered || showPaymentFailed || showCancelled;
  if (!showButtons) return null;
  return (
    <div className="mt-4 bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-3">ステータスを更新</h3>

      <div className="flex flex-wrap gap-4">
        {showShipped && <StatusButton config={statusConfigs.shipped} onUpdateStatus={updateStatus} />}

        {showDelivered && <StatusButton config={statusConfigs.delivered} onUpdateStatus={updateStatus} />}

        {showPaymentFailed && <StatusButton config={statusConfigs.payment_failed} onUpdateStatus={updateStatus} />}

        {showCancelled && <StatusButton config={statusConfigs.cancelled} onUpdateStatus={updateStatus} />}
      </div>
    </div>
  );
};

const useShipmentStatusActions = (shipment: Shipment): ShipmentStatusActionsLogic => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { cancelled_at, payment_failed_at, shipped_at, delivered_at } = shipment;

  const hasCancelled = !!cancelled_at;
  const hasPaymentFailed = !!payment_failed_at;
  const hasShipped = !!shipped_at;
  const hasDelivered = !!delivered_at;

  const showShipped = !hasCancelled && !hasPaymentFailed && !hasShipped;
  const showDelivered = hasShipped && !hasCancelled && !hasPaymentFailed && !hasDelivered;
  const showPaymentFailed = !hasCancelled && !hasPaymentFailed && !hasShipped && !hasDelivered;
  const showCancelled = !hasCancelled && !hasShipped && !hasDelivered;

  const updateStatus = async (status: ShipmentStatus) => {
    setIsLoading(true);
    const body: UpdateShipmentStatusRequest = { shipmentId: shipment.id, status };
    await fetch("/api/shipment/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          alert("更新に失敗しました。再度お試しください。");
        }
        router.refresh();
      })
      .catch(() => {
        alert("更新に失敗しました。再度お試しください。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    showShipped,
    showDelivered,
    showPaymentFailed,
    showCancelled,
    statusConfigs,
    updateStatus,
  };
};

const ShipmentStatusActions = ({ shipment }: { shipment: Shipment }) => {
  return <ShipmentStatusActionsView {...useShipmentStatusActions(shipment)} />;
};

export default ShipmentStatusActions;
