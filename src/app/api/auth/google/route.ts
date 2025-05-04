import { USER_TOKEN } from "@/const/cookies";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SCOPES = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

export async function GET() {
  const cookieStore = await cookies();
  if (verifyToken(cookieStore.get(USER_TOKEN)?.value || "")) {
    return redirect("/ja");
  }

  const OAUTH_PARAMS = new URLSearchParams({
    scope: SCOPES.join(" "),
    include_granted_scopes: "true",
    response_type: "code",
    state: "state_parameter_passthrough_value",
    redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URI || "",
    client_id: process.env.GOOGLE_CLIENT_ID || "",
  });
  redirect(`https://accounts.google.com/o/oauth2/v2/auth?${OAUTH_PARAMS.toString()}`);
}
