import { USER_TOKEN } from "@/const/cookies";
import { verifyToken } from "@/lib/jwt";
import { useTranslation as t } from "@/lib/translations";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";
  const isShow = true;

  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (userToken) {
    redirect(`/${lang}`);
  }
  return (
    <div className="flex items-center justify-center min-h-dvh bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="space-y-4">
          {!isShow && (
            <button
              type="button"
              className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 shadow-md cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                role="img"
                aria-labelledby="facebook-icon"
              >
                <title id="facebook-icon">Facebook Icon</title>
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
              {t(l).login.facebook}
            </button>
          )}

          <a href="/api/auth/google">
            <button
              type="button"
              className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg transition duration-300 shadow-sm cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                role="img"
                aria-labelledby="google-icon"
              >
                <title id="google-icon">Google Icon</title>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t(l).login.google}
            </button>
          </a>

          {!isShow && (
            <button
              type="button"
              className="flex items-center justify-center w-full py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-lg transition duration-300 shadow-md"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                role="img"
                aria-labelledby="twitter-icon"
              >
                <title id="twitter-icon">Twitter Icon</title>
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
              {t(l).login.twitter}
            </button>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t(l).login.notHaveAccount}
            <a href="/ja/signup" className="text-blue-600 hover:text-blue-500 font-medium ml-1">
              {t(l).login.signUp}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
