import "server-only";
import { Resend } from "resend";

type Mail = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * Invio email via Resend. Se RESEND_API_KEY manca, degrada: logga e ritorna
 * { sent:false } senza lanciare — la richiesta di prenotazione resta salvata.
 */
export async function sendEmail(
  mail: Mail,
): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email] RESEND_API_KEY assente — skip: "${mail.subject}"`);
    return { sent: false };
  }

  try {
    const resend = new Resend(key);
    const from =
      process.env.RESEND_FROM ||
      "Ostello del Convento <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      replyTo: mail.replyTo,
    });
    if (error) {
      console.error("[email] invio fallito:", error);
      return { sent: false, error: String(error) };
    }
    return { sent: true };
  } catch (e) {
    console.error("[email] eccezione:", e);
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
