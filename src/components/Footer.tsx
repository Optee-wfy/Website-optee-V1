import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import Logo from './Logo';

const footerLinks = {
  Plateforme: [
    { to: '/solutions', label: 'Solutions' },
    { to: '/operations', label: 'Opérations' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/espace-pro', label: 'Espace Pro' },
  ],
  Ressources: [
    { to: '/ressources', label: 'Blog' },
    { to: '/faq', label: 'FAQ' },
    { to: '/ressources', label: 'Guides' },
    { to: '/ressources', label: 'Études de cas' },
  ],
  Entreprise: [
    { to: '/contact', label: 'Contact' },
    { to: '/contact', label: 'Demander une démo' },
    { to: '/', label: 'Mentions légales' },
    { to: '/', label: 'Politique de confidentialité' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Logo size={32} />
              <span className="text-xl font-bold">Optee</span>
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed max-w-sm mb-6">
              La plateforme intelligente qui simplifie et accélère la rénovation énergétique des bâtiments professionnels.
            </p>
            <div className="flex gap-3 mb-8">
              <a href="#" className="w-9 h-9 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Partenariat Pisteur */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Partenaire Innovation</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center border border-white/10">
                   <span className="text-lg">🎯</span>
                </div>
                <p className="text-xs text-navy-200 font-medium">
                  Optee travaille désormais avec <a href="https://pisteur.tech/" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-green-400 transition-colors">Pisteur</a> pour booster votre recherche de bâtiments.
                </p>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-navy-300 text-sm hover:text-green-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-sm">&copy; 2026 Optee. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-navy-400 text-sm hover:text-white transition-colors">Mentions légales</Link>
            <Link to="/" className="text-navy-400 text-sm hover:text-white transition-colors">CGU</Link>
            <Link to="/" className="text-navy-400 text-sm hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
