import "server-only";
import { SITE } from "@/lib/site";

type BookingEmailData = {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  message?: string;
  locale: "it" | "en";
};

/* HTML minimale, compatibile coi client email: layout in tabella, stili inline,
   palette del sito (calce/cotto/inchiostro). */

function shell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4efe6;font-family:Georgia,'Times New Roman',serif;color:#332e26;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fdfbf7;border:1px solid #e2dacc;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #e2dacc;">
            <p style="margin:0;font-family:Verdana,Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#a65a33;">Ostello del Convento</p>
            <p style="margin:4px 0 0;font-size:22px;">Sant&rsquo;Antonio &middot; Acerno</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <h1 style="margin:0 0 16px;font-size:20px;font-weight:normal;">${title}</h1>
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e2dacc;font-family:Verdana,Arial,sans-serif;font-size:11px;color:#8a8479;">
            ${SITE.name} &middot; ${SITE.address}<br/>
            ${SITE.org} &middot; <a href="mailto:${SITE.email}" style="color:#a65a33;">${SITE.email}</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailRows(d: BookingEmailData, labels: Record<string, string>): string {
  const row = (k: string, v: string) =>
    `<tr>
      <td style="padding:6px 12px 6px 0;font-family:Verdana,Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8a8479;white-space:nowrap;">${k}</td>
      <td style="padding:6px 0;font-size:15px;">${v}</td>
    </tr>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0;border-left:3px solid #b8875a;padding-left:14px;">
    ${row(labels.room, d.roomName)}
    ${row(labels.dates, `${d.checkIn} → ${d.checkOut}`)}
    ${row(labels.guests, String(d.numGuests))}
  </table>`;
}

/** Email all'ospite: "richiesta ricevuta". */
export function guestConfirmationEmail(d: BookingEmailData): {
  subject: string;
  html: string;
} {
  if (d.locale === "en") {
    const body = `
      <p style="margin:0 0 12px;line-height:1.6;">Dear ${d.guestName},</p>
      <p style="margin:0 0 12px;line-height:1.6;">we have received your booking request. Here is a summary:</p>
      ${detailRows(d, { room: "Room", dates: "Dates", guests: "Guests" })}
      <p style="margin:12px 0 0;line-height:1.6;">This is not a confirmation yet: we will check availability and get back to you shortly by email. No payment is required online.</p>
      <p style="margin:16px 0 0;line-height:1.6;">With warm regards,<br/>${SITE.name}</p>`;
    return {
      subject: `Request received — ${SITE.shortName}`,
      html: shell("We received your request", body),
    };
  }
  const body = `
    <p style="margin:0 0 12px;line-height:1.6;">Ciao ${d.guestName},</p>
    <p style="margin:0 0 12px;line-height:1.6;">abbiamo ricevuto la tua richiesta di prenotazione. Ecco il riepilogo:</p>
    ${detailRows(d, { room: "Sistemazione", dates: "Date", guests: "Ospiti" })}
    <p style="margin:12px 0 0;line-height:1.6;">Non è ancora una conferma: verifichiamo la disponibilità e ti ricontattiamo a breve via email. Nessun pagamento online richiesto.</p>
    <p style="margin:16px 0 0;line-height:1.6;">Un caro saluto,<br/>${SITE.name}</p>`;
  return {
    subject: `Richiesta ricevuta — ${SITE.shortName}`,
    html: shell("Abbiamo ricevuto la tua richiesta", body),
  };
}

