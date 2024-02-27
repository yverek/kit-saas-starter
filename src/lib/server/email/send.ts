import WelcomeHtml from "./templates/welcome.html?raw";
import EmailVerificationHtml from "./templates/email-verification.html?raw";
import { sendEmail } from ".";
import { APP_NAME, APP_URL } from "$configs/general";
import { route } from "$lib/ROUTES";

export async function sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
  if (!email || !name || !token) return false;

  const body = EmailVerificationHtml.replaceAll("{{appName}}", APP_NAME)
    .replace("{{user}}", name)
    .replace("{{token}}", token)
    .replace("{{url}}", APP_URL + route("/auth/verify-email/[token=token]", { token }));

  return await sendEmail(email, `Verify your ${APP_NAME} email`, body);
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  if (!email || !name) return false;

  const body = WelcomeHtml.replaceAll("{{appName}}", APP_NAME)
    .replace("{{user}}", name)
    .replace("{{url}}", APP_URL + route("/dashboard"));

  return await sendEmail(email, `Welcome to ${APP_NAME}`, body);
}
