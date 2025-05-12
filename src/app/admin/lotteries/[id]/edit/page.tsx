"use client";

import type { UpdateLotteryEventApiRequestBody } from "@/app/api/lottery/[id]/route";
import Badge from "@/components/Badge/Badge";
import { formatDateForInput } from "@/lib/date";
import { type LotteryEvent, type LotteryProduct, LotteryStatus } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import EditLotteryView from "./_components/PageView/EditLotteryView";

// TODO: productを編集する関数とproductを削除するAPIを作成
export interface EditLotteryLogic {
  formData: {
    id: number;
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    resultAt: string;
    paymentDeadlineAt: string;
    status: LotteryStatus;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getStatusBadge: (status: number) => React.ReactNode;
}

const useEditLottery = (): EditLotteryLogic => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    startAt: "",
    endAt: "",
    resultAt: "",
    paymentDeadlineAt: "",
    status: LotteryStatus.DRAFT,
  });

  const fetchLotteryDetail = useCallback(async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/lottery/${params.id}`);

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("抽選データの取得に失敗しました。");
      }

      const { data }: { data: { lottery: LotteryEvent; products: LotteryProduct[] } } = await response.json();

      setFormData({
        id: data.lottery.id,
        name: data.lottery.name,
        description: data.lottery.description || "",
        startAt: formatDateForInput(new Date(Number(data.lottery.start_at))),
        endAt: formatDateForInput(new Date(Number(data.lottery.end_at))),
        resultAt: formatDateForInput(new Date(Number(data.lottery.result_at))),
        paymentDeadlineAt: formatDateForInput(new Date(Number(data.lottery.payment_deadline_at))),
        status: data.lottery.status,
      });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchLotteryDetail();
  }, [fetchLotteryDetail]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "status" ? Number.parseInt(value) : value,
      }));
    },
    [],
  );

  const handleDateInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        if (!formData.name.trim()) {
          throw new Error("抽選名を入力してください");
        }

        const startDate = new Date(formData.startAt);
        const endDate = new Date(formData.endAt);
        const resultDate = new Date(formData.resultAt);
        const paymentDeadlineDate = new Date(formData.paymentDeadlineAt);

        if (startDate >= endDate) {
          throw new Error("開始日時は終了日時より前である必要があります");
        }

        if (endDate >= resultDate) {
          throw new Error("終了日時は結果発表日時より前である必要があります");
        }

        if (resultDate >= paymentDeadlineDate) {
          throw new Error("結果発表日時は支払期限より前である必要があります");
        }

        const body: UpdateLotteryEventApiRequestBody = {
          name: formData.name,
          description: formData.description,
          startAt: new Date(formData.startAt).getTime(),
          endAt: new Date(formData.endAt).getTime(),
          resultAt: new Date(formData.resultAt).getTime(),
          paymentDeadlineAt: new Date(formData.paymentDeadlineAt).getTime(),
          status: formData.status,
        };

        const response = await fetch(`/api/lottery/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error("抽選の更新に失敗しました");
        }

        setSuccess(true);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [formData, params.id, router],
  );

  const getStatusBadge = useCallback((status: number) => {
    switch (status) {
      case LotteryStatus.DRAFT:
        return <Badge text="下書き" color="gray" />;
      case LotteryStatus.ACTIVE:
        return <Badge text="実施中" color="green" />;
      case LotteryStatus.FINISHED:
        return <Badge text="終了" color="blue" />;
      case LotteryStatus.CANCELLED:
        return <Badge text="キャンセル" color="red" />;
      default:
        return <Badge text="不明" color="gray" />;
    }
  }, []);

  return {
    formData,
    loading,
    error,
    success,
    handleInputChange,
    handleDateInputChange,
    handleSubmit,
    getStatusBadge,
  };
};

const EditLotteryPage = () => {
  return <EditLotteryView {...useEditLottery()} />;
};

export default EditLotteryPage;
