export type GalleryCollection = {
  label: string;
  slug: string;
  folderName: string | null;
  availabilityNote?: string;
};

export const galleryCollections: GalleryCollection[] = [
  { label: "Mockups", slug: "mockups", folderName: "mockups" },
  { label: "Car Club", slug: "car-club", folderName: "car-club" },
  { label: "Food Booth", slug: "food-booth", folderName: "food-booth" },
  {
    label: "Cuisine",
    slug: "cuisine",
    folderName: "food",
    availabilityNote: 'Uses the existing "food" collection folder.',
  },
  { label: "Kennels", slug: "kennels", folderName: "kennels" },
  { label: "Corporate", slug: "corporate", folderName: "corporate" },
  { label: "Retail Store", slug: "retail-store", folderName: "retail-store" },
  { label: "Clothing Brand", slug: "clothing-brand", folderName: "clothing-brand" },
  {
    label: "Dispensary",
    slug: "dispensary",
    folderName: "dispensary",
    availabilityNote:
      "No collection-specific gallery images were discoverable on the source page.",
  },
  { label: "Athletic", slug: "athletic", folderName: "athletic" },
  {
    label: "Detail Shop",
    slug: "detail-shop",
    folderName: "detail-shop",
    availabilityNote:
      "No collection-specific gallery images were discoverable on the source page.",
  },
  {
    label: "Non profit",
    slug: "non-profit",
    folderName: "non-profit",
    availabilityNote:
      "No collection-specific gallery images were discoverable on the source page.",
  },
];

export function getGalleryHref(slug: string): string {
  return `/gallery/${slug}`;
}

export function getGalleryCollectionBySlug(
  slug: string,
): GalleryCollection | undefined {
  return galleryCollections.find((collection) => collection.slug === slug);
}
