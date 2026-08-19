import Link from "next/link";
import Image from "next/image";

import { allBlogPosts } from "@/data/blogs";
import TfSwiper from "@/components/ui/TfSwiper";

export default function Related({ currentId }: { currentId: string }) {
  const related = allBlogPosts
    .filter((p) => p.id !== currentId)
    .slice(0, 3);

  return (
    <section className="section-related flat-spacing">
      <div className="container">
        <div className="sect-heading text-center">
          <h3 className="s-title">Related Posts</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Discover more stories and style tips to keep your fashion
            inspiration flowing.
          </p>
        </div>
        <h4 className="d-none">Perfect SEO</h4>
        <TfSwiper
          preview={3}
          tablet={2}
          mobileSm={1}
          mobile={1}
          spaceLg={30}
          spaceMd={15}
          space={15}
        >
          {related.map((post) => (
            <article key={post.id} className="article-blog hover-img">
              <Link
                href={`/blog-single/${post.id}`}
                className="blog-image img-style"
              >
                <Image
                  loading="lazy"
                  width={450}
                  height={307}
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
              </div>
            </article>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}
