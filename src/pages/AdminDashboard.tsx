import { useState } from 'react';
import { LayoutDashboard, FileText, BarChart2, Mail, LogOut, ChevronRight, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import DashboardHome from '../components/admin/DashboardHome';
import BlogSection from '../components/admin/BlogSection';
import AnalyticsSection from '../components/admin/AnalyticsSection';
import ContactsSection from '../components/admin/ContactsSection';

type Tab = 'dashboard' | 'blog' | 'analytics' | 'contacts';

const menuItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'blog',      label: 'Blog',            icon: FileText },
  { id: 'analytics', label: 'Analytics',       icon: BarChart2 },
  { id: 'contacts',  label: 'Contacts',        icon: Mail },
];

const TAB_TITLES: Record<Tab, string> = {
  dashboard: 'Vue d\'ensemble',
  blog:      'Blog',
  analytics: 'Analytics',
  contacts:  'Contacts',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab]     = useState<Tab>('dashboard');
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'blog':      return <BlogSection />;
      case 'analytics': return <AnalyticsSection />;
      case 'contacts':  return <ContactsSection />;
    }
  };

  return (
    /* Conteneur pleine hauteur d'écran, pas de scroll global */
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50 overflow-hidden">

      {/* ─────────────────────────────────────────────
          SIDEBAR — desktop uniquement (lg+)
      ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#0B1D4E] h-screen sticky top-0 overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10 flex-shrink-0">
          <Logo size={32} dark={false} />
          <div>
            <p className="text-white font-bold text-base leading-none">Optee</p>
            <p className="text-blue-300/70 text-xs mt-0.5 uppercase tracking-widest">Admin</p>
          </div>
        </div>

        {/* Navigation — prend tout l'espace disponible */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                  active
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'text-blue-200/70 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm flex-1">{label}</span>
                {active && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Déconnexion — ancrée tout en bas */}
        <div className="flex-shrink-0 px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-300/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────
          DRAWER LATÉRAL — mobile (slide depuis gauche)
      ───────────────────────────────────────────── */}
      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-[#0B1D4E] z-50 flex flex-col transition-transform duration-300 ease-out ${
        drawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header drawer */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Logo size={28} dark={false} />
            <div>
              <p className="text-white font-bold text-sm leading-none">Optee</p>
              <p className="text-blue-300/70 text-[10px] mt-0.5 uppercase tracking-widest">Admin</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-blue-300/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav drawer */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left ${
                  active
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'text-blue-200/70 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Logout drawer */}
        <div className="flex-shrink-0 px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-300/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          ZONE PRINCIPALE (header + contenu)
      ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sticky top-0 z-10">
          {/* Burger mobile */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo mobile (visible quand drawer fermé) */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <Logo size={22} dark />
            <span className="font-bold text-navy-900 text-sm">Optee</span>
          </div>

          {/* Titre */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{TAB_TITLES[activeTab]}</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
              })}
            </p>
          </div>

          {/* Badge connecté */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200 flex-shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-green-700">Connecté</span>
          </div>
        </header>

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6">
          {renderContent()}
        </main>

        {/* ─────────────────────────────────────────────
            BARRE DE NAV BAS — mobile uniquement
        ───────────────────────────────────────────── */}
        <nav className="lg:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-inset-bottom">
          <div className="flex items-stretch h-16">
            {menuItems.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                    active ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                  <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-green-600' : 'text-gray-400'}`}>
                    {label}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 w-8 h-0.5 bg-green-500 rounded-full" />
                  )}
                </button>
              );
            })}
            {/* Bouton logout dans la bottom nav */}
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-14 flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-red-400 transition-colors border-l border-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Exit</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
