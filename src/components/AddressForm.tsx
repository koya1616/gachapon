"use client";

import { useState } from "react";
import { useTranslation as t } from "@/lib/translations";
import type { Lang } from "@/types";

interface FormFields {
  name: string;
  country: string;
  postalCode: string;
  address: string;
}

const AddressForm = ({ info, lang }: { info: FormFields; lang: Lang }) => {
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const [formData, setFormData] = useState({
    name: info.name,
    country: info.country,
    postalCode: info.postalCode,
    address: info.address,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: FormFields) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("送信データ:", formData);
    // ここでバックエンドAPIにデータを送信する処理を実装
    alert("住所が登録されました！");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="country" className="block text-gray-700 mb-2">
            {t(l).form.countrySelect}
          </label>
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
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            {t(l).form.recipientName}
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="postalCode" className="block text-gray-700 mb-2">
            {t(l).form.postalCode}
          </label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 mb-2">
            {t(l).form.address}
          </label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                country: "",
                postalCode: "",
                address: "",
              });
            }}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 cursor-pointer"
          >
            {t(l).form.clear}
          </button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer">
            {t(l).form.register}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
