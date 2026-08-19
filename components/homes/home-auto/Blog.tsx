import Link from "next/link";
import Image from "next/image";

import { blogAutoPosts } from "@/data/blogs";

function Blog() {
  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="sect-heading type-2 text-center wow fadeInUp">
            <h3 className="s-title">Insights For Smarter Drives</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Discover expert tips, performance guides, and trends every car
              lover should know.
            </p>
          </div>
          <h4 className="d-none">Perfect Heading SEO</h4>
          <div className="tf-grid-layout md-col-2 cl-gap-xxl-40">
            {blogAutoPosts.map((post, index) => (
              <article
                key={post.id}
                className="article-blog style-list hover-img wow fadeInLeft"
                data-wow-delay={index === 1 || index === 3 ? "0.1s" : undefined}
              >
                <Link
                  href={`/blog-single/${post.id}`}
                  className="blog-image img-style"
                >
                  <Image
                    loading="lazy"
                    width={340}
                    height={227}
                    src={post.img}
                    alt={post.alt || post.title}
                  />
                </Link>
                <div className="blog-content">
                  <p className="entry-date text-caption-01 fw-semibold cl-text-3">
                    {post.date}
                  </p>
                  <h5 className="entry-title">
                    <Link
                      href={`/blog-single/${post.id}`}
                      className="link-underline link"
                    >
                      {post.title}
                    </Link>
                  </h5>
                  <p className="entry-desc cl-text-2">{post.desc}</p>
                  <Link
                    href={`/blog-single/${post.id}`}
                    className="tf-btn-line-2 style-primary fw-semibold py-4"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Blog;
