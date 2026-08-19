"use client";

import { type FormEvent, useState } from "react";

type NewsletterFormProps = {
  className?: string;
  placeholder?: string;
  buttonClassName?: string;
  buttonLabel?: string;
  buttonIconClassName?: string;
  successMessage?: string;
  errorMessage?: string;
  messageClassName?: string;
};

export function NewsletterForm({
  className = "form-sub",
  placeholder = "Enter your e-mail",
  buttonClassName = "btn-action",
  buttonLabel,
  buttonIconClassName = "icon icon-ArrowUpRight",
  successMessage = "Subscribed successfully.",
  errorMessage = "Subscription failed. Please try again.",
  messageClassName = "mt-8 mb-12 fs-16 fw-medium",
}: NewsletterFormProps) {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    window.setTimeout(() => setShowMessage(false), 2500);
  };

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
    const email = emailInput?.value ?? "";

    try {
      const response = await fetch(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if ([200, 201].includes(response.status)) {
        form.reset();
        setSuccess(true);
        handleShowMessage();
      } else {
        setSuccess(false);
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error:", error);
      setSuccess(false);
      handleShowMessage();
      form.reset();
    }
  };

  return (
    <>
      <form className={className} onSubmit={sendEmail}>
        <fieldset>
          <input
            type="email"
            name="email"
            placeholder={placeholder}
            required
          />
        </fieldset>
        <button type="submit" className={buttonClassName} aria-label="Subscribe">
          {buttonLabel ? buttonLabel : <i className={buttonIconClassName} />}
        </button>
      </form>
      {showMessage ? (
        <p
          className={`${messageClassName} ${success ? "text-success" : "text-danger"}`.trim()}
          role="status"
          aria-live="polite"
        >
          {success ? successMessage : errorMessage}
        </p>
      ) : null}
    </>
  );
}
