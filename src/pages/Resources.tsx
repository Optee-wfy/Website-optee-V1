import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ArrowRight, Clock, Calendar, Tag, ChevronLeft, ChevronRight, X, Sparkles,
} from 'lucide-react';
import {
  getFeaturedPost, getPosts, getAllTags, POSTS_PER_PAGE,
} from '../lib/blog';
import type { BlogPostSummary } from '../types/blog';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const resourcesFaqs = [
  {
    question: "Quels sujets sont traités dans le blog Optee ?",
    answer: "Notre blog traite de la réglementation (Décret Tertiaire, Décret BACS), des solutions techniques de rénovation, des aides financières (CEE) et propose des études de cas concrètes de rénovation réussies."
  },
  {
    question: "À quelle fréquence publiez-vous de nouveaux articles ?",
    answer: "Nous publions 1 à 2 nouveaux articles par semaine pour vous tenir informés des dernières évolutions réglementaires et technologiques du secteur de l'efficacité énergétique."
  },
  {
    question: "Puis-je suggérer un sujet d'article ?",
    answer: "Bien sûr ! Nous sommes à l'écoute de nos lecteurs. N'hésitez pas à nous contacter via le formulaire de contact pour nous faire part de vos problématiques ou besoins d'éclaircissements."
  }
];

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

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-navy-100 animate-pulse">
      <div className="aspect-[16/9] bg-navy-100" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-navy-100 rounded-full" />
          <div className="h-5 w-16 bg-navy-100 rounded-full" />
        </div>
        <div className="h-5 bg-navy-100 rounded w-full" />
        <div className="h-5 bg-navy-100 rounded w-3/4" />
        <div className="h-4 bg-navy-50 rounded w-full" />
        <div className="h-4 bg-navy-50 rounded w-5/6" />
        <div className="flex gap-4 pt-2">
          <div className="h-4 w-24 bg-navy-100 rounded" />
          <div className="h-4 w-20 bg-navy-100 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Article card ──────────────────────────────────────────────────────────────

function ArticleCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      to={`/ressources/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-navy-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[16/9] overflow-hidden relative bg-navy-50">
        {post.cover_image ? (
          <img
            src={`${post.cover_image}?auto=compress&cs=tinysrgb&w=600`}
            alt={post.cover_image_alt ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-navy-400" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${tagClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-bold text-navy-900 text-[1.0625rem] leading-snug mb-2 group-hover:text-green-600 transition-colors line-clamp-2 flex-1">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-navy-500 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-navy-50">
          <div className="flex items-center gap-3 text-navy-400 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time} min
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.published_at)}
            </span>
          </div>
          <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Lire <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Featured card ─────────────────────────────────────────────────────────────

function FeaturedCard({ post }: { post: BlogPostSummary }) {
  return (
    <section className="bg-white border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to={`/ressources/${post.slug}`}
          className="group block"
        >
          <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-navy-100 hover:border-green-200 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
            {/* Image */}
            <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden bg-navy-100">
              {post.cover_image ? (
                <img
                  src={`${post.cover_image}?auto=compress&cs=tinysrgb&w=900`}
                  alt={post.cover_image_alt ?? post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-200 to-navy-300" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 lg:to-transparent" />
            </div>

            {/* Content */}
            <div className="bg-navy-50 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  <Sparkles className="w-3 h-3" />
                  À la une
                </span>
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagClass(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-4 leading-snug group-hover:text-green-700 transition-colors">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-navy-600 leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-5 text-navy-400 text-sm mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.reading_time} min de lecture
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </span>
              </div>

              <span className="inline-flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                Lire l'article complet
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-navy-200 text-navy-600 hover:border-green-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-navy-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
              p === page
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                : 'border border-navy-200 text-navy-700 hover:border-green-400 hover:text-green-600'
            }`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-navy-200 text-navy-600 hover:border-green-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Resources() {
  const [search, setSearch]               = useState('');
  const [debouncedSearch, setDebounced]   = useState('');
  const [activeTag, setActiveTag]         = useState('');
  const [page, setPage]                   = useState(1);
  const [posts, setPosts]                 = useState<BlogPostSummary[]>([]);
  const [featured, setFeatured]           = useState<BlogPostSummary | null>(null);
  const [allTags, setAllTags]             = useState<string[]>([]);
  const [total, setTotal]                 = useState(0);
  const [loading, setLoading]             = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [posts, loading]);

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, activeTag]);

  // Fetch featured post
  useEffect(() => {
    setFeaturedLoading(true);
    getFeaturedPost().then((data) => {
      setFeatured(data);
      setFeaturedLoading(false);
    });
  }, []);

  // Fetch all tags
  useEffect(() => {
    getAllTags().then(setAllTags);
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { posts: data, total: count } = await getPosts({
      page,
      search: debouncedSearch,
      tag: activeTag,
    });
    setPosts(data);
    setTotal(count);
    setLoading(false);
  }, [page, debouncedSearch, activeTag]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const hasFilters = debouncedSearch || activeTag;

  function handleTagClick(tag: string) {
    setActiveTag((prev) => (prev === tag ? '' : tag));
  }

  function handleClearFilters() {
    setSearch('');
    setActiveTag('');
    setPage(1);
  }

  return (
    <>
      <SEO 
        title="Blog & Ressources" 
        description="Guides, études de cas et analyses pour maîtriser la rénovation énergétique des bâtiments professionnels. Décret Tertiaire, CEE, DPE, financement." 
        faqs={resourcesFaqs}
      />
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500 rounded-full filter blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-400 font-semibold text-sm rounded-full mb-6 border border-green-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Blog & Ressources
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Expertise & Insights<br />
            <span className="text-green-400">Rénovation Énergétique</span>
          </h1>

          <p className="text-navy-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Guides, études de cas et analyses pour maîtriser la rénovation énergétique
            des bâtiments professionnels.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un article, un sujet…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white/15 transition-all text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-white transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex items-center justify-center gap-6 mt-8 text-navy-300 text-sm">
            <span>{total > 0 ? `${total} article${total > 1 ? 's' : ''}` : '…'}</span>
            <span className="w-1 h-1 rounded-full bg-navy-600" />
            <span>{allTags.length} catégories</span>
            <span className="w-1 h-1 rounded-full bg-navy-600" />
            <span>Mis à jour régulièrement</span>
          </div>
        </div>
      </section>

      {/* ── Article à la une ── */}
      {!featuredLoading && featured && !hasFilters && <FeaturedCard post={featured} />}

      {/* ── Tag filters + content ── */}
      <section className="bg-gray-50 min-h-[600px]">
        {/* Tag filter bar */}
        {allTags.length > 0 && (
          <div className="sticky top-[88px] lg:top-[96px] z-40 bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <span className="flex-shrink-0 text-navy-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Filtrer
                </span>

                <button
                  onClick={() => setActiveTag('')}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                    !activeTag
                      ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-500/25'
                      : 'bg-white text-navy-600 border-navy-200 hover:border-green-300 hover:text-green-600'
                  }`}
                >
                  Tous
                </button>

                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                      activeTag === tag
                        ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-500/25'
                        : 'bg-white text-navy-600 border-navy-200 hover:border-green-300 hover:text-green-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Articles grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Results header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              {hasFilters ? (
                <p className="text-navy-600 text-sm font-medium">
                  {loading ? 'Recherche en cours…' : (
                    total === 0
                      ? 'Aucun résultat'
                      : `${total} résultat${total > 1 ? 's' : ''} ${debouncedSearch ? `pour « ${debouncedSearch} »` : ''} ${activeTag ? `dans « ${activeTag} »` : ''}`
                  )}
                </p>
              ) : (
                <p className="text-navy-500 text-sm">
                  {loading ? '' : `${total} article${total > 1 ? 's' : ''} — page ${page} sur ${totalPages || 1}`}
                </p>
              )}
            </div>

            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-navy-500 border border-navy-200 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-navy-400" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Aucun article trouvé</h3>
              <p className="text-navy-500 mb-6">
                Essayez d'autres mots-clés ou supprimez les filtres actifs.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && posts.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </section>

      <FAQSection faqs={resourcesFaqs} title="Questions sur nos ressources" />

      {/* ── CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto reveal">
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500 rounded-full filter blur-[80px]" />
            </div>
            <div className="relative max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 font-semibold text-sm rounded-full mb-6 border border-green-500/30">
                Passez à l'action
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Identifiez vos travaux en 30 secondes
              </h2>
              <p className="text-navy-200 text-lg mb-8">
                Renseignez l'adresse de votre bâtiment et obtenez un diagnostic
                complet avec toutes les aides mobilisables.
              </p>
              <Link
                to="/estimer-mon-projet"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-semibold rounded-full hover:bg-green-600 transition-all duration-200 shadow-lg shadow-green-500/25 hover:-translate-y-0.5"
              >
                Estimer mon projet gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
