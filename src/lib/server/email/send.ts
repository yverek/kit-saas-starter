import WelcomeHtml from "./templates/welcome.html?raw";
import { sendEmail } from ".";

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  if (!email || !name) return false;

  const body = WelcomeHtml.replace("{{name}}", name);

  return await sendEmail(email, "Welcome buddy!", body);
}
