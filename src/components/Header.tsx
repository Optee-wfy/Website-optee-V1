import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/operations', label: 'Opérations' },
  { to: '/espace-pro', label: 'Espace Pro' },
  { to: '/ressources', label: 'Ressources' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    // Re-check scroll position after navigation (ScrollToTop may reset it)
    setScrolled(window.scrollY > 20);
  }, [location]);

  // Pages dont le hero est sur fond navy-950 sombre — logo et texte restent blancs jusqu'au scroll
  const DARK_HERO_PAGES = ['/', '/solutions', '/operations', '/espace-pro', '/contact', '/faq', '/marketplace'];
  const isOnDarkHero =
    DARK_HERO_PAGES.includes(location.pathname) ||
    location.pathname.startsWith('/ressources');   // liste blog + articles (/ressources/:slug)

  const isDarkLinkColor = !isOnDarkHero || scrolled;
  const isScrolledBg = scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolledBg ? 'bg-white/90 backdrop-blur-md shadow-sm pt-0 pb-2' : 'pt-0'}`}>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white py-2 px-4 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 relative z-10 text-[10px] sm:text-xs">
          <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <span className="font-black uppercase tracking-widest text-green-400">Nouveau</span>
          </div>
          <p className="font-bold text-center tracking-tight">
            Optee s&apos;associe à <span className="text-green-400">Pisteur</span> pour révolutionner votre prospection.
          </p>
          <a
            href="https://pisteur.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 font-black uppercase tracking-widest text-white hover:text-green-400 transition-colors"
          >
            Découvrir
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center h-14 lg:h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 w-36">
          <Logo size={30} dark={isDarkLinkColor} />
          <span className={`text-xl font-bold transition-colors ${isDarkLinkColor ? 'text-navy-900' : 'text-white'}`}>
            Optee
          </span>
        </Link>

        <nav className="hidden lg:flex items-center justify-center flex-1">
          <div className={`flex items-center gap-1 backdrop-blur-sm rounded-full px-2 py-1.5 border shadow-lg transition-colors ${isDarkLinkColor ? 'bg-green-500 text-white border-green-400/50 shadow-green-500/20' : 'bg-green-500/90 border-green-400/50 shadow-green-500/20'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-white text-green-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="hidden lg:flex items-center justify-end flex-shrink-0 w-36">
          <Link to="/contact" className={`inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 ${
            isDarkLinkColor
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 hover:bg-green-600'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
          }`}>
            Essayer Optee
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden ml-auto p-2 rounded-full transition-colors ${isDarkLinkColor ? 'text-navy-700' : 'text-white'}`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden mt-2 mx-4 bg-white rounded-2xl border border-navy-100 shadow-xl overflow-hidden">
          <nav className="px-5 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-navy-700 font-medium py-2 hover:text-green-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-navy-100">
              <Link to="/contact" className="block w-full text-center px-5 py-3 bg-green-500 text-white font-semibold rounded-full">
                Essayer Optee
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
