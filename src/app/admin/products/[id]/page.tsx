"use client";

import type { ProductResponse } from "@/app/api/product/[id]/route";
import type { Auction, LotteryEvent, Product } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailView from "./_components/PageView";

export interface ProductDetailLogic {
  product: Product | null;
  lotteryEvents: LotteryEvent[];
  auctions: Auction[];
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  editForm: {
    name: string;
    price: string;
    stock_quantity: string;
  };
  updateStatus: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

const useProductDetail = (): ProductDetailLogic => {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [lotteryEvents, setLotteryEvents] = useState<LotteryEvent[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    stock_quantity: "",
  });
  const [updateStatus, setUpdateStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchProductDetail = async () => {
      await fetch(`/api/product/${params.id}`)
        .then(async (res) => {
          const { data }: { data: ProductResponse } = await res.json();
          setProduct(data.product);
          setEditForm({
            name: data.product.name,
            price: String(data.product.price),
            stock_quantity: String(data.product.stock_quantity),
          });
          setLotteryEvents(data.lotteryEvents);
          setAuctions(data.auctions);
        })
        .catch(() => {
          setError("商品詳細の取得に失敗しました。");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (params.id) {
      fetchProductDetail();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, error: null, success: false });

    const body: Partial<Product> = {
      name: editForm.name,
      price: Number(editForm.price),
      stock_quantity: Number(editForm.stock_quantity),
    };
    await fetch(`/api/product/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const { data: updatedProduct }: { data: Product } = await res.json();
        setProduct(updatedProduct);
        setIsEditing(false);
        setUpdateStatus({ loading: false, error: null, success: true });
      })
      .catch(() => {
        setUpdateStatus({
          loading: false,
          error: "商品情報の更新に失敗しました。",
          success: false,
        });
      });
  };

  return {
    product,
    auctions,
    lotteryEvents,
    loading,
    error,
    isEditing,
    editForm,
    updateStatus,
    handleInputChange,
    handleSubmit,
    setIsEditing,
  };
};

const ProductDetail = () => {
  return <ProductDetailView {...useProductDetail()} />;
};

export default ProductDetail;
