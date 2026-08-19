import Link from "next/link";
import Image from "next/image";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import type { BlogPost } from "@/types/blog";

export default function BlogSingle({
  post,
  prevPost,
  nextPost,
}: {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}) {
  return (
    <>
      <section className="section-blog-single">
        <div className="main-blog-single">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="blog-image">
                  <Image
                    loading="lazy"
                    width={1410}
                    style={{
                      maxHeight: "600px",
                      objectFit: "cover",
                    }}
                    height={600}
                    src={post.img}
                    alt={post.alt || post.title}
                  />
                </div>
              </div>
              <div className="col-lg-8 mx-auto">
                <div className="blog-content">
                  <div className="blog-heading">
                    <div className="entry-tag fw-medium">Fashion Trends</div>
                    <h3 className="entry-title">{post.title}</h3>
                    <div className="entry-meta">
                      <div className="meta-item meta-date">
                        <i className="icon icon-CalendarBlank" />
                        <span className="text-body-1">January 20, 2026</span>
                      </div>
                      <div className="br-line type-vertical" />
                      <div className="meta-item meta-author">
                        <i className="icon icon-User" />
                        <span className="text-body-1">by Themesflat</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-12">
                    <p className="text text-body-1 s1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Morbi sed mauris eu imperdiet. Donec congue orci nec mi
                      luctus, ut faucibus mauris scelerisque. Donec orci lorem,
                      volutpat a mauris nec, sodales imperdiet urna. Sed dictum
                      enim libero. Interdum et malesuada fames ac ante ipsum
                      primis in faucibus. Maecenas ligula libero, pharetra non
                      dolor et, tempor bibendum magna. Mauris a efficitur nisi.
                    </p>
                    <p className="text text-body-1 s2">
                      Praesent interdum lacus ac est viverra hendrerit. Aliquam
                      dapibus, ante vitae mattis gravida, purus sapien interdum
                      magna, convallis volutpat est turpis pulvinar dui. Aenean
                      eu turpis est. In hac habitasse platea dictumst. Integer
                      at lobortis metus. Proin molestie eget massa vel gravida.
                      Suspendisse nec ante vel
                    </p>
                  </div>
                  <div className="tf-grid-layout sm-col-2 gap-30">
                    <div className="blog-image-2">
                      <Image
                        loading="lazy"
                        width={450}
                        height={320}
                        src="/assets/images/blog/detail-2.jpg"
                        alt="Image"
                      />
                    </div>
                    <div className="blog-image-2">
                      <Image
                        loading="lazy"
                        width={450}
                        height={320}
                        src="/assets/images/blog/detail-3.jpg"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div className="d-grid gap-16">
                    <h4 className="mini-title text-capitalize">
                      How to deal with employee quitting
                    </h4>
                    <p className="text text-body-1">
                      Donec eu dui condimentum, laoreet nulla vitae, venenatis
                      ipsum. Donec luctus sem sit amet varius laoreet. Aliquam
                      fermentum sit amet urna fringilla tincidunt. Vestibulum
                      ullamcorper nec lacus ac molestie. Curabitur congue neque
                      sed nisi auctor consequat. Pellentesque rhoncus tortor
                      vitae ipsum sagittis tempor.
                    </p>
                    <p className="text text-body-1">
                      Vestibulum et pharetra arcu. In porta lobortis turpis. Ut
                      faucibus posuere. Suspendisse potenti. Mauris a metus sed
                      est semper vestibulum. Mauris tortor sem, consectetur
                      vehicula vulputate id, suscipit vel leo.
                    </p>
                    <ul className="tf-list vertical gap-12">
                      <li className="text-body-1">
                        15+ years of industry experience designing, building,
                        and supporting large-scale distributed systems in
                        production, with recent experience in building large
                        scale cloud services.
                      </li>
                      <li className="text-body-1">
                        Deep knowledge and experience with different security
                        areas like identity and access management, cryptography,
                        network security, etc.
                      </li>
                      <li className="text-body-1">
                        Experience with database systems and database internals,
                        such as query engines and optimizers are a big plus.
                      </li>
                      <li className="text-body-1">
                        Strong fundamentals in computer science skills.
                      </li>
                      <li className="text-body-1">
                        Expert-level development skills in Java or C++.
                      </li>
                      <li className="text-body-1">
                        Knowledge of industry standard security concepts and
                        protocols like SAML, SCIM, OAuth, RBAC, cryptography is
                        a plus.
                      </li>
                      <li className="text-body-1">
                        Advanced degree in Computer Science or related degree.
                      </li>
                      <li className="text-body-1">
                        Ph.D. in the related field is a plus.
                      </li>
                    </ul>
                    <p className="text text-body-1">
                      Vivamus at aliquam tellus. Vestibulum a augue ac purus
                      suscipit varius non eget lectus. Nam lobortis mauris
                      luctus tristique feugiat. Nulla eleifend risus sit amet
                      nisi feugiat, id eleifend sapien. Phasellus venenatis
                      convallis mattis. Duis vel tempor eros. Mauris semper
                      sollicitudin neque, imperdiet ultrices urna maximus id.
                    </p>
                  </div>
                  <div className="box-social-tag">
                    <div className="tags-right  d-flex align-items-center flex-wrap gap-8">
                      <p>Tags:</p>
                      <Link href={`/blog`} className="tag-item text-caption-01">
                        fashion
                      </Link>
                      <Link href={`/blog`} className="tag-item text-caption-01">
                        style
                      </Link>
                    </div>
                    <div className="social-left">
                      <p>Share this post: </p>
                      <ul className="tf-social-icon-2">
                        <li>
                          <a href="https://www.facebook.com/">
                            <i className="icon icon-FacebookLogo" />
                          </a>
                        </li>
                        <li>
                          <a href="https://x.com/">
                            <i className="icon icon-XLogo" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.instagram.com/">
                            <i className="icon icon-InstagramLogo" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.tiktok.com/">
                            <i className="icon icon-TiktokLogo" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.snapchat.com/">
                            <i className="icon icon-SnapchatLogo" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="group-direc">
                    {prevPost ? (
                      <Link
                        href={`/blog-single/${prevPost.id}`}
                        className="btn-direc prev link"
                      >
                        <p className="fw-semibold text-decoration-underline">
                          Previous
                        </p>
                        <p className="name-post h6 fw-medium">
                          {prevPost.title}
                        </p>
                      </Link>
                    ) : (
                      <div className="btn-direc prev cl-text-3">
                        <p className="fw-semibold">Previous</p>
                        <p className="name-post h6 fw-medium mb-0">—</p>
                      </div>
                    )}
                    <span className="br-line type-vertical" />
                    {nextPost ? (
                      <Link
                        href={`/blog-single/${nextPost.id}`}
                        className="btn-direc next link"
                      >
                        <p className="fw-semibold text-decoration-underline">
                          Next
                        </p>
                        <p className="name-post h6 fw-medium">
                          {nextPost.title}
                        </p>
                      </Link>
                    ) : (
                      <div className="btn-direc next cl-text-3">
                        <p className="fw-semibold">Next</p>
                        <p className="name-post h6 fw-medium mb-0">—</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="wg-comment">
                  <h4 className="title">03 Comments</h4>
                  <h5 className="d-none">Perfect Heading SEO</h5>
                  <div className="comment-list">
                    <div className="box-comment">
                      <div className="comment_info">
                        <div className="info_image">
                          <Image
                            loading="lazy"
                            width={60}
                            height={60}
                            src="/assets/images/avatar/avatar-2.jpg"
                            alt="Image"
                          />
                        </div>
                        <div className="info_author">
                          <h6 className="author__name">Guy Hawkins</h6>
                          <p className="author_date text-caption-01 cl-text-3">
                            August 13, 2024
                          </p>
                        </div>
                      </div>
                      <p className="comment_text text-body-1">
                        I absolutely loved this article! The styling tips were
                        super practical, and I finally understand how to mix
                        streetwear pieces without overdoing it.
                      </p>
                      <div className="comment_reply">
                        <div className="comment_info">
                          <div className="info_image">
                            <Image
                              loading="lazy"
                              width={60}
                              height={60}
                              src="/assets/images/avatar/avatar-1.jpg"
                              alt="Image"
                            />
                          </div>
                          <div className="info_author">
                            <h6 className="author__name">Reply From Amerce</h6>
                            <p className="author_date text-caption-01 cl-text-3">
                              1 days ago
                            </p>
                          </div>
                        </div>
                        <p className="comment_text text-body-1">
                          Thank you so much! We’re glad you found it helpful —
                          streetwear is all about confidence and balance. Stay
                          tuned for next week’s trend guide!
                        </p>
                      </div>
                    </div>
                    <div className="box-comment">
                      <div className="comment_info">
                        <div className="info_image">
                          <Image
                            loading="lazy"
                            width={60}
                            height={60}
                            src="/assets/images/avatar/avatar-3.jpg"
                            alt="Image"
                          />
                        </div>
                        <div className="info_author">
                          <h6 className="author__name">Eleanor Pena</h6>
                          <p className="author_date text-caption-01 cl-text-3">
                            3 days ago
                          </p>
                        </div>
                      </div>
                      <p className="comment_text text-body-1">
                        Great read! I’ve been looking for new outfit ideas, and
                        this gave me tons of inspiration for my next shopping
                        trip.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="wg-leave-comment">
                  <h4 className="title">Leave A Comment</h4>
                  <PreventDefaultForm className="form-leave-comment">
                    <div className="form-content">
                      <div className="tf-grid-layout sm-col-2">
                        <fieldset className="tf-field">
                          <label htmlFor="name" className="tf-lable fw-medium">
                            Your Name <span className="text-primary">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            required
                          />
                        </fieldset>
                        <fieldset className="tf-field">
                          <label htmlFor="email" className="tf-lable fw-medium">
                            Your Email <span className="text-primary">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            placeholder="Your email (private)"
                            required
                          />
                        </fieldset>
                      </div>
                      <fieldset className="tf-field">
                        <label htmlFor="comment" className="tf-lable fw-medium">
                          Your Message <span className="text-primary">*</span>
                        </label>
                        <textarea
                          id="comment"
                          placeholder="Write your comment"
                          required
                          defaultValue={""}
                        />
                      </fieldset>
                      <div className="checkbox-wrap">
                        <input className="tf-check" type="checkbox" id="save" />
                        <label htmlFor="save" className="cl-text-2">
                          Save my name, email, and website in this browser for
                          the next time I comment.
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="tf-btn animate-btn">
                      <span className="btn-text">Post Comment</span>
                    </button>
                  </PreventDefaultForm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
