import { supabase } from './supabase';
import type { BlogPost, BlogPostSummary } from '../types/blog';

export const POSTS_PER_PAGE = 6;

// Champs résumé (sans `content` pour alléger les requêtes de liste)
const SUMMARY =
  'id,title,slug,excerpt,cover_image,cover_image_alt,meta_description,tags,author,author_avatar,reading_time,featured,published,published_at,created_at,updated_at';

// ─── Récupérer l'article à la une ─────────────────────────────────────────────
export async function getFeaturedPost(): Promise<BlogPostSummary | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(SUMMARY)
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[Blog] getFeaturedPost:', error.message);
    return null;
  }
  return data;
}

// ─── Récupérer une page d'articles ────────────────────────────────────────────
export async function getPosts({
  page = 1,
  search = '',
  tag = '',
}: {
  page?: number;
  search?: string;
  tag?: string;
}): Promise<{ posts: BlogPostSummary[]; total: number }> {
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let query = supabase
    .from('blog_posts')
    .select(SUMMARY, { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (search.trim()) {
    query = query.or(
      `title.ilike.%${search.trim()}%,excerpt.ilike.%${search.trim()}%`
    );
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('[Blog] getPosts:', error.message);
    return { posts: [], total: 0 };
  }
  return { posts: data ?? [], total: count ?? 0 };
}

// ─── Récupérer tous les tags distincts ────────────────────────────────────────
export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('published', true);

  if (error || !data) return [];
  const all = data.flatMap((p) => p.tags ?? []);
  return [...new Set(all)].sort();
}

// ─── Récupérer un article par slug (full content) ─────────────────────────────
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('[Blog] getPostBySlug:', error.message);
    return null;
  }
  return data;
}

// ─── Récupérer les articles liés ──────────────────────────────────────────────
export async function getRelatedPosts(
  slug: string,
  tags: string[]
): Promise<BlogPostSummary[]> {
  let query = supabase
    .from('blog_posts')
    .select(SUMMARY)
    .eq('published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3);

  if (tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  const { data } = await query;
  return data ?? [];
}
