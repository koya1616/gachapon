import { cookies } from "next/headers";
import { getPaypayPayments } from "@/lib/db";
import { ADMIN_CODE } from "@/const/cookies";
import { redirect } from "next/navigation";
import PaymentView from "./_components/PaymentView";

const usePaymentLogic = async () => {
  const orders = await getPaypayPayments();

  return { orders };
};

const Payment = async () => {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";

  if (adminToken !== process.env.ADMIN_CODE) {
    return redirect("/admin/login");
  }

  const logic = await usePaymentLogic();

  return <PaymentView {...logic} />;
};

export default Payment;
