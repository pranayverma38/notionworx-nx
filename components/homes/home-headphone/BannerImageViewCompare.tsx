import BannerImageCompareSlider from "@/components/ui/BannerImageCompareSlider";
import { headphoneCompareImages } from "@/data/bannerCompareHeadphone";

function BannerImageViewCompare() {
  return (
    <div className="container-full">
      <div className="banner-image-compare style-2">
        <BannerImageCompareSlider
          id="image-compare-headphone"
          beforeSrc={headphoneCompareImages.beforeSrc}
          afterSrc={headphoneCompareImages.afterSrc}
        />
        <div className="wrap-content d-flex justify-content-between">
          <div className="content text-start">
            <h3 className="text-white mb-10">For The Warm Souls</h3>
            <p className="text-white">Soft, natural, easy on the eyes.</p>
          </div>
          <div className="content text-end">
            <h3 className="text-white mb-10">For The Bold Minds</h3>
            <p className="text-white">
              A crisp color that stands out effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerImageViewCompare;
