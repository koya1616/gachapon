import { Button } from "@/components/Button";
import { GoogleIcon } from "@/components/Icons";
import { useTranslation as t } from "@/lib/translations";
import Link from "next/link";
import type { SignupPageLogic } from "../../page";

const SignupPageView = ({ l }: SignupPageLogic) => {
  return (
    <div className="flex items-center justify-center min-h-100 w-[95%] mx-auto">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="space-y-4">
          <Button variant="outlined" color="gray" width="w-full">
            <Link href="/api/auth/google" className="flex items-center justify-center">
              <GoogleIcon />
              {t(l).signup.google}
            </Link>
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t(l).login.have_account}
            <Link href="/ja/login" className="text-blue-600 hover:text-blue-500 font-medium ml-1">
              {t(l).login.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPageView;
