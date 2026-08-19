import Link from "next/link";
import Image from "next/image";

import { blogHeadphonePosts } from "@/data/blogs";

function Blogs() {
  const [lead, ...side] = blogHeadphonePosts;

  return (
    <>
      <section className="flat-spacing section-insights">
        <div className="container">
          <div className="sect-heading type-2 text-center wow fadeInUp">
            <h3 className="s-title">Sound Insights &amp; Stories</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Latest tech, reviews, and how-to guides. Dive in.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-5 col-xl-6">
              <article className="article-blog style-2 hover-img wow fadeInLeft h-100">
                <Link
                  href={`/blog-single/${lead.id}`}
                  className="blog-image img-style"
                >
                  <Image
                    loading="lazy"
                    width={690}
                    height={521}
                    src={lead.img}
                    alt={lead.alt || lead.title}
                  />
                </Link>
                <div className="blog-content">
                  <p className="entry-date text-caption-01 fw-semibold text-white">
                    {lead.date}
                  </p>
                  <h4 className="entry-title">
                    <Link
                      href={`/blog-single/${lead.id}`}
                      className="link-underline link text-white"
                    >
                      {lead.title}
                    </Link>
                  </h4>
                  <p className="entry-desc text-white">{lead.desc}</p>
                </div>
              </article>
            </div>
            <div className="col-lg-7 col-xl-6">
              {side.map((post) => (
                <article
                  key={post.id}
                  className="article-blog style-list list-v2 hover-img wow fadeInLeft"
                >
                  <Link
                    href={`/blog-single/${post.id}`}
                    className="blog-image img-style w-100"
                  >
                    <Image
                      className="img-cover"
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
                    <h4 className="entry-title">
                      <Link
                        href={`/blog-single/${post.id}`}
                        className="link-underline link text-line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <p className="entry-desc cl-text-2">{post.desc}</p>
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
