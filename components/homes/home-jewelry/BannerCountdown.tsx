import CountdownTimer from "@/components/common/Countdown";

function BannerCountdown() {
  return (
    <>
      <div className="flat-spacing">
        <div className="banner-countdown-v01 style-2 bg-dark ">
          <div className="container-full">
            <div className="content">
              <div className="col-left">
                <h2 className="text-white mb-8">Hurry! Deals On</h2>
                <p className="text-white">
                  Up to 50% Off Selected Styles. Don&apos;t Miss Out.
                </p>
              </div>
              <div className="countdown-v01 text-white">
                <div className="js-countdown cd-has-zero cd-custom">
                  <CountdownTimer style={7} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerCountdown;
