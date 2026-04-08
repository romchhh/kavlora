import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { sendContactForm } from "@/lib/sendContactForm";
import styles from "./ContactModal.module.css";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CLOSE_LABELS = {
  uk: "Закрити модальне вікно",
  en: "Close modal",
  "zh-CN": "关闭弹窗",
} as const;

type InterestKey = "lamels" | "cuttings" | "other";

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { dict, locale } = useI18n();
  const t = dict.contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [interests, setInterests] = useState<Record<InterestKey, boolean>>({
    lamels: false,
    cuttings: false,
    other: false,
  });
  const [agreed, setAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<
    { kind: "success"; text: string } | { kind: "error"; text: string } | null
  >(null);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      agreed &&
      !isSending
    );
  }, [agreed, email, isSending, name, phone]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFeedback(null);
      setIsSending(false);
    }
  }, [isOpen]);

  const toggleInterest = (key: InterestKey) => {
    setInterests((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setFeedback(null);
    setIsSending(true);

    const interestKeys = (
      Object.entries(interests) as [InterestKey, boolean][]
    )
      .filter(([, on]) => on)
      .map(([k]) => k);

    const result = await sendContactForm({
      formSource: "contact-modal",
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      interests: interestKeys,
      message: message.trim(),
    });

    setIsSending(false);

    if (result.ok) {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setInterests({ lamels: false, cuttings: false, other: false });
      setAgreed(false);
      setFeedback({ kind: "success", text: t.submitSuccess });
      return;
    }

    setFeedback({ kind: "error", text: t.submitError });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={t.formAriaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          aria-label={CLOSE_LABELS[locale]}
          onClick={onClose}
        >
          <span />
          <span />
        </button>

        <p className={styles.kicker}>{t.kicker}</p>
        <p className={styles.lead}>{t.lead}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span>
                {t.nameLabel} <em>*</em>
              </span>
              <input
                type="text"
                name="name"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span>
                {t.emailLabel} <em>*</em>
              </span>
              <input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>
              {t.phoneLabel} <em>*</em>
            </span>
            <input
              type="tel"
              name="phone"
              placeholder={t.phonePlaceholder}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              autoComplete="tel"
            />
          </label>

          <fieldset className={styles.interest}>
            <legend>{t.interestsLegend}</legend>
            <label>
              <input
                type="checkbox"
                name="interest"
                value="lamels"
                checked={interests.lamels}
                onChange={() => toggleInterest("lamels")}
              />{" "}
              {t.interestLamels}
            </label>
            <label>
              <input
                type="checkbox"
                name="interest"
                value="cuttings"
                checked={interests.cuttings}
                onChange={() => toggleInterest("cuttings")}
              />{" "}
              {t.interestCuttings}
            </label>
            <label>
              <input
                type="checkbox"
                name="interest"
                value="other"
                checked={interests.other}
                onChange={() => toggleInterest("other")}
              />{" "}
              {t.interestOther}
            </label>
          </fieldset>

          <label className={styles.field}>
            <span>{t.detailsLabel}</span>
            <textarea
              name="message"
              rows={5}
              placeholder={t.detailsPlaceholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>

          <label className={styles.agree}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              required
            />
            <span>{t.agreementLabel}</span>
          </label>

          <button type="submit" className={styles.submit} disabled={!canSubmit}>
            {isSending ? t.submitSending : t.submit}
          </button>

          {feedback ? (
            <p
              role="status"
              className={
                feedback.kind === "error"
                  ? `${styles.formStatus} ${styles.formStatusError}`
                  : styles.formStatus
              }
            >
              {feedback.text}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
