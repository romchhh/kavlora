export type ContactFormSource = "contact" | "contact-modal";

export type SendContactPayload = {
  formSource: ContactFormSource;
  fullName: string;
  email: string;
  phone: string;
  interests: string[];
  message: string;
};

export async function sendContactForm(
  payload: SendContactPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/send-contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: { error?: string } = {};
  try {
    data = (await res.json()) as { error?: string };
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const err =
      typeof data.error === "string" && data.error.length > 0
        ? data.error
        : "Request failed";
    return { ok: false, error: err };
  }

  return { ok: true };
}
