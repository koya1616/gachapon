import { GoogleIcon } from "@/components/Icons";
import { useTranslation as t } from "@/lib/translations";
import React from "react";
import type { LoginPageLogic } from "../../page";

const LoginPageView = ({ l }: LoginPageLogic) => {
  return (
    <div className="flex items-center justify-center min-h-100 w-[95%] mx-auto py-10">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
        <div className="space-y-4">
          <a href="/api/auth/google" className="block">
            <button
              type="button"
              className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg transition duration-300 shadow-sm cursor-pointer"
            >
              <GoogleIcon />
              {t(l).login.google}
            </button>
          </a>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t(l).login.not_have_account}
            <a href={`/${l}/signup`} className="text-blue-600 hover:text-blue-500 font-medium ml-1">
              {t(l).login.sign_up}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPageView;
