import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Loader2, Upload, Tag, CheckSquare, Square,
  Eye, EyeOff, Star, StarOff, Image as ImageIcon,
} from 'lucide-react';
import { getSupabaseAdminClient } from '../../lib/supabase';
import type { BlogPost } from '../../types/blog';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function processAndUploadImage(file: File, title: string): Promise<string> {
  const webpBlob = await new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas toBlob returned null'));
        },
        'image/webp',
        0.85
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  const filename =
    slugify(title || 'image') + '-' + Date.now() + '.webp';

  const adminClient = getSupabaseAdminClient();
  const { error } = await adminClient.storage
    .from('blog-images')
    .upload(filename, webpBlob, { contentType: 'image/webp', upsert: true });

  if (error) throw error;

  const { data: urlData } = adminClient.storage
    .from('blog-images')
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  reading_time: number;
  featured: boolean;
  published: boolean;
  meta_description: string;
  cover_image: string;
  cover_image_alt: string;
  tags: string[];
  published_at: string;
};

const emptyForm = (): FormState => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'Équipe Optee',
  reading_time: 5,
  featured: false,
  published: false,
  meta_description: '',
  cover_image: '',
  cover_image_alt: '',
  tags: [],
  published_at: new Date().toISOString(),
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const admin = getSupabaseAdminClient();
      const { data, error: err } = await admin
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setPosts((data as BlogPost[]) ?? []);
    } catch (e) {
      setError('Erreur lors du chargement des articles.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  function openCreate() {
    setEditingPost(null);
    setForm(emptyForm());
    setSlugManual(false);
    setTagInput('');
    setModalOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      author: post.author,
      reading_time: post.reading_time,
      featured: post.featured,
      published: post.published,
      meta_description: post.meta_description ?? '',
      cover_image: post.cover_image ?? '',
      cover_image_alt: post.cover_image_alt ?? '',
      tags: post.tags ?? [],
      published_at: post.published_at,
    });
    setSlugManual(true);
    setTagInput('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingPost(null);
    setForm(emptyForm());
    setTagInput('');
    setSlugManual(false);
  }

  function handleFieldChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  async function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await processAndUploadImage(file, form.title || 'optee-blog');
      setForm((f) => ({ ...f, cover_image: url }));
    } catch (e) {
      alert('Erreur lors de l\'upload de l\'image.');
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      alert('Le titre et le slug sont requis.');
      return;
    }
    setSaving(true);
    try {
      const admin = getSupabaseAdminClient();
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim() || null,
        author: form.author.trim() || 'Équipe Optee',
        reading_time: form.reading_time,
        featured: form.featured,
        published: form.published,
        meta_description: form.meta_description.trim() || null,
        cover_image: form.cover_image.trim() || null,
        cover_image_alt: form.cover_image_alt.trim() || null,
        tags: form.tags,
        published_at: form.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingPost) {
        const { error: err } = await admin
          .from('blog_posts')
          .update(payload)
          .eq('id', editingPost.id);
        if (err) throw err;
      } else {
        const { error: err } = await admin.from('blog_posts').insert({
          ...payload,
          created_at: new Date().toISOString(),
        });
        if (err) throw err;
      }

      closeModal();
      await fetchPosts();
    } catch (e) {
      alert('Erreur lors de la sauvegarde.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const admin = getSupabaseAdminClient();
      const { error: err } = await admin.from('blog_posts').delete().eq('id', id);
      if (err) throw err;
      setDeleteConfirm(null);
      await fetchPosts();
    } catch (e) {
      alert('Erreur lors de la suppression.');
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Articles de blog</h2>
          <p className="text-sm text-gray-500">{posts.length} article{posts.length !== 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileTextIcon />
          <p className="mt-2 text-sm">Aucun article pour l&apos;instant.</p>
          <button onClick={openCreate} className="mt-4 text-green-600 hover:underline text-sm font-medium">
            Créer le premier article →
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tags</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {post.featured && <Star className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(post.tags ?? []).slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {post.tags?.length > 3 && (
                        <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      post.published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {post.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Éditer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer l&apos;article</h3>
            <p className="text-gray-600 text-sm mb-6">Cette action est irréversible. L&apos;article sera définitivement supprimé.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                  placeholder="Mon super article"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); handleFieldChange('slug', e.target.value); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-mono"
                  placeholder="mon-super-article"
                />
                <p className="text-xs text-gray-400 mt-1">Généré automatiquement depuis le titre.</p>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image de couverture</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleImageFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                    dragOver ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  {form.cover_image ? (
                    <div className="relative">
                      <img
                        src={form.cover_image}
                        alt="Cover preview"
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium">Changer l&apos;image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8" />
                          <p className="text-sm font-medium">Glisser-déposer ou cliquer pour sélectionner</p>
                          <p className="text-xs">PNG, JPG, WebP — convertie en WebP automatiquement</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
                />
                {/* Or URL input */}
                <input
                  type="url"
                  value={form.cover_image}
                  onChange={(e) => handleFieldChange('cover_image', e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                  placeholder="Ou coller une URL d'image"
                />
              </div>

              {/* Alt text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alt image (SEO)</label>
                <input
                  type="text"
                  value={form.cover_image_alt}
                  onChange={(e) => handleFieldChange('cover_image_alt', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                  placeholder="Description courte de l'image"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Extrait</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm resize-none"
                  placeholder="Courte description affichée en aperçu..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contenu (HTML)</label>
                <textarea
                  rows={10}
                  value={form.content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm resize-y font-mono"
                  placeholder="<h2>Introduction</h2><p>...</p>"
                />
              </div>

              {/* Meta description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Meta description <span className="text-xs font-normal text-gray-400">({form.meta_description.length}/160)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={form.meta_description}
                  onChange={(e) => handleFieldChange('meta_description', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm resize-none"
                  placeholder="Description SEO de 160 caractères max..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                    placeholder="Ajouter un tag..."
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    <Tag className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-blue-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Author + Reading time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Auteur</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => handleFieldChange('author', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                    placeholder="Équipe Optee"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temps de lecture (min)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={form.reading_time}
                    onChange={(e) => handleFieldChange('reading_time', parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Published at */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date de publication</label>
                <input
                  type="datetime-local"
                  value={form.published_at.slice(0, 16)}
                  onChange={(e) => handleFieldChange('published_at', new Date(e.target.value).toISOString())}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                />
              </div>

              {/* Toggles */}
              <div className="grid sm:grid-cols-2 gap-4">
                <ToggleField
                  label="Article à la une"
                  value={form.featured}
                  onChange={(v) => handleFieldChange('featured', v)}
                  iconOn={<Star className="w-4 h-4" />}
                  iconOff={<StarOff className="w-4 h-4" />}
                />
                <ToggleField
                  label="Publié"
                  value={form.published}
                  onChange={(v) => handleFieldChange('published', v)}
                  iconOn={<Eye className="w-4 h-4" />}
                  iconOff={<EyeOff className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {saving ? 'Sauvegarde...' : editingPost ? 'Enregistrer les modifications' : 'Publier l\'article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
  iconOn,
  iconOff,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
        value
          ? 'border-green-400 bg-green-50 text-green-700'
          : 'border-gray-200 bg-gray-50 text-gray-500'
      }`}
    >
      <span className="flex-shrink-0">{value ? iconOn : iconOff}</span>
      <span className="text-sm font-semibold">{label}</span>
      {value ? (
        <CheckSquare className="w-4 h-4 ml-auto text-green-500" />
      ) : (
        <Square className="w-4 h-4 ml-auto text-gray-300" />
      )}
    </button>
  );
}

function FileTextIcon() {
  return (
    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
