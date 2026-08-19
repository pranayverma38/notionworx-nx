import BannerImageCompareSlider from "@/components/ui/BannerImageCompareSlider";
import { bannerCompareImages } from "@/data/bannerCompare";

function BannerImageViewCompare() {
  return (
    <div className="banner-image-compare">
      <BannerImageCompareSlider
        beforeSrc={bannerCompareImages.beforeSrc}
        afterSrc={bannerCompareImages.afterSrc}
      />
    </div>
  );
}

export default BannerImageViewCompare;
