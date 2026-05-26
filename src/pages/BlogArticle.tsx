import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Clock, Calendar, User,
  Share2, Copy, Check, ChevronRight, Sparkles,
} from 'lucide-react';
import { getPostBySlug, getRelatedPosts } from '../lib/blog';
import type { BlogPost, BlogPostSummary } from '../types/blog';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso));
}

const TAG_CLASSES: Record<string, string> = {
  'Réglementation' : 'bg-red-50 text-red-700 border border-red-100',
  'Guide'          : 'bg-green-50 text-green-700 border border-green-100',
  'CEE'            : 'bg-accent-50 text-accent-700 border border-accent-100',
  'Financement'    : 'bg-teal-50 text-teal-700 border border-teal-100',
  'Étude de cas'   : 'bg-purple-50 text-purple-700 border border-purple-200',
  'Technique'      : 'bg-blue-50 text-blue-700 border border-blue-100',
  'DPE'            : 'bg-orange-50 text-orange-700 border border-orange-100',
  'Tertiaire'      : 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  'Chauffage'      : 'bg-orange-50 text-orange-700 border border-orange-100',
  'Éclairage'      : 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  'Isolation'      : 'bg-teal-50 text-teal-700 border border-teal-100',
  'Domotique'      : 'bg-indigo-50 text-indigo-700 border border-indigo-100',
};
function tagClass(tag: string) {
  return TAG_CLASSES[tag] ?? 'bg-navy-50 text-navy-600 border border-navy-100';
}

// ─── Reading progress bar ─────────────────────────────────────────────────────

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-navy-100">
      <div
        className="h-full bg-green-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Related article card ─────────────────────────────────────────────────────

function RelatedCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      to={`/ressources/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-navy-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[16/9] overflow-hidden bg-navy-50">
        {post.cover_image ? (
          <img
            src={`${post.cover_image}?auto=compress&cs=tinysrgb&w=500`}
            alt={post.cover_image_alt ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-navy-400" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tagClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-navy-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-green-600 transition-colors flex-1">
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-navy-400 text-xs mt-auto">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.reading_time} min
          </span>
          <span>{formatDate(post.published_at)}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────────

function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-navy-500 flex items-center gap-1.5">
        <Share2 className="w-4 h-4" /> Partager
      </span>
      <button
        onClick={copyLink}
        className="w-9 h-9 rounded-full border border-navy-200 flex items-center justify-center text-navy-500 hover:border-green-400 hover:text-green-600 transition-colors"
        aria-label="Copier le lien"
        title="Copier le lien"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full border border-navy-200 flex items-center justify-center text-navy-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
        aria-label="Partager sur LinkedIn"
        title="Partager sur LinkedIn"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full border border-navy-200 flex items-center justify-center text-navy-500 hover:border-navy-900 hover:text-navy-900 transition-colors"
        aria-label="Partager sur X (Twitter)"
        title="Partager sur X"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[40vh] bg-navy-100" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-navy-100 rounded-full" />
          <div className="h-6 w-24 bg-navy-100 rounded-full" />
        </div>
        <div className="h-10 bg-navy-100 rounded w-full" />
        <div className="h-10 bg-navy-100 rounded w-3/4" />
        <div className="flex gap-4 py-2">
          <div className="h-4 w-28 bg-navy-50 rounded" />
          <div className="h-4 w-24 bg-navy-50 rounded" />
          <div className="h-4 w-20 bg-navy-50 rounded" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-4 bg-navy-50 rounded ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const contentRef = useRef<HTMLDivElement>(null);

  const [post, setPost]             = useState<BlogPost | null>(null);
  const [related, setRelated]       = useState<BlogPostSummary[]>([]);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);

  // Fetch article
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setPost(null);
    setNotFound(false);

    getPostBySlug(slug).then((data) => {
      if (!data) { setNotFound(true); setLoading(false); return; }
      setPost(data);
      setLoading(false);
      getRelatedPosts(slug, data.tags).then(setRelated);
    });
  }, [slug]);

  // SEO — inject meta tags & JSON-LD
  useEffect(() => {
    if (!post) return;

    const prevTitle = document.title;
    document.title = `${post.title} | Optee`;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr.split('=')[0], attr.split('=')[1] ?? sel.replace(/^.*\[|\]$/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    const desc = post.meta_description ?? post.excerpt ?? '';
    setMeta('meta[name="description"]',        'name=description',        desc);
    setMeta('meta[property="og:title"]',       'property=og:title',       `${post.title} | Optee`);
    setMeta('meta[property="og:description"]', 'property=og:description', desc);
    setMeta('meta[property="og:type"]',        'property=og:type',        'article');
    if (post.cover_image) {
      setMeta('meta[property="og:image"]', 'property=og:image', post.cover_image);
    }
    setMeta('meta[name="twitter:card"]',        'name=twitter:card',        'summary_large_image');
    setMeta('meta[name="twitter:title"]',       'name=twitter:title',       `${post.title} | Optee`);
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', desc);

    // JSON-LD Article schema
    const existingLd = document.getElementById('blog-ld');
    if (existingLd) existingLd.remove();
    const ld = document.createElement('script');
    ld.id   = 'blog-ld';
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: desc,
      image: post.cover_image ?? undefined,
      author: { '@type': 'Organization', name: post.author ?? 'Équipe Optee' },
      publisher: {
        '@type': 'Organization',
        name: 'Optee',
        logo: { '@type': 'ImageObject', url: 'https://optee.io/logo.png' },
      },
      datePublished: post.published_at,
      dateModified: post.updated_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://optee.io/ressources/${post.slug}`,
      },
      keywords: post.tags.join(', '),
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      ld.remove();
    };
  }, [post]);

  // Scroll reveal (related section)
  useEffect(() => {
    if (related.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [related]);

  // 404
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-center px-4">
        <span className="text-green-400 font-bold text-6xl mb-4">404</span>
        <h1 className="text-3xl font-bold text-white mb-4">Article introuvable</h1>
        <p className="text-navy-300 mb-8">Cet article n'existe pas ou a été supprimé.</p>
        <Link
          to="/ressources"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au blog
        </Link>
      </div>
    );
  }

  if (loading) return <><ReadingProgress /><ArticleSkeleton /></>;

  if (!post) return null;

  return (
    <>
      <ReadingProgress />

      {/* ── Hero image avec overlay titre ── */}
      <section className="relative pt-20">
        <div className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh] min-h-[340px] overflow-hidden bg-navy-900">
          {post.cover_image ? (
            <img
              src={`${post.cover_image}?auto=compress&cs=tinysrgb&w=1400`}
              alt={post.cover_image_alt ?? post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-navy-900/20" />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <nav className="flex items-center gap-2 text-sm text-white/60" aria-label="Fil d'Ariane">
                <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/ressources" className="hover:text-white transition-colors">Blog</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white/40 truncate max-w-xs">{post.title}</span>
              </nav>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-10">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full ${tagClass(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article body ── */}
      <article className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Meta header */}
          <div className="py-8 border-b border-navy-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-5 text-navy-400 text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.reading_time} min de lecture
              </span>
            </div>
            <ShareButton />
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-navy-600 leading-relaxed mt-8 font-medium border-l-4 border-green-500 pl-5 bg-green-50 py-4 rounded-r-xl">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            ref={contentRef}
            className="article-content py-10"
            dangerouslySetInnerHTML={{ __html: post.content ?? '<p>Contenu non disponible.</p>' }}
          />

          {/* Bottom share */}
          <div className="py-8 border-t border-navy-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/ressources?tag=${encodeURIComponent(tag)}`}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 ${tagClass(tag)}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
            <ShareButton />
          </div>

          {/* Back to blog */}
          <div className="pb-12">
            <Link
              to="/ressources"
              className="inline-flex items-center gap-2 text-navy-500 hover:text-green-600 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>
          </div>
        </div>
      </article>

      {/* ── Articles liés ── */}
      {related.length > 0 && (
        <section className="bg-gray-50 border-t border-navy-100 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10 reveal">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                Articles liés
              </h2>
              <Link
                to="/ressources"
                className="inline-flex items-center gap-1.5 text-green-600 font-semibold text-sm hover:text-green-700 transition-colors"
              >
                Voir tout le blog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
              {related.map((r) => <RelatedCard key={r.id} post={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500 rounded-full filter blur-[80px]" />
            </div>
            <div className="relative max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Prêt à passer à l'action ?
              </h2>
              <p className="text-navy-200 mb-8">
                Analysez votre bâtiment en 30 secondes et identifiez toutes les
                opportunités de rénovation avec les aides associées.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/estimer-mon-projet"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-all shadow-lg shadow-green-500/25 hover:-translate-y-0.5"
                >
                  Estimer mon projet gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                >
                  Parler à un expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
