import Link from "next/link";
import Image from "next/image";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { allBlogPosts } from "@/data/blogs";
import BlogListingClient from "@/components/blogs/blog/BlogListingClient";

function Blog() {
  const recentSidebar = allBlogPosts.slice(0, 4);

  return (
    <>
      <section className="section-blog flat-spacing">
        <h3 className="d-none">Perfect Heading SEO</h3>
        <h4 className="d-none">Perfect Heading SEO</h4>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <BlogListingClient />
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <div className="blog-sidebar sidebar-content-wrap sticky-top">
                <div className="sidebar-item">
                  <div className="sb-search">
                    <PreventDefaultForm className="form-search-blog ">
                      <fieldset>
                        <input
                          className="style-stroke-bottom"
                          type="text"
                          placeholder="Search..."
                          required
                        />
                      </fieldset>
                      <button type="submit" className="btn-action link">
                        <i className="icon icon-MagnifyingGlass" />
                      </button>
                    </PreventDefaultForm>
                  </div>
                </div>
                <div className="sidebar-item">
                  <h5 className="sb-title">Categories</h5>
                  <ul className="sb-category">
                    <li>
                      <Link href={`/blog`}>
                        Style Inspiration
                        <span className="count">(112)</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`}>
                        Fashion Tips
                        <span className="count">(32)</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`}>
                        Trends &amp; News
                        <span className="count">(42)</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`}>
                        Outfit Guides
                        <span className="count">(65)</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`}>
                        Sustainable Living
                        <span className="count">(13)</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="sidebar-item">
                  <h5 className="sb-title">Recent Posts</h5>
                  <ul className="sb-recent">
                    {recentSidebar.map((post) => (
                      <li key={post.id} className="recent-item">
                        <Link
                          href={`/blog-single/${post.id}`}
                          className="image"
                        >
                          <Image
                            loading="lazy"
                            width={90}
                            height={90}
                            src={post.img}
                            alt={post.alt || post.title}
                          />
                        </Link>
                        <div className="meta">
                          <p className="meta-date text-caption-01 cl-text-2">
                            {post.date}
                          </p>
                          <Link
                            href={`/blog-single/${post.id}`}
                            className="meta-name link-underline link fw-medium"
                          >
                            {post.title}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sidebar-item">
                  <h5 className="sb-title">Popular Tag</h5>
                  <ul className="sb-tag">
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        fashion
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        style
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        outfit
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        trend
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        elegance
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        minimal
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        luxury
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        casual
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        accessories
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        sustainable
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="text-caption-01">
                        wardrobe
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Blog;
