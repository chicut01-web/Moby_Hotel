import "server-only";
import { Resend } from "resend";

type Mail = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail(
  mail: Mail,
): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { sent: false };
  }

  try {
    const resend = new Resend(key);
    const from =
      process.env.RESEND_FROM ||
      "Hub for European Youth <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      replyTo: mail.replyTo,
    });
    if (error) {
      return { sent: false, error: String(error) };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
