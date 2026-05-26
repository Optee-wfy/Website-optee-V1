import { useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface SEOProps {
  title: string;
  description: string;
  faqs?: FAQ[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
}

const BASE_URL = 'https://optee.io';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEO({ title, description, faqs, canonical, ogImage, ogType = 'website', article }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    const fullTitle = `${title} | Optee`;
    document.title = fullTitle;

    const setMeta = (selector: string, attrKey: string, attrVal: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrKey, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    const image = ogImage || DEFAULT_OG_IMAGE;

    // Base SEO
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');

    // Canonical
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.setAttribute('rel', 'canonical');
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', canonicalUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'fr_FR');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Optee');

    // Article meta
    if (ogType === 'article' && article) {
      setMeta('meta[property="article:published_time"]', 'property', 'article:published_time', article.publishedTime);
      if (article.modifiedTime) {
        setMeta('meta[property="article:modified_time"]', 'property', 'article:modified_time', article.modifiedTime);
      }
      if (article.author) {
        setMeta('meta[property="article:author"]', 'property', 'article:author', article.author);
      }
    }

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // FAQ Schema
    let faqLd: HTMLScriptElement | null = null;
    if (faqs && faqs.length > 0) {
      const existingLd = document.getElementById('faq-ld');
      if (existingLd) existingLd.remove();

      faqLd = document.createElement('script');
      faqLd.id = 'faq-ld';
      faqLd.type = 'application/ld+json';
      faqLd.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer }
        }))
      });
      document.head.appendChild(faqLd);
    }

    // BreadcrumbList Schema
    let breadcrumbLd: HTMLScriptElement | null = null;
    if (canonical && canonical !== '/') {
      const existingBc = document.getElementById('breadcrumb-ld');
      if (existingBc) existingBc.remove();

      breadcrumbLd = document.createElement('script');
      breadcrumbLd.id = 'breadcrumb-ld';
      breadcrumbLd.type = 'application/ld+json';
      breadcrumbLd.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': BASE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': title, 'item': canonicalUrl }
        ]
      });
      document.head.appendChild(breadcrumbLd);
    }

    return () => {
      document.title = prevTitle;
      if (faqLd) faqLd.remove();
      if (breadcrumbLd) breadcrumbLd.remove();
    };
  }, [title, description, faqs, canonical, ogImage, ogType, article]);

  return null;
}
