import EmailVerificationHtml from "./templates/email-verification.html?raw";
import PasswordResetHtml from "./templates/password-reset.html?raw";
import WelcomeHtml from "./templates/welcome.html?raw";
import { sendEmail } from ".";
import { APP_NAME, APP_URL } from "$configs/general";
import { route } from "$lib/ROUTES";

export async function sendEmailVerificationEmail(email: string, name: string, code: string): Promise<boolean> {
  if (!email || !name || !code) return false;

  const body = EmailVerificationHtml.replaceAll("{{appName}}", APP_NAME).replace("{{user}}", name).replace("{{code}}", code);

  return await sendEmail(email, `Verify your ${APP_NAME} email`, body);
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  if (!email || !name) return false;

  const body = WelcomeHtml.replaceAll("{{appName}}", APP_NAME)
    .replace("{{user}}", name)
    .replace("{{url}}", APP_URL + route("/dashboard"));

  return await sendEmail(email, `Welcome to ${APP_NAME}`, body);
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
  if (!email || !code) return false;

  const body = PasswordResetHtml.replaceAll("{{appName}}", APP_NAME).replace("{{code}}", code);

  return await sendEmail(email, `Reset your password for ${APP_NAME}`, body);
}
