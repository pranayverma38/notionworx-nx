import { AccountSection } from "@/components/account/AccountSection";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

export default function AccountAddresses() {
  return (
    <AccountSection title="My Address">
      <div className="account-my_address">
        <PreventDefaultForm className="form-account-address">
          <div className="form-content">
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="first-name" className="tf-lable fw-medium">
                  First Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="first-name"
                  placeholder="First Name"
                  required
                />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="last-name" className="tf-lable fw-medium">
                  Last Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="last-name"
                  placeholder="Last Name"
                  required
                />
              </fieldset>
            </div>
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="company" className="tf-lable fw-medium">
                  Company name (optional)
                </label>
                <select name="company" id="company">
                  <option value={1}>Option</option>
                  <option value={2}>Themesflat</option>
                </select>
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="country" className="tf-lable fw-medium">
                  Country / Region <span className="text-primary">*</span>
                </label>
                <select name="country" id="country" required>
                  <option value="">Country / Region</option>
                  <option value={2}>Viet Nam</option>
                  <option value={3}>Korean</option>
                  <option value={4}>Japan</option>
                </select>
              </fieldset>
            </div>
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="street" className="tf-lable fw-medium">
                  Street Address <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="street"
                  placeholder="Street Address"
                  required
                />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="town" className="tf-lable fw-medium">
                  Town / City <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="town"
                  placeholder="Town / City"
                  required
                />
              </fieldset>
            </div>
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="state" className="tf-lable fw-medium">
                  State <span className="text-primary">*</span>
                </label>
                <input type="text" id="state" placeholder="State" required />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="zip" className="tf-lable fw-medium">
                  ZIP <span className="text-primary">*</span>
                </label>
                <input type="text" id="zip" placeholder="ZIP" required />
              </fieldset>
            </div>
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="phone" className="tf-lable fw-medium">
                  Phone <span className="text-primary">*</span>
                </label>
                <input type="number" id="phone" placeholder="Phone" required />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="email" className="tf-lable fw-medium">
                  Email <span className="text-primary">*</span>
                </label>
                <input type="email" id="email" placeholder="Email" required />
              </fieldset>
            </div>
          </div>
          <button
            type="submit"
            className="btn-action-submit tf-btn animate-btn"
          >
            Update Address
          </button>
        </PreventDefaultForm>
      </div>
    </AccountSection>
  );
}
