"use client";

import { useEffect, useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Tables } from "@/types/supabase";

type Address = Tables<"addresses">;

const COUNTRIES = [
  "United States", "United Kingdom", "India", "Australia", "Canada",
  "Germany", "France", "Japan", "Singapore", "UAE", "Other",
];

type FormState = {
  company: string; country: string; street_address: string;
  city: string; state: string; zip: string; phone: string; email: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): Errors {
  const e: Errors = {};
  if (!form.country) e.country = "Please select a country.";
  if (!form.street_address.trim()) e.street_address = "Street address is required.";
  else if (form.street_address.trim().length < 5) e.street_address = "Enter a valid street address.";
  if (!form.city.trim()) e.city = "City is required.";
  else if (form.city.trim().length < 2) e.city = "Enter a valid city name.";
  if (!form.state.trim()) e.state = "State is required.";
  if (!form.zip.trim()) e.zip = "ZIP code is required.";
  else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(form.zip.trim())) e.zip = "Enter a valid ZIP / postal code.";
  if (!form.phone.trim()) e.phone = "Phone number is required.";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
  if (!form.email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
  return e;
}

const EMPTY: FormState = { company: "", country: "", street_address: "", city: "", state: "", zip: "", phone: "", email: "" };

export default function AccountAddresses() {
  const { user } = useAuth();
  const supabase = createClient();
  const [address, setAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("addresses").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: true }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAddress(data);
          setForm({
            company: data.company ?? "", country: data.country,
            street_address: data.street_address, city: data.city,
            state: data.state, zip: data.zip,
            phone: data.phone, email: data.email,
          });
        } else {
          setForm(f => ({ ...f, email: user.email ?? "" }));
        }
      });
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name as keyof FormState]) {
      const next = { ...form, [name]: value };
      setErrors(validateForm(next));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validateForm(form));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ company: true, country: true, street_address: true, city: true, state: true, zip: true, phone: true, email: true });
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!user) return;
    setSaving(true); setMsg("");
    const payload = { ...form, user_id: user.id, is_default: true };
    const { error } = address
      ? await supabase.from("addresses").update(payload).eq("id", address.id)
      : await supabase.from("addresses").insert(payload);

    if (error) { setMsg(`Error: ${error.message}`); }
    else {
      setMsg("Address saved successfully!");
      const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).maybeSingle();
      if (data) setAddress(data);
    }
    setSaving(false);
  }

  function field(name: keyof FormState) {
    return {
      name, value: form[name],
      onChange: handleChange, onBlur: handleBlur,
      className: errors[name] && touched[name] ? "is-invalid" : "",
    };
  }

  return (
    <AccountSection title="My Address">
      <div className="account-my_address">
        <form className="form-account-address" onSubmit={handleSubmit} noValidate>
          <div className="form-content">
            {msg && <div className={`alert mb-3 ${msg.startsWith("Error") ? "alert-danger" : "alert-success"}`}>{msg}</div>}

            <fieldset className="tf-field">
              <label htmlFor="addr-company" className="tf-lable fw-medium">Company name (optional)</label>
              <input type="text" id="addr-company" placeholder="Company name" {...field("company")} />
            </fieldset>

            <fieldset className="tf-field">
              <label htmlFor="addr-country" className="tf-lable fw-medium">Country / Region <span className="text-primary">*</span></label>
              <select id="addr-country" {...field("country")} required>
                <option value="">Select a country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && touched.country && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.country}</div>}
            </fieldset>

            <fieldset className="tf-field">
              <label htmlFor="addr-street" className="tf-lable fw-medium">Street Address <span className="text-primary">*</span></label>
              <input type="text" id="addr-street" placeholder="House number and street name" {...field("street_address")} required />
              {errors.street_address && touched.street_address && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.street_address}</div>}
            </fieldset>

            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="addr-city" className="tf-lable fw-medium">Town / City <span className="text-primary">*</span></label>
                <input type="text" id="addr-city" placeholder="Town / City" {...field("city")} required />
                {errors.city && touched.city && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.city}</div>}
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="addr-state" className="tf-lable fw-medium">State / Province <span className="text-primary">*</span></label>
                <input type="text" id="addr-state" placeholder="State" {...field("state")} required />
                {errors.state && touched.state && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.state}</div>}
              </fieldset>
            </div>

            <div className="tf-grid-layout sm-col-2">
              <fieldset className="tf-field">
                <label htmlFor="addr-zip" className="tf-lable fw-medium">ZIP / Postal Code <span className="text-primary">*</span></label>
                <input type="text" id="addr-zip" placeholder="ZIP / Postal code" {...field("zip")} required />
                {errors.zip && touched.zip && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.zip}</div>}
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor="addr-phone" className="tf-lable fw-medium">Phone <span className="text-primary">*</span></label>
                <input type="tel" id="addr-phone" placeholder="+1 555 000 0000" {...field("phone")} required />
                {errors.phone && touched.phone && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.phone}</div>}
              </fieldset>
            </div>

            <fieldset className="tf-field">
              <label htmlFor="addr-email" className="tf-lable fw-medium">Email <span className="text-primary">*</span></label>
              <input type="email" id="addr-email" placeholder="you@example.com" {...field("email")} required />
              {errors.email && touched.email && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.email}</div>}
            </fieldset>
          </div>

          <button type="submit" className="btn-action-submit tf-btn animate-btn" disabled={saving}>
            {saving ? "Saving…" : address ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </AccountSection>
  );
}
