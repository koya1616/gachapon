import Loading from "@/components/Loading";
import React from "react";
import type { LoginLogic } from "../../page";

const LoginView = ({ state, formAction, isPending }: LoginLogic) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-4" action={formAction}>
            <div>
              <label htmlFor="code" className="hidden text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  name="code"
                  type="password"
                  autoComplete="current-code"
                  required
                  data-testid="code-input"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {state.success === false && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">ログインコードが無効です。</div>
              </div>
            )}

            {isPending ? (
              <Loading />
            ) : (
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                ログイン
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoginView);
