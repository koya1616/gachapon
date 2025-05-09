"use client";

import { useActionState } from "react";
import React from "react";
import LoginView from "./_components/PageView";

const loginAction = async (prevState: { success: boolean }, formData: FormData) => {
  const code = formData.get("code") as string;

  const response = await fetch("/api/auth/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (response.ok) {
    window.location.href = "/admin/top";
  }

  return { success: response.ok };
};

export interface LoginLogic {
  state: { success: boolean };
  formAction: (formData: FormData) => void;
  isPending: boolean;
}

const useLoginLogic = (): LoginLogic => {
  const [state, formAction, isPending] = useActionState(loginAction, { success: true });

  return { state, formAction, isPending };
};

const Login = () => {
  return <LoginView {...useLoginLogic()} />;
};

export default React.memo(Login);
