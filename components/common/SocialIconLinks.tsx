import { socialLinks } from "@/data/contactInfo";

type SocialIconLinksProps = {
  className?: string;
};

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  switch (icon) {
    case "facebook":
      return <i className="icon icon-FacebookLogo" aria-hidden />;
    case "instagram":
      return <i className="icon icon-InstagramLogo" aria-hidden />;
    case "tiktok":
      return <i className="icon icon-TiktokLogo" aria-hidden />;
    case "whatsapp":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="currentColor"
        >
          <path d="M19.11 4.89A9.9 9.9 0 0 0 12.06 2a9.94 9.94 0 0 0-8.62 14.9L2 22l5.27-1.38A9.93 9.93 0 0 0 12.05 22H12a10 10 0 0 0 7.11-17.11ZM12 20.29h-.04a8.21 8.21 0 0 1-4.18-1.14l-.3-.18-3.13.82.84-3.05-.2-.31a8.23 8.23 0 1 1 7.01 3.86Zm4.52-6.16c-.25-.12-1.48-.73-1.71-.81-.23-.09-.39-.12-.56.12-.16.24-.64.81-.78.97-.14.16-.28.18-.52.06-.25-.12-1.04-.38-1.98-1.2-.73-.65-1.23-1.45-1.37-1.69-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.33.98 2.49c.12.16 1.7 2.59 4.12 3.63.57.25 1.02.4 1.37.51.57.18 1.09.15 1.5.09.46-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      );
  }
}

export default function SocialIconLinks({
  className = "tf-social-icon-2 hv-dark",
}: SocialIconLinksProps) {
  return (
    <ul className={className}>
      {socialLinks.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            title={link.label}
          >
            <SocialIcon icon={link.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
