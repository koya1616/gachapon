"use client";

import { useState } from "react";
import type { Shipment } from "@/types";
import { useRouter } from "next/navigation";

type StatusConfig = {
  type: "shipped" | "delivered" | "payment_failed" | "cancelled";
  label: string;
  bgColor: string;
  hoverColor: string;
  disabledColor: string;
};

const StatusButton = ({
  config,
  isLoading,
  onUpdateStatus,
}: {
  config: StatusConfig;
  isLoading: string | null;
  onUpdateStatus: (status: "shipped" | "delivered" | "payment_failed" | "cancelled") => Promise<void>;
}) => {
  const { type, label, bgColor, hoverColor, disabledColor } = config;
  const isCurrentlyLoading = isLoading === type;

  return (
    <button
      type="button"
      onClick={() => onUpdateStatus(type)}
      disabled={!!isLoading}
      className={`px-3 py-2 ${bgColor} text-white rounded-md ${hoverColor} ${disabledColor} flex items-center cursor-pointer ${
        isCurrentlyLoading ? "opacity-70" : ""
      }`}
    >
      {isCurrentlyLoading ? <div>Loading...</div> : label}
    </button>
  );
};

const statusConfigs: Record<string, StatusConfig> = {
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
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const { cancelled_at, payment_failed_at, shipped_at, delivered_at } = shipment;
  const showShipped = !cancelled_at && !payment_failed_at && !shipped_at;
  const showDelivered = shipped_at && !cancelled_at && !payment_failed_at && !delivered_at;
  const showPaymentFailed = !cancelled_at && !payment_failed_at && !shipped_at && !delivered_at;
  const showCancelled = !cancelled_at && !shipped_at && !delivered_at;

  const updateStatus = async (status: "shipped" | "delivered" | "payment_failed" | "cancelled") => {
    setIsLoading(status);

    await fetch("/api/shipment/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipmentId: shipment.id, status }),
    })
      .then(() => {
        router.refresh();
      })
      .finally(() => {
        setIsLoading(null);
      });
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
