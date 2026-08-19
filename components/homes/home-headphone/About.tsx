import Link from "next/link";
function About() {
  return (
    <>
      <div className="section-about flat-spacing-6">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <p className="h6 text-primary fw-semibold mb-16">TRUE SOUND</p>
              <p className="h3 fw-medium mb-40 text-capitalize ">
                &ldquo;There&apos;s nothing like experiencing Perfect Immersion.
                Amerce designs audio for a smarter world, offering clarity and
                connection that feels entirely authentic.&rdquo;
              </p>
              <Link href={`/about`} className="tf-btn animate-btn mx-auto">
                Read About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
