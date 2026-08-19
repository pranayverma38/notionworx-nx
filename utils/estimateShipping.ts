export type CountryOption = {
  value: string;
  label: string;
  /** Province/state values (value and label are the same string). */
  provinces: string[];
};

export const ESTIMATE_SHIPPING_COUNTRIES: CountryOption[] = [
  {
    value: "Australia",
    label: "Australia",
    provinces: [
      "Australian Capital Territory",
      "New South Wales",
      "Northern Territory",
      "Queensland",
      "South Australia",
      "Tasmania",
      "Victoria",
      "Western Australia",
    ],
  },
  { value: "Austria", label: "Austria", provinces: [] },
  { value: "Belgium", label: "Belgium", provinces: [] },
  { value: "Canada", label: "Canada", provinces: ["Ontario", "Quebec"] },
  { value: "Czech Republic", label: "Czechia", provinces: [] },
  { value: "Denmark", label: "Denmark", provinces: [] },
  { value: "Finland", label: "Finland", provinces: [] },
  { value: "France", label: "France", provinces: [] },
  { value: "Germany", label: "Germany", provinces: [] },
  {
    value: "United States",
    label: "United States",
    provinces: ["Alabama", "California", "Florida"],
  },
  {
    value: "United Kingdom",
    label: "United Kingdom",
    provinces: ["England", "Scotland", "Wales", "Northern Ireland"],
  },
  { value: "India", label: "India", provinces: [] },
  { value: "Japan", label: "Japan", provinces: [] },
  { value: "Mexico", label: "Mexico", provinces: [] },
  { value: "South Korea", label: "South Korea", provinces: [] },
  { value: "Spain", label: "Spain", provinces: [] },
  { value: "Italy", label: "Italy", provinces: [] },
  {
    value: "Vietnam",
    label: "Vietnam",
    provinces: ["Ha Noi", "Da Nang", "Ho Chi Minh"],
  },
];

/** Demo: only checks that postal/ZIP input is not empty (no format rules). */
export function validateEstimateShippingZipcode(zipcode: string): boolean {
  return zipcode.trim().length > 0;
}
