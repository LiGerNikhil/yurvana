import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type EmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
};

/**
 * Sends an email via Resend. Falls back to a no-op in development when no
 * RESEND_API_KEY is configured so the app can run locally without email.
 */
export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[email] RESEND_API_KEY not set; skipping email send.");
      return { id: "skipped", to, subject };
    }
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return resend.emails.send({
    from: from ?? process.env.EMAIL_FROM ?? "Yurvana Agro <quotes@yurvana.com>",
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });
}

export { resend };