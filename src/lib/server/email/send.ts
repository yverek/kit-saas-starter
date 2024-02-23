import WelcomeHtml from "./templates/welcome.html?raw";
import { sendEmail } from ".";
import type { EmailSentResult } from "./types";

export async function sendWelcomeEmail(email: string): Promise<EmailSentResult> {
  const body = WelcomeHtml.replace("{{name}}", "Mauro");

  const res = await sendEmail(email, "Welcome buddy!", body);

  if (!res.success) {
    res.error = `Failed to sent welcome mail to ${email}`;
  }

  return res;
}
