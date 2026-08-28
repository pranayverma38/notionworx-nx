import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="tf-topbar" style={{ backgroundColor: "#000000" }}>
      <div className="container">
        <div className="py-10 text-center">
          <p
            className="m-0 text-white"
            style={{ fontSize: "14px", lineHeight: 1.5 }}
          >
            Free delivery for ALL orders over $250 | BECOME A PARTNER AND START
            EARNING NOW!{" "}
            <Link
              href="/affiliate-registration"
              className="text-white text-decoration-underline"
            >
              CLICK HERE!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
