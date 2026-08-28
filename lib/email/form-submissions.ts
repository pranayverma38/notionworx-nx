import { Resend } from "resend";

export const runtime = "nodejs";

const FORM_EMAIL_FROM = "messages@notionworkscanopy.com";
const FORM_EMAIL_TO = [
  "orders@notionworx.com",
  "pranayverma38logo@gmail.com",
] as const;

export type ContactSubmission = {
  formType: "contact";
  sourcePath: "/contact";
  name: string;
  email: string;
  projectScope: string;
  saveDetails: boolean;
};

export type AffiliateSubmission = {
  formType: "affiliate_registration" | "home_affiliate";
  sourcePath: "/affiliate-registration" | "/";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
};

export type ArtUploadSubmission = {
  formType: "art_upload";
  sourcePath: "/uploadart";
  fullName: string;
  businessName: string;
  invoiceNumber: string;
  mockupOnly: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  linktree: string;
  website: string;
  dateNeeded: string;
  email: string;
  phone: string;
  designInstructions: string;
  fileName: string;
  fileSizeLabel: string;
};

export type EmailAttachment = {
  filename: string;
  content: string;
  contentType?: string;
};

export type FormSubmission =
  | ContactSubmission
  | AffiliateSubmission
  | ArtUploadSubmission;

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  resendClient ??= new Resend(apiKey);
  return resendClient;
}

export function getFormSubmissionRecipients(): readonly string[] {
  return FORM_EMAIL_TO;
}

export function buildSubmissionEmail(submission: FormSubmission): {
  subject: string;
  html: string;
  text: string;
  replyTo: string;
} {
  if (submission.formType === "contact") {
    const subject = `New contact form submission from ${submission.name}`;

    return {
      subject,
      replyTo: submission.email,
      text: buildTextEmail({
        title: "New contact form submission",
        sections: [
          {
            title: "Contact details",
            rows: [
              ["Source", submission.sourcePath],
              ["Name", submission.name],
              ["Email", submission.email],
              [
                "Saved details in browser",
                submission.saveDetails ? "Yes" : "No",
              ],
            ],
          },
          {
            title: "Project scope",
            rows: [["Message", submission.projectScope]],
          },
        ],
        footerNote: "Sent from the Notion Worx website contact form.",
      }),
      html: renderEmailHtml({
        badge: "Contact form",
        title: "New Contact Request",
        intro:
          "A website visitor submitted the contact form and is expecting a follow-up.",
        sections: [
          {
            title: "Contact details",
            rows: [
              ["Source", submission.sourcePath],
              ["Name", submission.name],
              ["Email", submission.email],
              [
                "Saved details in browser",
                submission.saveDetails ? "Yes" : "No",
              ],
            ],
          },
          {
            title: "Project scope",
            rows: [["Message", submission.projectScope]],
          },
        ],
        footerNote: "Reply directly to this email to respond to the submitter.",
      }),
    };
  }

  if (submission.formType === "art_upload") {
    const subject = `New artwork submission from ${submission.fullName}`;

    return {
      subject,
      replyTo: submission.email,
      text: buildTextEmail({
        title: "New art upload form submission",
        sections: [
          {
            title: "Primary details",
            rows: [
              ["Source", submission.sourcePath],
              ["Full name", submission.fullName],
              ["Business / Club Name", submission.businessName],
              ["Invoice / Order #", formatValue(submission.invoiceNumber)],
              ["Mockup request only", formatValue(submission.mockupOnly)],
              ["Date needed by", submission.dateNeeded],
              ["Email", submission.email],
              ["Phone", submission.phone],
            ],
          },
          {
            title: "Online presence",
            rows: [
              ["Instagram", formatValue(submission.instagram)],
              ["Facebook", formatValue(submission.facebook)],
              ["TikTok", formatValue(submission.tiktok)],
              ["LinkTree", formatValue(submission.linktree)],
              ["Website", formatValue(submission.website)],
            ],
          },
          {
            title: "Design instructions",
            rows: [["Creative brief", submission.designInstructions]],
          },
          {
            title: "Attachment",
            rows: [
              ["Uploaded artwork", formatValue(submission.fileName)],
              ["Attachment size", formatValue(submission.fileSizeLabel)],
            ],
          },
        ],
        footerNote:
          "Any uploaded artwork file has been attached to this email when provided.",
      }),
      html: renderEmailHtml({
        badge: "Artwork intake",
        title: "New Art Upload Submission",
        intro:
          "A customer submitted artwork, design notes, and order context from the upload page.",
        sections: [
          {
            title: "Primary details",
            rows: [
              ["Source", submission.sourcePath],
              ["Full name", submission.fullName],
              ["Business / Club Name", submission.businessName],
              ["Invoice / Order #", formatValue(submission.invoiceNumber)],
              ["Mockup request only", formatValue(submission.mockupOnly)],
              ["Date needed by", submission.dateNeeded],
              ["Email", submission.email],
              ["Phone", submission.phone],
            ],
          },
          {
            title: "Online presence",
            rows: [
              ["Instagram", formatValue(submission.instagram)],
              ["Facebook", formatValue(submission.facebook)],
              ["TikTok", formatValue(submission.tiktok)],
              ["LinkTree", formatValue(submission.linktree)],
              ["Website", formatValue(submission.website)],
            ],
          },
          {
            title: "Design instructions",
            rows: [["Creative brief", submission.designInstructions]],
          },
          {
            title: "Attachment",
            rows: [
              ["Uploaded artwork", formatValue(submission.fileName)],
              ["Attachment size", formatValue(submission.fileSizeLabel)],
            ],
          },
        ],
        footerNote:
          "If a file was selected, it is attached to this email for the design team.",
      }),
    };
  }

  const sourceLabel =
    submission.formType === "home_affiliate"
      ? "Homepage affiliate form"
      : "Affiliate registration page";
  const fullName = `${submission.firstName} ${submission.lastName}`.trim();
  const subject = `New affiliate application from ${fullName || submission.email}`;

  return {
    subject,
    replyTo: submission.email,
    text: buildTextEmail({
      title: "New affiliate application",
      sections: [
        {
          title: "Applicant details",
          rows: [
            ["Source", `${sourceLabel} (${submission.sourcePath})`],
            ["First name", submission.firstName],
            ["Last name", submission.lastName],
            ["Email", submission.email],
            ["Phone", formatValue(submission.phone)],
            ["Instagram", formatValue(submission.instagram)],
          ],
        },
      ],
      footerNote:
        "Password fields were intentionally excluded from the email for security.",
    }),
    html: renderEmailHtml({
      badge: "Affiliate form",
      title: "New Affiliate Application",
      intro:
        "A prospective affiliate submitted an application from the Notion Worx website.",
      sections: [
        {
          title: "Applicant details",
          rows: [
            ["Source", `${sourceLabel} (${submission.sourcePath})`],
            ["First name", submission.firstName],
            ["Last name", submission.lastName],
            ["Email", submission.email],
            ["Phone", formatValue(submission.phone)],
            ["Instagram", formatValue(submission.instagram)],
          ],
        },
        {
          title: "Security note",
          rows: [
            [
              "Password handling",
              "Password fields were intentionally excluded from the email.",
            ],
          ],
        },
      ],
      footerNote: "Reply directly to this email to respond to the applicant.",
    }),
  };
}

