export function slug(s: string) {
  return s.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
}
