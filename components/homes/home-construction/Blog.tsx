import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { blogConstructionPosts } from "@/data/blogs";

function Blog() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Insights For Happier Pets</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Discover caring tips and daily inspiration for your furry friends.
          </p>
        </div>
        <TfSwiper
          preview={3}
          tablet={2}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={2}
          paginationLg={3}
          paginationClassName="sw-line-default tf-sw-pagination"
        >
          {blogConstructionPosts.map((post, index) => (
            <article
              key={post.id}
              className="article-blog hover-img wow fadeInUp"
              data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
            >
              <Link
                href={`/blog-single/${post.id}`}
                className="blog-image img-style"
              >
                <Image
                  src={`${post.img}`}
                  alt={post.alt ?? "Image"}
                  width={900}
                  height={675}
                  loading="lazy"
                />
                {post.tag != null && (
                  <div className="wrap-tags d-flex gap-12">
                    <span className="tag text-caption-01">{post.tag}</span>
                  </div>
                )}
              </Link>
              <div className="blog-content">
                <p className="entry-date text-caption-01 fw-semibold cl-text-3">
                  {post.date}
                </p>
                <h4 className="entry-title">
                  <Link
                    href={`/blog-single/${post.id}`}
                    className="link-underline link text-capitalize"
                  >
                    {post.title}
                  </Link>
                </h4>
                <p className="entry-desc cl-text-2">{post.desc}</p>
              </div>
            </article>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Blog;
