"use client";

import { useRouter } from "next/navigation";

const RedirectButton = ({ text, className, to }: { text: string; className: string; to: string }) => {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`${className} cursor-pointer`}
      onClick={() => {
        router.push(to);
      }}
    >
      {text}
    </button>
  );
};

export default RedirectButton;
