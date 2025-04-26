"use client";

import { useState } from "react";
import type { Shipment } from "@/types";
import { useRouter } from "next/navigation";
import type { ShipmentStatus } from "@/lib/db/shipments/query";
import type { UpdateShipmentStatusRequest } from "@/app/api/shipment/status/route";

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
      {isLoading ? <div className="mr-2 animate-spin">⏳</div> : null}
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

export default function ShipmentStatusActions({ shipment }: { shipment: Shipment }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { cancelled_at, payment_failed_at, shipped_at, delivered_at } = shipment;
  const showShipped = !cancelled_at && !payment_failed_at && !shipped_at;
  const showDelivered = shipped_at && !cancelled_at && !payment_failed_at && !delivered_at;
  const showPaymentFailed = !cancelled_at && !payment_failed_at && !shipped_at && !delivered_at;
  const showCancelled = !cancelled_at && !shipped_at && !delivered_at;

  const updateStatus = async (status: ShipmentStatus) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/shipment/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipmentId: shipment.id, status } as UpdateShipmentStatusRequest),
      });
      const data: { message: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
}
