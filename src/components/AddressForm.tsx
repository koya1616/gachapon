"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation as t } from "@/lib/translations";
import type { Address, Lang } from "@/types";
import ButtonLoading from "./ButtonLoading";

const AddressForm = ({ lang }: { lang: Lang }) => {
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
    const address = await response.json();
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
        await fetch("/api/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
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

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="country" className="block text-gray-700 mb-2">
            {t(l).form.country_select}
          </label>
          {isFetching ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          ) : (
            <select
              id="country"
              value={formData.country}
              onChange={handleChange}
              name="country"
              className="w-full p-2 border rounded"
            >
              <option value="albania">Albania</option>
              <option value="argentina">Argentina</option>
              <option value="australia">Australia</option>
              <option value="austria">Austria</option>
              <option value="belgium">Belgium</option>
              <option value="bosnia">Bosnia and Herzegovina</option>
              <option value="brazil">Brazil</option>
              <option value="bulgaria">Bulgaria</option>
              <option value="canada">Canada</option>
              <option value="china">China</option>
              <option value="croatia">Croatia</option>
              <option value="czech">Czech Republic</option>
              <option value="denmark">Denmark</option>
              <option value="finland">Finland</option>
              <option value="france">France</option>
              <option value="germany">Germany</option>
              <option value="greece">Greece</option>
              <option value="hungary">Hungary</option>
              <option value="india">India</option>
              <option value="indonesia">Indonesia</option>
              <option value="ireland">Ireland</option>
              <option value="italy">Italy</option>
              <option value="japan">Japan</option>
              <option value="korea">Korea</option>
              <option value="malaysia">Malaysia</option>
              <option value="mexico">Mexico</option>
              <option value="netherlands">Netherlands</option>
              <option value="newzealand">New Zealand</option>
              <option value="norway">Norway</option>
              <option value="philippines">Philippines</option>
              <option value="poland">Poland</option>
              <option value="portugal">Portugal</option>
              <option value="romania">Romania</option>
              <option value="russia">Russia</option>
              <option value="serbia">Serbia</option>
              <option value="singapore">Singapore</option>
              <option value="slovakia">Slovakia</option>
              <option value="slovenia">Slovenia</option>
              <option value="southafrica">South Africa</option>
              <option value="spain">Spain</option>
              <option value="sweden">Sweden</option>
              <option value="switzerland">Switzerland</option>
              <option value="taiwan">Taiwan</option>
              <option value="thailand">Thailand</option>
              <option value="uk">United Kingdom</option>
              <option value="ukraine">Ukraine</option>
              <option value="us">United States</option>
              <option value="vietnam">Vietnam</option>
            </select>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            {t(l).form.recipient_name}
          </label>
          {isFetching ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          ) : (
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="postal_code" className="block text-gray-700 mb-2">
            {t(l).form.postal_code}
          </label>
          {isFetching ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          ) : (
            <input
              id="postal_code"
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 mb-2">
            {t(l).form.address}
          </label>
          {isFetching ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          ) : (
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          )}
        </div>

        {!isFetching && (
          <div className="flex justify-between">
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
              {isLoading ? <ButtonLoading color="white" /> : <span>{t(l).form.register}</span>}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddressForm;
