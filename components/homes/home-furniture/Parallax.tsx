import Image from "next/image";
function Parallax() {
  return (
    <>
      <div className="section-parallax">
        <div className="container-full">
          <div
            className="banner-image-parallax parallaxie"
            style={{
              backgroundImage:
                'url("/assets/images/slider/furniture/slider-1.jpg")',
            }}
          >
            <div className="bn-image">
              <Image
                className="opacity-lg-0"
                loading="lazy"
                width={1770}
                height={560}
                src="/assets/images/slider/furniture/slider-1.jpg"
                alt="Image"
              />
            </div>
          </div>
        </div>
        <div className="wg-circular-text">
          <p className="original-text">AMERCE - AMERCE - AMERCE - AMERCE -</p>
          <div className="circular-text" id="circularText" />
        </div>
      </div>
    </>
  );
}

export default Parallax;
