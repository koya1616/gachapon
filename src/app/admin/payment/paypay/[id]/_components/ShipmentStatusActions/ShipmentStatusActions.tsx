"use client";

import { useState } from "react";
import type { Shipment } from "@/types";
import { useRouter } from "next/navigation";
import type { ShipmentStatus } from "@/lib/db/shipments/query";
import type { UpdateShipmentStatusRequest } from "@/app/api/shipment/status/route";
import Loading from "@/components/Loading";

type StatusConfig = {
  type: ShipmentStatus;
  label: string;
  bgColor: string;
  hoverColor: string;
  disabledColor: string;
};

type StatusButtonProps = {
  config: StatusConfig;
  isLoading: boolean;
  onUpdateStatus: (status: ShipmentStatus) => Promise<void>;
};

const StatusButton = ({ config, isLoading, onUpdateStatus }: StatusButtonProps) => {
  const { type, label, bgColor, hoverColor, disabledColor } = config;

  return (
    <button
      type="button"
      onClick={() => onUpdateStatus(type)}
      disabled={isLoading}
      className={`px-3 py-2 ${bgColor} text-white rounded-md ${hoverColor} ${disabledColor} flex items-center cursor-pointer ${isLoading ? "opacity-70" : ""}`}
    >
      {label}
    </button>
  );
};

const statusConfigs: Record<ShipmentStatus, StatusConfig> = {
  shipped: {
    type: "shipped",
    label: "発送済みにする",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    disabledColor: "disabled:bg-blue-300",
  },
  delivered: {
    type: "delivered",
    label: "配達済みにする",
    bgColor: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    disabledColor: "disabled:bg-green-300",
  },
  payment_failed: {
    type: "payment_failed",
    label: "決済失敗にする",
    bgColor: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    disabledColor: "disabled:bg-red-300",
  },
  cancelled: {
    type: "cancelled",
    label: "キャンセルする",
    bgColor: "bg-gray-600",
    hoverColor: "hover:bg-gray-700",
    disabledColor: "disabled:bg-gray-300",
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
        {showShipped && (
          <StatusButton config={statusConfigs.shipped} isLoading={isLoading} onUpdateStatus={updateStatus} />
        )}

        {showDelivered && (
          <StatusButton config={statusConfigs.delivered} isLoading={isLoading} onUpdateStatus={updateStatus} />
        )}

        {showPaymentFailed && (
          <StatusButton config={statusConfigs.payment_failed} isLoading={isLoading} onUpdateStatus={updateStatus} />
        )}

        {showCancelled && (
          <StatusButton config={statusConfigs.cancelled} isLoading={isLoading} onUpdateStatus={updateStatus} />
        )}
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
