// import { dev } from "$app/environment";
import { RESEND_API_KEY, RESEND_MAIL } from "$env/static/private";
import type { EmailSentResult } from "./types";
// import type { ContentItem, EmailAddress, MailSendBody, Personalization } from "./types";
// import { HOST, DKIM_PRIVATE_KEY, SENDER_EMAIL, DKIM_DOMAIN } from "$env/static/private";

export async function sendEmail(email: string, subject: string, body: string): Promise<EmailSentResult> {
  // const toEmailAddress: EmailAddress = { email };

  // const fromEmailAddress: EmailAddress = {
  //   email: SENDER_EMAIL,
  //   name: "Kit SaaS Starter"
  // };

  // const personalization: Personalization = {
  //   to: [toEmailAddress],
  //   from: fromEmailAddress,
  //   dkim_domain: DKIM_DOMAIN,
  //   dkim_selector: "mailchannels",
  //   dkim_private_key: DKIM_PRIVATE_KEY
  // };

  // const content: ContentItem = {
  //   type: "text/html",
  //   value: body
  // };

  // const payload: MailSendBody = {
  //   personalizations: [personalization],
  //   from: fromEmailAddress,
  //   subject,
  //   content: [content]
  // };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: RESEND_MAIL,
      to: email,
      subject: subject,
      html: body
    })
  });

  let data: string;
  const { headers, status } = response;
  if (status === 200) {
    const contentType = headers.get("content-type") || "";
    const isJsonResponse = contentType.includes("application/json");

    data = isJsonResponse ? JSON.stringify(await response.json()) : await response.text();

    return { success: true, data };
  }

  return { success: false, error: "Failed to send email!" };

  // TODO use mailchannels (it's free) when you get the domain
  // const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json"
  //   },
  //   body: JSON.stringify(payload)
  // });

  // if (response.status === 202) return { success: true };

  // try {
  //   const { errors } = await response.json();
  //   return { success: false, errors };
  // } catch {
  //   return { success: false, errors: [response.statusText] };
  // }
}
