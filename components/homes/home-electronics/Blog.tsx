import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { blogElectronicsPosts } from "@/data/blogs";

function Blog() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Insights For A Better You</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Explore mindful habits, wellness routines, and everyday calm.
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
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {blogElectronicsPosts.map((post, index) => (
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
                  width={450}
                  height={560}
                  loading="lazy"
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
              </div>
            </article>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Blog;
