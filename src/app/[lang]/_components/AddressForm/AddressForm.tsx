"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation as t } from "@/lib/translations";
import type { Address, Lang } from "@/types";
import { COUNTRY_LIST } from "@/const/country";
import Loading from "@/components/Loading";
import Skeleton from "@/components/Skeleton";

const FormField = ({
  id,
  label,
  value,
  onChange,
  isLoading,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 mb-2">
      {label}
    </label>
    {isLoading ? (
      <Skeleton h={10} />
    ) : (
      <input id={id} type="text" name={id} value={value} onChange={onChange} className="w-full p-2 border rounded" />
    )}
  </div>
);

interface AddressFormLogic {
  l: Lang;
  formData: Address;
  isLoading: boolean;
  isFetching: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleClear: () => void;
}

export const AddressFormView = ({
  l,
  formData,
  isLoading,
  isFetching,
  handleChange,
  handleSubmit,
  handleClear,
}: AddressFormLogic) => {
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="country" className="block text-gray-700 mb-2">
            {t(l).form.country_select}
          </label>
          {isFetching ? (
            <Skeleton h={10} />
          ) : (
            <select
              id="country"
              value={formData.country}
              onChange={handleChange}
              name="country"
              className="w-full p-2 border rounded"
            >
              {COUNTRY_LIST.map((country) => (
                <option key={country.key} value={country.key}>
                  {country.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <FormField
          id="name"
          label={t(l).form.recipient_name}
          value={formData.name}
          onChange={handleChange}
          isLoading={isFetching}
        />

        <FormField
          id="postal_code"
          label={t(l).form.postal_code}
          value={formData.postal_code}
          onChange={handleChange}
          isLoading={isFetching}
        />

        <FormField
          id="address"
          label={t(l).form.address}
          value={formData.address}
          onChange={handleChange}
          isLoading={isFetching}
        />

        {!isFetching && (
          <div className={`flex ${isLoading ? "justify-end" : "justify-between"}`}>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  {t(l).form.clear}
                </button>
                <button
                  type="submit"
                  className="relative bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
                  disabled={isLoading}
                >
                  {t(l).form.register}
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

const useAddressForm = (lang: Lang): AddressFormLogic => {
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const initialFormData = useMemo<Address>(
    () => ({
      id: 0,
      user_id: 0,
      name: "",
      country: "",
      postal_code: "",
      address: "",
    }),
    [],
  );

  const [formData, setFormData] = useState<Address>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchAddress = useCallback(async () => {
    const response = await fetch("/api/address");
    if (response.status === 401) {
      window.location.href = "/ja/login";
      return;
    }
    const { data: address }: { data: Address | null } = await response.json();
    setFormData({
      id: address?.id || 0,
      user_id: address?.user_id || 0,
      name: address?.name || "",
      country: address?.country || "",
      postal_code: address?.postal_code || "",
      address: address?.address || "",
    });
  }, []);

  useEffect(() => {
    setIsFetching(true);
    fetchAddress().finally(() => setIsFetching(false));
  }, [fetchAddress]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: Address) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await fetch("/api/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.status === 401) {
          window.location.href = "/ja/login";
          return;
        }
      } catch (error) {
        alert(t(l).form.fail.address);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, l],
  );

  const handleClear = useCallback(() => {
    setFormData((prevData) => ({
      id: prevData.id,
      user_id: prevData.user_id,
      name: "",
      country: "",
      postal_code: "",
      address: "",
    }));
  }, []);

  return {
    l,
    formData,
    isLoading,
    isFetching,
    handleChange,
    handleSubmit,
    handleClear,
  };
};

const AddressForm = ({ lang }: { lang: Lang }) => {
  return <AddressFormView {...useAddressForm(lang)} />;
};

export default AddressForm;
