import type { NextApiRequest, NextApiResponse } from "next";
import { checkRateLimit, containsDangerousPatterns } from "@/lib/security";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const RECIPIENT_EMAIL =
  process.env.EMAILJS_RECIPIENT_EMAIL ?? "kavloraua@gmail.com";

const FORM_LABELS: Record<string, string> = {
  contact: "Contact page",
  "contact-modal": "Modal (header / pages)",
};

const INTEREST_KEYS = new Set(["lamels", "cuttings", "other"]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const forwarded = req.headers["x-forwarded-for"];
    const clientId =
      (typeof forwarded === "string"
        ? forwarded.split(",")[0]?.trim()
        : Array.isArray(forwarded)
          ? forwarded[0]
          : null) ||
      req.socket?.remoteAddress ||
      "unknown";

    const rateLimit = checkRateLimit(clientId, 20, 60_000);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: "Invalid body" });
    }

    if (JSON.stringify(body).length > 50_000) {
      return res.status(400).json({ error: "Payload too large" });
    }

    const formSourceRaw = body.formSource;
    const fullName = body.fullName;
    const phone = body.phone;
    const email = body.email;
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const interestsRaw = body.interests;
    const interests: string[] = Array.isArray(interestsRaw)
      ? interestsRaw.filter(
          (x): x is string =>
            typeof x === "string" && INTEREST_KEYS.has(x.trim())
        )
      : [];

    const formSource =
      formSourceRaw === "contact" || formSourceRaw === "contact-modal"
        ? formSourceRaw
        : null;

    if (!formSource) {
      return res.status(400).json({ error: "Invalid form source" });
    }

    if (!isNonEmptyString(fullName)) {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (!isNonEmptyString(phone)) {
      return res.status(400).json({ error: "Phone is required" });
    }

    if (!isNonEmptyString(email) || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const interestsLine = interests.length > 0 ? interests.join(", ") : "—";
    const contentToCheck = `${fullName} ${phone} ${email} ${interestsLine} ${message}`;
    if (containsDangerousPatterns(contentToCheck)) {
      return res.status(400).json({
        error: "Dangerous patterns detected in form data",
      });
    }

    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY ||
      !EMAILJS_PRIVATE_KEY
    ) {
      console.error("EmailJS configuration is not set");
      return res.status(500).json({
        error:
          "Email service not configured. Set EMAILJS_* environment variables.",
      });
    }

    const fn = escapeHtml(fullName.trim());
    const ph = escapeHtml(phone.trim());
    const em = escapeHtml(email.trim());
    const intHtml = escapeHtml(interestsLine);
    const msg = message
      ? escapeHtml(message).replace(/\n/g, "<br>")
      : "—";
    const sourceLabel = FORM_LABELS[formSource] ?? formSource;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #222221;">Kavlora — consultation request</h2>
        <p><strong>Source:</strong> ${escapeHtml(sourceLabel)}</p>
        <p><strong>Full name:</strong> ${fn}</p>
        <p><strong>Phone:</strong> ${ph}</p>
        <p><strong>Email:</strong> ${em}</p>
        <p><strong>Interests (lamels / cuttings / other):</strong> ${intHtml}</p>
        <p><strong>Message:</strong><br>${msg}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">Sent from the Kavlora website contact form.</p>
      </div>
    `;

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: {
            to_email: RECIPIENT_EMAIL,
            subject: `[Kavlora] ${sourceLabel} — ${fullName.trim()}`,
            message: emailHtml,
            reply_to: email.trim() || RECIPIENT_EMAIL,
          },
        }),
      }
    );

    const responseData = await response.text();

    if (!response.ok) {
      console.error("EmailJS API error:", responseData);
      return res.status(500).json({
        error: "Failed to send email",
        details: responseData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "64kb",
    },
  },
};
