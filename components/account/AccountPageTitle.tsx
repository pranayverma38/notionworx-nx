import PageTitleHeader from "@/components/ui/PageTitleHeader";

type AccountPageTitleProps = {
  /** Breadcrumb + heading (default: My Account) */
  heading?: string;
  /** Optional subtitle; default matches former account pages */
  description?: string;
};

export default function AccountPageTitle({
  heading = "My Account",
  description = "Manage your profile, track orders, and easily update your personal details anytime,",
}: AccountPageTitleProps) {
  return (
    <PageTitleHeader
      breadcrumbLabel={heading}
      title={heading}
      description={
        <>
          {description}
          {" "}
          all in one convenient place.
        </>
      }
    />
  );
}