/** Email all'ostello: nuova richiesta da gestire. */
export function hostelNotificationEmail(d: BookingEmailData): {
  subject: string;
  html: string;
} {
  const contact = [
    `<a href="mailto:${d.guestEmail}" style="color:#a65a33;">${d.guestEmail}</a>`,
    d.guestPhone ? d.guestPhone : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const body = `
    <p style="margin:0 0 12px;line-height:1.6;">Nuova richiesta di prenotazione da <strong>${d.guestName}</strong> (${contact}).</p>
    ${detailRows(d, { room: "Sistemazione", dates: "Date", guests: "Ospiti" })}
    ${
      d.message
        ? `<p style="margin:12px 0 0;line-height:1.6;"><em>«${d.message}»</em></p>`
        : ""
    }
    <p style="margin:16px 0 0;line-height:1.6;font-family:Verdana,Arial,sans-serif;font-size:12px;color:#8a8479;">Lingua ospite: ${d.locale.toUpperCase()} — rispondere per confermare o rifiutare.</p>`;
  return {
    subject: `Nuova richiesta: ${d.guestName} · ${d.checkIn} → ${d.checkOut}`,
    html: shell("Nuova richiesta di prenotazione", body),
  };
}

type BookingStatusEmailData = {
  status: "confirmed" | "declined";
  locale: "it" | "en";
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
};

/** Email di esito all'ospite: richiesta confermata o rifiutata. */
export function bookingStatusEmail(d: BookingStatusEmailData): {
  subject: string;
  html: string;
} {
  const details = detailRows(
    {
      guestName: d.guestName,
      guestEmail: "",
      roomName: d.roomName,
      checkIn: d.checkIn,
      checkOut: d.checkOut,
      numGuests: d.numGuests,
      locale: d.locale,
    },
    d.locale === "en"
      ? { room: "Room", dates: "Dates", guests: "Guests" }
      : { room: "Sistemazione", dates: "Date", guests: "Ospiti" },
  );

  if (d.locale === "en") {
    if (d.status === "confirmed") {
      const body = `
        <p style="margin:0 0 12px;line-height:1.6;">Dear ${d.guestName},</p>
        <p style="margin:0 0 12px;line-height:1.6;">good news — your booking request has been <strong>confirmed</strong>:</p>
        ${details}
        <p style="margin:12px 0 0;line-height:1.6;">We look forward to welcoming you in Acerno. If your plans change, just reply to this email.</p>
        <p style="margin:16px 0 0;line-height:1.6;">With warm regards,<br/>${SITE.name}</p>`;
      return {
        subject: `Booking confirmed — ${SITE.shortName}`,
        html: shell("Your booking is confirmed", body),
      };
    }
    const body = `
      <p style="margin:0 0 12px;line-height:1.6;">Dear ${d.guestName},</p>
      <p style="margin:0 0 12px;line-height:1.6;">unfortunately we cannot accommodate your request:</p>
      ${details}
      <p style="margin:12px 0 0;line-height:1.6;">This is usually due to availability. Feel free to try different dates, or reply to this email — we'll gladly help you find an alternative.</p>
      <p style="margin:16px 0 0;line-height:1.6;">With warm regards,<br/>${SITE.name}</p>`;
    return {
      subject: `About your booking request — ${SITE.shortName}`,
      html: shell("About your booking request", body),
    };
  }

  if (d.status === "confirmed") {
    const body = `
      <p style="margin:0 0 12px;line-height:1.6;">Ciao ${d.guestName},</p>
      <p style="margin:0 0 12px;line-height:1.6;">buone notizie — la tua richiesta di prenotazione è stata <strong>confermata</strong>:</p>
      ${details}
      <p style="margin:12px 0 0;line-height:1.6;">Ti aspettiamo ad Acerno. Se i tuoi piani cambiano, rispondi pure a questa email.</p>
      <p style="margin:16px 0 0;line-height:1.6;">Un caro saluto,<br/>${SITE.name}</p>`;
    return {
      subject: `Prenotazione confermata — ${SITE.shortName}`,
      html: shell("La tua prenotazione è confermata", body),
    };
  }
  const body = `
    <p style="margin:0 0 12px;line-height:1.6;">Ciao ${d.guestName},</p>
    <p style="margin:0 0 12px;line-height:1.6;">purtroppo non possiamo accogliere la tua richiesta:</p>
    ${details}
    <p style="margin:12px 0 0;line-height:1.6;">Di solito dipende dalla disponibilità. Prova con altre date, oppure rispondi a questa email: ti aiutiamo volentieri a trovare un'alternativa.</p>
    <p style="margin:16px 0 0;line-height:1.6;">Un caro saluto,<br/>${SITE.name}</p>`;
  return {
    subject: `Sulla tua richiesta di prenotazione — ${SITE.shortName}`,
    html: shell("Sulla tua richiesta di prenotazione", body),
  };
}

export type { BookingEmailData };
