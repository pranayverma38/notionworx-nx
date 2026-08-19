import Link from "next/link";
import Image from "next/image";

import { blogJewelryPosts } from "@/data/blogs";

function Blogs() {
  const [featured, ...rest] = blogJewelryPosts;

  return (
    <>
      <section className="flat-spacing section-insights">
        <div className="container">
          <div className="sect-heading type-2 text-center wow fadeInUp">
            <h3 className="s-title">Jewellery Inspirations</h3>
            <p className="s-desc cl-text-2">
              Latest trends, tips, and stories for jewellery lovers
            </p>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <article className="article-blog hover-img">
                <Link
                  href={`/blog-single/${featured.id}`}
                  className="blog-image img-style"
                >
                  <Image
                    loading="lazy"
                    width={900}
                    height={675}
                    src={featured.img}
                    alt={featured.alt || featured.title}
                  />
                  {featured.tag != null && (
                    <div className="wrap-tags d-flex gap-12">
                      <span className="tag text-caption-01 ">{featured.tag}</span>
                    </div>
                  )}
                </Link>
                <div className="blog-content">
                  <p className="entry-date text-caption-01 fw-semibold cl-text-3">
                    {featured.date}
                  </p>
                  <h4 className="entry-title mb-0">
                    <Link
                      href={`/blog-single/${featured.id}`}
                      className="link-underline link"
                    >
                      {featured.title}
                    </Link>
                  </h4>
                </div>
              </article>
            </div>
            <div className="col-lg-6">
              {rest.map((post) => (
                <article
                  key={post.id}
                  className="article-blog style-list list-v2 hover-img wow fadeInLeft"
                >
                  <Link
                    href={`/blog-single/${post.id}`}
                    className="blog-image img-style"
                  >
                    <Image
                      loading="lazy"
                      width={300}
                      height={200}
                      src={post.img}
                      alt={post.alt || post.title}
                    />
                    {post.tag != null && (
                      <div className="wrap-tags d-flex gap-12">
                        <span className="tag text-caption-01 ">{post.tag}</span>
                      </div>
                    )}
                  </Link>
                  <div className="blog-content">
                    <p className="entry-date text-caption-01 fw-semibold cl-text-3">
                      {post.date}
                    </p>
                    <h5 className="entry-title">
                      <Link
                        href={`/blog-single/${post.id}`}
                        className="link-underline link text-line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h5>
                    <p className="entry-desc cl-text-2 text-line-clamp-2 ">
                      {post.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Blogs;
