import Image from "next/image";

import { AccountSection } from "@/components/account/AccountSection";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { PasswordField } from "@/components/forms/PasswordField";

export default function AccountSetting() {
  return (
    <AccountSection title="Setting">
      <div className="account-my_address setting">
        <p className="mb-12 h6 fw-medium">Information</p>
        <p className="mb-12">
          Upload Avatar <span className="text-primary">*</span>
        </p>
        <div className="account-avatar mb-20">
          <div className="avatar-image">
            <Image
              className="avatarPreview"
              loading="lazy"
              width={120}
              height={120}
              src="/assets/images/avatar/avatar-1.jpg"
              alt=""
            />
          </div>
          <div className="avatar-upload">
            <p className="fw-semibold mb-4">Upload File</p>
            <p className="text-caption-01 cl-text-2 mb-12">JPG 80x90px</p>
            <div className="upload-wrapper">
              <label className="upload-btn text-label">
                Choose File
                <input type="file" id="fileInput" accept="image/*" hidden />
              </label>
              <span id="fileName" className="text-caption-02 cl-text-3">
                No file chosen
              </span>
            </div>
          </div>
        </div>
        <PreventDefaultForm className="form-setting">
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
                <label htmlFor="phone-number" className="tf-lable fw-medium">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  type="number"
                  id="phone-number"
                  placeholder="First Name"
                  required
                />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="email" className="tf-lable fw-medium">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Last Name"
                  required
                />
              </fieldset>
            </div>
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="gender" className="tf-lable fw-medium">
                  Gender
                </label>
                <select name="gender" id="gender" required>
                  <option value="">Gender</option>
                  <option value={2}>Male</option>
                  <option value={3}>Female</option>
                </select>
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="dofb" className="tf-lable fw-medium">
                  Day of Birth
                </label>
                <input type="date" id="dofb" required />
              </fieldset>
            </div>
          </div>
          <div>
            <p className="mb-12 h6 fw-medium">Change Password</p>
            <div className="form-content">
              <fieldset className="tf-field password-wrapper">
                <label
                  htmlFor="current-password"
                  className="tf-lable fw-medium"
                >
                  Current password <span className="text-primary">*</span>
                </label>
                <PasswordField
                  id="current-password"
                  placeholder="Current password"
                  required
                />
              </fieldset>
              <fieldset className="tf-field password-wrapper">
                <label htmlFor="new-password" className="tf-lable fw-medium">
                  New password <span className="text-primary">*</span>
                </label>
                <PasswordField
                  id="new-password"
                  placeholder="New password"
                  required
                />
              </fieldset>
              <fieldset className="tf-field password-wrapper">
                <label
                  htmlFor="confirm-password"
                  className="tf-lable fw-medium"
                >
                  Confirm new password: <span className="text-primary">*</span>
                </label>
                <PasswordField
                  id="confirm-password"
                  placeholder="Confirm new password"
                  required
                />
              </fieldset>
            </div>
          </div>
          <div className="btn-submit">
            <button type="submit" className="tf-btn animate-btn">
              Save Change
            </button>
          </div>
        </PreventDefaultForm>
      </div>
    </AccountSection>
  );
}
