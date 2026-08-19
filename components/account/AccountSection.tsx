import AccountSidebar from "./AccountSidebar";

type AccountSectionProps = {
  title: string;
  /** Extra section classes (e.g. orders tabs use `flat-animate-tab`) */
  sectionClassName?: string;
  children: React.ReactNode;
};

export function AccountSection({
  title,
  sectionClassName = "flat-spacing",
  children,
}: AccountSectionProps) {
  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3">
            <AccountSidebar />
          </div>
          <div className="col-lg-8 ms-auto">
            <div className="my-account-content">
              <h4 className="account-title">{title}</h4>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
