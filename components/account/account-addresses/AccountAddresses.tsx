"use client";

import { useEffect, useState } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { useAuth } from "@/context/AuthContext";
import { ACCOUNT_COUNTRIES } from "@/lib/medusa/countries";
import type { AccountAddress } from "@/types/medusa";

type FormState = {
  company: string;
  countryCode: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): Errors {
  const e: Errors = {};
  if (!form.countryCode) e.countryCode = "Please select a country.";
  if (!form.address1.trim()) e.address1 = "Street address is required.";
  else if (form.address1.trim().length < 5) e.address1 = "Enter a valid street address.";
  if (!form.city.trim()) e.city = "City is required.";
  else if (form.city.trim().length < 2) e.city = "Enter a valid city name.";
  if (!form.state.trim()) e.state = "State is required.";
  if (!form.zip.trim()) e.zip = "ZIP code is required.";
  else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(form.zip.trim())) e.zip = "Enter a valid ZIP / postal code.";
  if (!form.phone.trim()) e.phone = "Phone number is required.";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
  return e;
}

const EMPTY: FormState = {
  company: "",
  countryCode: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
};

export default function AccountAddresses() {
  const { user } = useAuth();
  const [address, setAddress] = useState<AccountAddress | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) {
      setAddress(null);
      setForm(EMPTY);
      return;
    }

    let isCancelled = false;

    async function loadAddress() {
      const response = await fetch("/api/account/addresses", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        addresses?: AccountAddress[];
      };

      if (!response.ok || isCancelled) {
        return;
      }

      const nextAddress = payload.addresses?.[0] ?? null;
      setAddress(nextAddress);
      setForm(
        nextAddress
          ? {
              company: nextAddress.company,
              countryCode: nextAddress.countryCode,
              address1: nextAddress.address1,
              address2: nextAddress.address2,
              city: nextAddress.city,
              state: nextAddress.state,
              zip: nextAddress.zip,
              phone: nextAddress.phone,
            }
          : EMPTY,
      );
    }

    void loadAddress();

    return () => {
      isCancelled = true;
    };
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
    setTouched({
      company: true,
      countryCode: true,
      address1: true,
      address2: true,
      city: true,
      state: true,
      zip: true,
      phone: true,
    });
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!user) return;
    setSaving(true); setMsg("");

    try {
      const response = await fetch("/api/account/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          addressId: address?.id ?? "",
          company: form.company,
          countryCode: form.countryCode,
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          state: form.state,
          zip: form.zip,
          phone: form.phone,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        addresses?: AccountAddress[];
      };

      if (!response.ok) {
        setMsg(`Error: ${payload.error ?? "Unable to save your address."}`);
        return;
      }

      setMsg("Address saved successfully!");
      const nextAddress = payload.addresses?.[0] ?? null;
      if (nextAddress) {
        setAddress(nextAddress);
      }
    } catch (requestError) {
      setMsg(
        `Error: ${
          requestError instanceof Error
            ? requestError.message
            : "Unable to save your address."
        }`,
      );
    } finally {
      setSaving(false);
    }
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
              <select id="addr-country" {...field("countryCode")} required>
                <option value="">Select a country</option>
                {ACCOUNT_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
              {errors.countryCode && touched.countryCode && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.countryCode}</div>}
            </fieldset>

            <fieldset className="tf-field">
              <label htmlFor="addr-street" className="tf-lable fw-medium">Street Address <span className="text-primary">*</span></label>
              <input type="text" id="addr-street" placeholder="House number and street name" {...field("address1")} required />
              {errors.address1 && touched.address1 && <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>{errors.address1}</div>}
            </fieldset>

            <fieldset className="tf-field">
              <label htmlFor="addr-street-2" className="tf-lable fw-medium">Apartment, suite, etc. (optional)</label>
              <input type="text" id="addr-street-2" placeholder="Apartment, suite, unit, etc." {...field("address2")} />
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
              <label htmlFor="addr-email" className="tf-lable fw-medium">Account Email</label>
              <input
                type="email"
                id="addr-email"
                value={user?.email ?? ""}
                readOnly
                style={{ background: "#f5f5f5", cursor: "not-allowed" }}
              />
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
