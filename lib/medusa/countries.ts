export const ACCOUNT_COUNTRIES = [
  { code: "us", label: "United States" },
  { code: "gb", label: "United Kingdom" },
  { code: "in", label: "India" },
  { code: "au", label: "Australia" },
  { code: "ca", label: "Canada" },
  { code: "de", label: "Germany" },
  { code: "fr", label: "France" },
  { code: "jp", label: "Japan" },
  { code: "sg", label: "Singapore" },
  { code: "ae", label: "UAE" },
  { code: "other", label: "Other" },
] as const;

export function getCountryLabel(countryCode?: string | null): string {
  const normalizedCode = normalizeCountryCode(countryCode);
  if (!normalizedCode) {
    return "";
  }

  return (
    ACCOUNT_COUNTRIES.find((country) => country.code === normalizedCode)?.label ??
    normalizedCode.toUpperCase()
  );
}

export function normalizeCountryCode(countryCode?: string | null): string {
  return typeof countryCode === "string" ? countryCode.trim().toLowerCase() : "";
}

export function formatProvinceCode(
  countryCode?: string | null,
  province?: string | null,
): string {
  const normalizedProvince = typeof province === "string" ? province.trim() : "";
  if (!normalizedProvince) {
    return "";
  }

  const normalizedCountryCode = normalizeCountryCode(countryCode);
  const loweredProvince = normalizedProvince.toLowerCase().replace(/\s+/g, "-");

  if (!normalizedCountryCode || normalizedCountryCode === "other") {
    return loweredProvince;
  }

  if (loweredProvince.startsWith(`${normalizedCountryCode}-`)) {
    return loweredProvince;
  }

  return `${normalizedCountryCode}-${loweredProvince}`;
}
