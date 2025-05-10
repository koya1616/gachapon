import { GoogleIcon } from "@/components/Icons";
import { useTranslation as t } from "@/lib/translations";
import type { SignupPageLogic } from "../../page";

const SignupPageView = ({ l }: SignupPageLogic) => {
  return (
    <div className="flex items-center justify-center min-h-100 w-[95%] mx-auto">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="space-y-4">
          <a href="/api/auth/google">
            <button
              type="button"
              className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg transition duration-300 shadow-sm cursor-pointer"
            >
              <GoogleIcon />
              {t(l).signup.google}
            </button>
          </a>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t(l).login.not_have_account}
            <a href="/ja/login" className="text-blue-600 hover:text-blue-500 font-medium ml-1">
              {t(l).login.sign_up}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPageView;
