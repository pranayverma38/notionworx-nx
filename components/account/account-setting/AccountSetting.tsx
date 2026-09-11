"use client";

import { useEffect, useState } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { useAuth } from "@/context/AuthContext";

const COUNTRY_CODES = [
  { code: "+1", label: "🇺🇸 +1" }, { code: "+44", label: "🇬🇧 +44" },
  { code: "+91", label: "🇮🇳 +91" }, { code: "+61", label: "🇦🇺 +61" },
  { code: "+81", label: "🇯🇵 +81" }, { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" }, { code: "+86", label: "🇨🇳 +86" },
  { code: "+971", label: "🇦🇪 +971" }, { code: "+65", label: "🇸🇬 +65" },
];

export default function AccountSetting() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    async function loadProfile() {
      const response = await fetch("/api/account/profile", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        customer?: {
          firstName: string;
          lastName: string;
          phoneCode: string;
          phone: string;
          gender: string;
          dateOfBirth: string;
          email: string;
          companyName: string;
        };
      };

      const customer = payload.customer;
      if (!response.ok || !customer || isCancelled) {
        return;
      }

      setFirstName(customer.firstName ?? "");
      setLastName(customer.lastName ?? "");
      setPhoneCode(customer.phoneCode ?? "+1");
      setPhone(customer.phone ?? "");
      setGender(customer.gender ?? "");
      setDob(customer.dateOfBirth ?? "");
      setEmail(customer.email ?? "");
    }

    setEmail(user.email ?? "");
    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  async function handleInfoSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setInfoMsg("");

    try {
      const response = await fetch("/api/account/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          phoneCode,
          phone,
          companyName: "",
          gender,
          dateOfBirth: dob,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
      };

      setInfoMsg(
        response.ok
          ? "Profile updated successfully!"
          : `Error: ${payload.error ?? "Unable to update your profile."}`,
      );
    } catch (requestError) {
      setInfoMsg(
        `Error: ${
          requestError instanceof Error
            ? requestError.message
            : "Unable to update your profile."
        }`,
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    setPwSaving(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email ?? "",
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setPwMsg(`Error: ${payload.error ?? "Unable to start the password reset flow."}`);
        return;
      }

      setPwMsg(
        payload.message ??
          "Password reset instructions will be handled by the Medusa backend.",
      );
    } catch {
      setPwMsg("Something went wrong. Please try again.");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <AccountSection title="Setting">
      <div className="account-my_address setting">
        {/* ── Personal Information ── */}
        <p className="mb-12 h6 fw-medium">Information</p>
        <form className="form-setting" onSubmit={handleInfoSave}>
          <div className="form-content">
            {infoMsg && (
              <div className={`alert mb-3 ${infoMsg.startsWith("Error") ? "alert-danger" : "alert-success"}`}>
                {infoMsg}
              </div>
            )}
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="s-first-name" className="tf-lable fw-medium">First Name <span className="text-primary">*</span></label>
                <input type="text" id="s-first-name" placeholder="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="s-last-name" className="tf-lable fw-medium">Last Name <span className="text-primary">*</span></label>
                <input type="text" id="s-last-name" placeholder="Last Name" required value={lastName} onChange={e => setLastName(e.target.value)} />
              </fieldset>
            </div>
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label className="tf-lable fw-medium">Phone Number</label>
                <div className="d-flex gap-2">
                  <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)} style={{ width: "120px", flexShrink: 0 }}>
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <input type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1 }} />
                </div>
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="s-email" className="tf-lable fw-medium">Email Address</label>
                <input type="email" id="s-email" value={email} readOnly style={{ background: "#f5f5f5", cursor: "not-allowed" }} />
              </fieldset>
            </div>
            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="s-gender" className="tf-lable fw-medium">Gender</label>
                <select id="s-gender" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="s-dob" className="tf-lable fw-medium">Date of Birth</label>
                <input type="date" id="s-dob" value={dob} onChange={e => setDob(e.target.value)} />
              </fieldset>
            </div>
          </div>
          <div className="btn-submit mb-32">
            <button type="submit" className="tf-btn animate-btn" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </form>

        {/* ── Password Reset ── */}
        <p className="mb-12 h6 fw-medium">Password Reset</p>
        <form className="form-setting" onSubmit={handlePasswordSave}>
          <div className="form-content">
            {pwMsg && (
              <div className={`alert mb-3 ${pwMsg.startsWith("Error") ? "alert-danger" : "alert-success"}`}>
                {pwMsg}
              </div>
            )}
            <p className="cl-text-2">
              Medusa’s customer API uses a reset-password flow rather than an authenticated
              change-password endpoint. Send a reset email to your account address to update
              your password securely.
            </p>
          </div>
          <div className="btn-submit">
            <button type="submit" className="tf-btn animate-btn" disabled={pwSaving}>
              {pwSaving ? "Sending…" : "Send Reset Instructions"}
            </button>
          </div>
        </form>
      </div>
    </AccountSection>
  );
}
