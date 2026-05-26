// ─── Blog post types ──────────────────────────────────────────────────────────

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;           // HTML
  cover_image: string | null;
  cover_image_alt: string | null;   // Alt SEO
  meta_description: string | null;  // Meta desc SEO (160 char max)
  tags: string[];
  author: string;
  author_avatar: string | null;
  reading_time: number;             // minutes
  featured: boolean;                // Article à la une
  published: boolean;
  published_at: string;             // ISO string
  created_at: string;
  updated_at: string;
};

/** Version sans `content` (pour les listes, fiches, related posts) */
export type BlogPostSummary = Omit<BlogPost, 'content'>;
