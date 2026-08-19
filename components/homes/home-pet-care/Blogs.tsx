import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { blogPetCarePosts } from "@/data/blogs";

function Blogs() {
  return (
    <section className="flat-spacing pb-0">
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
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {blogPetCarePosts.map((post) => (
            <article
              key={post.id}
              className="article-blog hover-img wow fadeInUp"
            >
              <Link
                href={`/blog-single/${post.id}`}
                className="blog-image img-style"
              >
                <Image
                  src={`${post.img}`}
                  alt={post.alt ?? "Image"}
                  width={450}
                  height={337}
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
                    className="link-underline link text-capitalize"
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

export default Blogs;