export async function sendFormSubmissionEmail(
  submission: FormSubmission,
  options?: {
    attachments?: EmailAttachment[];
  },
): Promise<void> {
  const resend = getResendClient();
  const { subject, html, text, replyTo } = buildSubmissionEmail(submission);
  const response = await resend.emails.send({
    from: FORM_EMAIL_FROM,
    to: [...FORM_EMAIL_TO],
    replyTo,
    subject,
    html,
    text,
    attachments: options?.attachments,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }
}

function renderEmailHtml({
  badge,
  title,
  intro,
  sections,
  footerNote,
}: {
  badge: string;
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    rows: Array<[label: string, value: string]>;
  }>;
  footerNote?: string;
}): string {
  const renderedSections = sections
    .map(({ title: sectionTitle, rows }) => {
      const bodyRows = rows
        .map(
          ([label, value]) => `
            <tr>
              <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 700; width: 210px; vertical-align: top;">
                ${escapeHtml(label)}
              </td>
              <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; white-space: pre-wrap;">
                ${escapeHtml(value)}
              </td>
            </tr>
          `,
        )
        .join("");

      return `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; margin-top: 18px;">
          <h3 style="margin: 0 0 14px; font-size: 16px; line-height: 24px; color: #0f172a;">${escapeHtml(sectionTitle)}</h3>
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tbody>${bodyRows}</tbody>
          </table>
        </div>
      `;
    })
    .join("");

  return `
    <div style="margin: 0; padding: 24px 12px; background: #f8fafc; font-family: Arial, sans-serif; color: #0f172a;">
      <div style="max-width: 760px; margin: 0 auto; background: linear-gradient(135deg, #0b2d6e 0%, #1d4ed8 100%); border-radius: 24px; padding: 32px; color: #ffffff;">
        <div style="display: inline-block; padding: 7px 12px; border-radius: 999px; background: rgba(255,255,255,0.12); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
          ${escapeHtml(badge)}
        </div>
        <h1 style="margin: 16px 0 10px; font-size: 30px; line-height: 36px; color: #ffffff;">
          ${escapeHtml(title)}
        </h1>
        <p style="margin: 0; font-size: 15px; line-height: 24px; color: rgba(255,255,255,0.92);">
          ${escapeHtml(intro)}
        </p>
      </div>
      <div style="max-width: 760px; margin: 20px auto 0;">
        ${renderedSections}
        ${
          footerNote
            ? `<p style="margin: 18px 4px 0; font-size: 13px; line-height: 20px; color: #64748b;">${escapeHtml(
                footerNote,
              )}</p>`
            : ""
        }
      </div>
    </div>
  `;
}

function buildTextEmail({
  title,
  sections,
  footerNote,
}: {
  title: string;
  sections: Array<{
    title: string;
    rows: Array<[label: string, value: string]>;
  }>;
  footerNote?: string;
}): string {
  const parts = [title];

  for (const section of sections) {
    parts.push("");
    parts.push(section.title);
    parts.push(...section.rows.map(([label, value]) => `${label}: ${value}`));
  }

  if (footerNote) {
    parts.push("");
    parts.push(footerNote);
  }

  return parts.join("\n");
}

function formatValue(value: string): string {
  return value.trim() || "Not provided";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
