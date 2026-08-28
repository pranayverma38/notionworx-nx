import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

import ImageGalleryPage from "@/components/pages/gallery/ImageGalleryPage";
import {
  galleryCollections,
  getGalleryCollectionBySlug,
} from "@/data/galleryCollections";

type Props = {
  params: Promise<{ slug: string }>;
};

const COLLECTIONS_ROOT = path.join(
  process.cwd(),
  "public",
  "assets",
  "images",
  "notionworx-inventory",
  "collections",
);

const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

export function generateStaticParams() {
  return galleryCollections.map((collection) => ({ slug: collection.slug }));
}

async function getGalleryImagePaths(folderName: string | null): Promise<string[]> {
  if (!folderName) {
    return [];
  }

  const folderPath = path.join(COLLECTIONS_ROOT, folderName);

  try {
    const entries = await readdir(folderPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
      .map(
        (fileName) =>
          `/assets/images/notionworx-inventory/collections/${folderName}/${fileName}`,
      );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getGalleryCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Gallery | Notion Worx",
      description: "Browse Notion Worx gallery collections.",
    };
  }

  return {
    title: `${collection.label} Gallery | Notion Worx`,
    description: `Browse the ${collection.label} gallery from Notion Worx.`,
  };
}

export default async function GalleryCollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getGalleryCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const imagePaths = await getGalleryImagePaths(collection.folderName);
  const emptyMessage = collection.availabilityNote
    ? `${collection.availabilityNote} This gallery will appear here once images are added.`
    : `No images are available in the ${collection.label} gallery yet.`;

  return (
    <ImageGalleryPage
      title={collection.label}
      imagePaths={imagePaths}
      emptyMessage={emptyMessage}
    />
  );
}
