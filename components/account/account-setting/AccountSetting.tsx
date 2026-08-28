"use client";

import { useEffect, useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { PasswordField } from "@/components/forms/PasswordField";
import { createClient, withTimeout } from "@/lib/supabase/client";
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
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  // Load profile on mount
  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (!data) return;
      setFirstName(data.first_name ?? "");
      setLastName(data.last_name ?? "");
      setPhoneCode(data.phone_country_code ?? "+1");
      setPhone(data.phone_number ?? "");
      setGender(data.gender ?? "");
      setDob(data.date_of_birth ?? "");
    });
  }, [user]);

  async function handleInfoSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setInfoMsg("");
    const { error } = await supabase.from("profiles").update({
      first_name: firstName, last_name: lastName,
      phone_country_code: phoneCode, phone_number: phone,
      gender: gender || null, date_of_birth: dob || null,
    }).eq("id", user.id);
    setInfoMsg(error ? `Error: ${error.message}` : "Profile updated successfully!");
    setSaving(false);
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    if (newPassword !== confirmNewPassword) { setPwMsg("New passwords do not match."); return; }
    if (newPassword.length < 6) { setPwMsg("Password must be at least 6 characters."); return; }
    setPwSaving(true);
    try {
      // Re-authenticate then update
      const { error: signInErr } = await withTimeout(
        supabase.auth.signInWithPassword({ email: user?.email ?? "", password: currentPassword })
      );
      if (signInErr) { setPwMsg("Current password is incorrect."); return; }
      const { error } = await withTimeout(supabase.auth.updateUser({ password: newPassword }));
      if (error) { setPwMsg(`Error: ${error.message}`); return; }
      setPwMsg("Password changed successfully!");
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    } catch { setPwMsg("Something went wrong. Please try again."); }
    finally { setPwSaving(false); }
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

        {/* ── Change Password ── */}
        <p className="mb-12 h6 fw-medium">Change Password</p>
        <form className="form-setting" onSubmit={handlePasswordSave}>
          <div className="form-content">
            {pwMsg && (
              <div className={`alert mb-3 ${pwMsg.startsWith("Error") || pwMsg.includes("incorrect") || pwMsg.includes("match") || pwMsg.includes("wrong") ? "alert-danger" : "alert-success"}`}>
                {pwMsg}
              </div>
            )}
            <fieldset className="tf-field password-wrapper">
              <label htmlFor="s-cur-pw" className="tf-lable fw-medium">Current Password <span className="text-primary">*</span></label>
              <PasswordField id="s-cur-pw" placeholder="Current password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </fieldset>
            <fieldset className="tf-field password-wrapper">
              <label htmlFor="s-new-pw" className="tf-lable fw-medium">New Password <span className="text-primary">*</span></label>
              <PasswordField id="s-new-pw" placeholder="New password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </fieldset>
            <fieldset className="tf-field password-wrapper">
              <label htmlFor="s-confirm-pw" className="tf-lable fw-medium">Confirm New Password <span className="text-primary">*</span></label>
              <PasswordField id="s-confirm-pw" placeholder="Confirm new password" required value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            </fieldset>
          </div>
          <div className="btn-submit">
            <button type="submit" className="tf-btn animate-btn" disabled={pwSaving}>{pwSaving ? "Updating…" : "Update Password"}</button>
          </div>
        </form>
      </div>
    </AccountSection>
  );
}
