export interface BlogPost {
  /** Stable id for `/blog-single/[id]` */
  id: string;
  img: string;
  alt?: string;
  date: string;
  title: string;
  desc: string;
  /** Optional tag label (e.g. "WOOD", "CONSTRUCTION") */
  tag?: string;
}
