import Image from "next/image";

import { teamMembers } from "@/data/teams";
import TfSwiper from "@/components/ui/TfSwiper";

function Member() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center">
          <h3 className="s-title">Meet Our Teams</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Experts committed to excellence in every detail.
          </p>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={10}
          paginationLg={4}
          paginationMd={3}
          paginationSm={2}
          pagination={1}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {teamMembers.map((member, index) => (
            <div key={index} className="card-member-v01 hover-img">
              <div className="member-image">
                <div className="image img-style">
                  <Image
                    loading="lazy"
                    width={330}
                    height={440}
                    src={member.img}
                    alt={member.name}
                  />
                </div>
                <div className="social-wrap">
                  <ul className="tf-social-icon-2 style-2 d-grid">
                    {member.socials.facebook && (
                      <li>
                        <a href={member.socials.facebook}>
                          <i className="icon icon-FacebookLogo" />
                        </a>
                      </li>
                    )}
                    {member.socials.x && (
                      <li>
                        <a href={member.socials.x}>
                          <i className="icon icon-XLogo" />
                        </a>
                      </li>
                    )}
                    {member.socials.instagram && (
                      <li>
                        <a href={member.socials.instagram}>
                          <i className="icon icon-InstagramLogo" />
                        </a>
                      </li>
                    )}
                    {member.socials.tiktok && (
                      <li>
                        <a href={member.socials.tiktok}>
                          <i className="icon icon-TiktokLogo" />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="member-info">
                <a href="#" className="name h5 fw-medium link-underline link">
                  {member.name}
                </a>
                <p className="duty cl-text-2">{member.duty}</p>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Member;
