import WelcomeHtml from "./templates/welcome.html?raw";
import { sendEmail } from ".";
import { APP_NAME, APP_URL } from "$configs/general";
import { route } from "$lib/ROUTES";

export async function sendWelcomeEmail(email: string, name: string, tokenId: string): Promise<boolean> {
  if (!name || !tokenId) return false;

  const body = WelcomeHtml.replaceAll("{{appName}}", APP_NAME)
    .replace("{{user}}", name)
    .replace("{{token}}", tokenId)
    .replace("{{url}}", APP_URL + route("/auth/verify-email/[tokenId=tokenId]", { tokenId }));

  return await sendEmail(email, `Verify your ${APP_NAME} email`, body);
}
