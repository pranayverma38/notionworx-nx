export interface BrowseByCategoryLink {
  label: string;
  href: string;
}

export interface BrowseByCategorySubSection {
  title: string;
  links: BrowseByCategoryLink[];
}

export interface BrowseByCategoryItem extends BrowseByCategoryLink {
  showCaret?: boolean;
  subSections?: BrowseByCategorySubSection[];
}
