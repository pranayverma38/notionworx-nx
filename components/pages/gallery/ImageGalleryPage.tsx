import Image from "next/image";

type ImageGalleryPageProps = {
  title: string;
  imagePaths: string[];
  emptyMessage?: string;
};

export default function ImageGalleryPage({
  title,
  imagePaths,
  emptyMessage,
}: ImageGalleryPageProps) {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Gallery
          </p>
          <h1
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
        </div>

        {imagePaths.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {imagePaths.map((imagePath, index) => (
              <div
                key={imagePath}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
                }}
              >
                <Image
                  src={imagePath}
                  alt={`${title} gallery image ${index + 1}`}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              borderRadius: "20px",
              border: "1px dashed #cbd5e1",
              background: "#f8fafc",
              padding: "48px 24px",
              textAlign: "center",
              color: "#475569",
            }}
          >
            <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.7 }}>
              {emptyMessage ?? "No gallery images are available yet."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
