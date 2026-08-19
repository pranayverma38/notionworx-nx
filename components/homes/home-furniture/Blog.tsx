import Link from "next/link";
import Image from "next/image";

import { blogFurniturePosts } from "@/data/blogs";

function Blog() {
  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="sect-heading type-2 text-center wow fadeInUp">
            <h3 className="s-title">Stories For Modern Homes</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Inspiring ideas, design tips, and everyday stories to help create
              comfortable.
            </p>
          </div>
          <div className="tf-grid-layout sm-col-2 cl-gap-xxl-40">
            {blogFurniturePosts.map((post) => (
              <article
                key={post.id}
                className="article-blog style-list hover-img wow fadeInUp"
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
