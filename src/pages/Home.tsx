import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, BarChart3, FileText, Users,
  TrendingUp, Shield, ChevronRight, Star, Play,
  Send, Mail, MessageSquare, Search, Lightbulb,
  Home as HomeIcon, MapPin,
  Flame, Cpu, Wind, Layers, Sun, Droplets, ShieldCheck, Plus,
  Info, ChevronDown, Grid2X2, Handshake, Gauge, X
} from 'lucide-react';
import { AiLoader } from '../components/ui/ai-loader';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';
import Logo from '../components/Logo';

const homeFaqs = [
  { question: 'Qu\'est-ce qu\'Optee ?', answer: 'Optee est une plateforme qui automatise l\'analyse et la planification de la rénovation énergétique des bâtiments professionnels. En 30 secondes, identifiez tous les travaux possibles, les aides financières et le ROI de chaque opération.' },
  { question: 'Quels bâtiments peut analyser Optee ?', answer: 'Optee couvre l\'ensemble des bâtiments tertiaires : bureaux, commerces, hôtels, établissements de santé, bâtiments d\'enseignement et sites industriels. Nous disposons de données sur plus de 5 millions de bâtiments en France.' },
  { question: 'Quelles aides financières sont identifiées ?', answer: 'Optee identifie toutes les aides disponibles : Certificats d\'Économie d\'Énergie (CEE), MaPrimeRénov\', Fonds Chaleur ADEME, aides régionales et locales, et dispositifs fiscaux.' },
  { question: 'La plateforme est-elle gratuite ?', answer: 'Optee propose une découverte gratuite permettant d\'analyser un premier bâtiment. Pour un usage professionnel sur l\'ensemble de votre parc, des formules adaptées sont disponibles. Contactez-nous pour un devis personnalisé.' },
];

const benefits = [
  { icon: Building2, title: 'Analyse automatique', description: 'Renseignez une adresse et obtenez instantanément un diagnostic complet du bâtiment.' },
  { icon: BarChart3, title: 'Travaux prioritaires', description: 'Identifiez les opérations les plus rentables grâce à notre moteur d\'analyse.' },
  { icon: TrendingUp, title: 'Aides & économies', description: 'Estimez précisément les aides financières et les économies d\'énergie réalisables.' },
  { icon: FileText, title: 'Briefs techniques', description: 'Générez automatiquement des cahiers des charges prêts à envoyer.' },
  { icon: Users, title: 'Appels d\'offres simplifiés', description: 'Lancez vos consultations auprès d\'entreprises qualifiées en quelques clics.' },
  { icon: Shield, title: 'Données fiables', description: 'Des données bâtimentaires certifiées et mises à jour en temps réel.' },
];

const steps = [
  { step: '01', title: 'Ciblez vos prospects', description: 'Definissez vos preferences clients par IA ou manuellement avec nos filtres pour cibler precisement les batiments, entreprises et decideurs que vous souhaitez prospecter.' },
  { step: '02', title: 'L\'IA analyse et contacte', description: 'Notre IA identifie les meilleures opportunites, redige des messages personnalises et demarche vos prospects de maniere proactive.' },
  { step: '03', title: 'Convertissez sans effort', description: 'Recevez des leads qualifies, suivez les conversations en temps reel et concluez vos projets plus rapidement.' },
];

const testimonials = [
  { name: 'Marie Dupont', role: 'Directrice Asset Management', company: 'Nexity', text: 'Optee nous a permis de diviser par 4 le temps d\'analyse de notre parc. Les recommandations sont précises et actionnables immédiatement.' },
  { name: 'Thomas Laurent', role: 'Responsable Développement Durable', company: 'Gecina', text: 'La plateforme est d\'une simplicité remarquable. En quelques clics, nous avons une vision claire des priorités de rénovation.' },
  { name: 'Sophie Martin', role: 'Bureau d\'études thermiques', company: 'BET Énergie+', text: 'Les briefs techniques générés automatiquement sont d\'une qualité professionnelle. Un gain de temps considérable pour nos équipes.' },
];

const testimonials2 = [
  { name: 'Pierre Delmas', role: 'Directeur Technique', company: 'Nexity', text: "En 30 minutes de démo, on a identifié plus de 180 000€ d'aides mobilisables. On a signé dans la semaine." },
  { name: 'Sophie Laurent', role: 'Asset Manager', company: 'Icade', text: "Ce qui nous prenait 3 semaines d'audit se fait en 30 secondes. Optee a transformé notre façon de travailler." },
  { name: 'Marc Arnaud', role: 'Responsable Patrimoine', company: 'Vinci', text: "120 chantiers structurés simultanément. Le tableau de bord est un vrai game changer pour notre équipe." },
  { name: 'Julie Renaud', role: 'Directrice Patrimoine', company: 'Sogeprom', text: "98 000€ de CEE sur un seul immeuble de bureaux. Le ROI a été atteint en 18 mois. Résultat inespéré." },
];

const stats = [
  { value: '3 500+', label: 'Projets lancés' },
  { value: '850M€', label: 'Travaux identifiés' },
  { value: '45%', label: 'Économies moyennes' },
  { value: '2 min', label: 'Temps d\'analyse' },
];

const partnerLogos = [
  <svg key="nexity" height="28" viewBox="0 0 130 40" fill="none" className="h-8 max-w-full"><rect width="6" height="40" rx="3" fill="#E30613" /><text x="14" y="29" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" fill="currentColor" letterSpacing="-0.5">NEXITY</text></svg>,
  <svg key="bouygues" height="36" viewBox="0 0 210 44" fill="none" className="h-10 max-w-full"><circle cx="16" cy="22" r="14" fill="#009fe3" /><circle cx="16" cy="22" r="8" fill="#fff" /><circle cx="16" cy="22" r="4" fill="#009fe3" /><text x="38" y="18" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="currentColor">BOUYGUES</text><text x="38" y="34" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="11" fill="currentColor" letterSpacing="1">IMMOBILIER</text></svg>,
  <svg key="vinci" height="36" viewBox="0 0 180 44" fill="none" className="h-10 max-w-full"><polygon points="0,42 16,2 32,42" fill="#ffcc00" /><text x="40" y="28" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="20" fill="currentColor">VINCI</text><text x="40" y="42" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="11" fill="currentColor" letterSpacing="1">IMMOBILIER</text></svg>,
  <svg key="icade" height="28" viewBox="0 0 110 40" fill="none" className="h-8 max-w-full"><rect x="0" y="8" width="5" height="24" rx="2.5" fill="#00a651" /><rect x="8" y="0" width="5" height="40" rx="2.5" fill="#00a651" /><text x="20" y="28" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" fill="currentColor">ICADE</text></svg>,
  <svg key="sogeprom" height="36" viewBox="0 0 210 44" fill="none" className="h-10 max-w-full"><rect width="38" height="38" rx="8" fill="#e2001a" y="3" /><text x="9" y="29" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="17" fill="#fff">SG</text><text x="46" y="27" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="19" fill="currentColor">SOGEPROM</text></svg>,
  <svg key="kaufman" height="36" viewBox="0 0 200 44" fill="none" className="h-10 max-w-full"><rect width="38" height="38" rx="5" fill="#003087" y="3" /><text x="7" y="28" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="16" fill="#fff">K&B</text><text x="46" y="20" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="currentColor">KAUFMAN</text><text x="46" y="35" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="11" fill="currentColor">&amp; BROAD</text></svg>,
  <svg key="altarea" height="28" viewBox="0 0 150 40" fill="none" className="h-8 max-w-full"><polygon points="20,2 38,40 2,40" fill="#e63c21" /><text x="46" y="28" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="20" fill="currentColor">ALTAREA</text></svg>,
  <svg key="gecina" height="28" viewBox="0 0 130 40" fill="none" className="h-8 max-w-full"><circle cx="16" cy="20" r="15" fill="#1b3a6b" /><text x="7" y="25" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="13" fill="#fff">G</text><text x="36" y="27" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="19" fill="currentColor">GECINA</text></svg>,
];

const manualCategories = [
  { id: 'all', label: 'Toutes', icon: Grid2X2 },
  { id: 'accompagnement', label: 'Accompagn...', icon: Handshake },
  { id: 'audit', label: 'Audit & Diag.', icon: Gauge },
  { id: 'chauffage', label: 'Chauffage', icon: Flame },
  { id: 'domotique', label: 'Domotique', icon: Cpu },
  { id: 'eclairage', label: 'Éclairage', icon: Lightbulb },
  { id: 'ventilation', label: 'Ventilation', icon: Wind },
  { id: 'isolation', label: 'Isolation', icon: Layers },
  { id: 'solaire', label: 'Syst. solaire', icon: Sun },
  { id: 'eau', label: 'Gestion eau', icon: Droplets },
  { id: 'securite', label: 'Sécurité', icon: ShieldCheck },
  { id: 'structure', label: 'Structure', icon: HomeIcon },
];

const manualOperations = [
  { category: 'chauffage', title: "Réglage des organes d'équilibrages", address: '28 Avenue Anatole France 93600 Aulnay-sous-Bois', icon: Flame, cost: '1 730 €', grant: '1 730 €', roi: '10 %', status: 'immédiat', insight: 'Équilibrage rapide: petit budget, impact immédiat sur les pertes réseau.' },
  { category: 'chauffage', title: "Réglage des organes d'équilibrages", address: '24 Rue Lepic 75018 Paris', icon: Flame, cost: '690 €', grant: '690 €', roi: '10 %', status: 'immédiat', insight: 'Opération courte à lancer: 100% estimé couvert par les aides.' },
  { category: 'eclairage', title: 'Installation LED', address: '8 Rue de Tocqueville 75017 Paris', icon: Lightbulb, cost: '1 510 €', grant: '1 510 €', roi: '10 %', status: 'immédiat', insight: 'Relamping simple: idéal pour créer une première accroche commerciale.' },
  { category: 'chauffage', title: 'Isolation de points singuliers en chaufferie', address: '155 Avenue Pierre Brossolette 94170 Le Perreux-sur-Marne', icon: Flame, cost: '546 €', grant: '546 €', roi: '6 %', status: 'immédiat', insight: "Action très accessible: bonne porte d'entrée pour ouvrir le dossier travaux." },
  { category: 'chauffage', title: "Réglage des organes d'équilibrages", address: '155 Avenue Pierre Brossolette 94170 Le Perreux-sur-Marne', icon: Flame, cost: '675 €', grant: '675 €', roi: '10 %', status: 'immédiat', insight: 'Même site, seconde opportunité: à grouper pour augmenter le panier.' },
  { category: 'eclairage', title: 'Installation LED', address: '85 Rue de Monceau 75008 Paris', icon: Lightbulb, cost: '1 750 €', grant: '1 750 €', roi: '10 %', status: 'immédiat', insight: 'Signal fort: adresse premium, opération lisible et financement clair.' },
  { category: 'isolation', title: 'Isolation du réseau (calorifugeage)', address: '87 Avenue Jean Jaurès 93300 Paris', icon: Layers, cost: '24 370 €', grant: '24 370 €', missing: true, insight: 'Il manque la conso/m²: une donnée à demander pour verrouiller le ROI.' },
  { category: 'isolation', title: 'Isolation de points singuliers en chaufferie', address: '87 Avenue Jean Jaurès 93300 Paris', icon: Layers, cost: '6 500 €', grant: '6 500 €', missing: true, insight: "Bonne piste, mais l'estimation gagne à être confirmée avec les consommations." },
  { category: 'eclairage', title: 'Installation LED', address: '87 Avenue Jean Jaurès 93300 Paris', icon: Lightbulb, cost: '7 920 €', grant: '7 920 €', missing: true, insight: 'Potentiel intéressant: compléter la donnée manquante avant priorisation.' },
  { category: 'audit', title: 'Audit énergétique ciblé', address: '12 Rue de la Paix 75002 Paris', icon: Gauge, cost: '3 200 €', grant: '1 600 €', roi: '8 %', status: '30 j', insight: 'Audit utile pour transformer une intuition en plan travaux défendable.' },
  { category: 'domotique', title: 'Installation GTB légère', address: '1 Place des Saisons 92400 Courbevoie', icon: Cpu, cost: '18 900 €', grant: '9 450 €', roi: '14 %', status: '90 j', insight: 'GTB = bon levier pour piloter plusieurs lots depuis un seul tableau de bord.' },
  { category: 'ventilation', title: 'Optimisation ventilation parking', address: '42 Avenue de Friedland 75008 Paris', icon: Wind, cost: '8 400 €', grant: '4 200 €', roi: '11 %', status: '45 j', insight: 'Réglage technique discret, mais souvent très rentable sur les grands volumes.' },
  { category: 'solaire', title: 'Étude photovoltaïque toiture', address: '16 Rue des Archives 75004 Paris', icon: Sun, cost: '12 600 €', grant: '3 800 €', roi: '9 %', status: '60 j', insight: 'À tester si la toiture est exploitable: bon sujet pour créer une projection.' },
  { category: 'eau', title: 'Détection intelligente de fuites', address: '31 Rue de Rennes 75006 Paris', icon: Droplets, cost: '4 900 €', grant: '2 100 €', roi: '7 %', status: '30 j', insight: 'Petit lot rassurant: faible friction, bénéfice mesurable rapidement.' },
  { category: 'securite', title: 'Mise en sécurité électrique', address: '5 Boulevard Haussmann 75009 Paris', icon: ShieldCheck, cost: '15 400 €', grant: '5 900 €', roi: '5 %', status: 'audit' , insight: 'À prioriser si conformité en jeu: argument de risque plus que pur ROI.' },
  { category: 'structure', title: 'Réfection étanchéité toiture', address: '73 Avenue Parmentier 75011 Paris', icon: HomeIcon, cost: '32 800 €', grant: '8 200 €', roi: '6 %', status: '120 j', insight: 'Travaux lourds: parfait à coupler avec isolation ou solaire si possible.' },
  { category: 'accompagnement', title: 'AMO montage aides CEE', address: '19 Rue Nationale 92100 Boulogne-Billancourt', icon: Handshake, cost: '2 800 €', grant: '2 800 €', roi: '12 %', status: 'immédiat', insight: 'Accompagnement malin: sécurise le dossier avant engagement des travaux.' },
];

const infoNudgePositions = ['operation', 'score', 'grant', 'impact'];

function InfoNudge({ text, align = 'right' }: { text: string; align?: 'left' | 'right' }) {
  return (
    <span className="group/nudge relative inline-flex align-middle">
      <span className="flex h-5 w-5 animate-pulse items-center justify-center rounded-full border border-accent-200 bg-white text-[11px] font-black text-accent-700 shadow-[0_0_16px_rgba(51,112,255,0.24)] transition-transform hover:scale-110">
        i
      </span>
      <span className={`pointer-events-none absolute top-1/2 z-30 w-[190px] -translate-y-1/2 rounded-xl border border-accent-100 bg-white px-3 py-2 text-left opacity-0 shadow-[0_16px_36px_rgba(11,29,78,0.18)] transition-all duration-200 group-hover/nudge:opacity-100 ${
        align === 'left'
          ? 'right-7 translate-x-2 group-hover/nudge:translate-x-0'
          : 'left-7 -translate-x-2 group-hover/nudge:translate-x-0'
      }`}>
        <span className="block text-[10px] font-black uppercase tracking-[0.08em] text-green-700">À savoir</span>
        <span className="mt-1 block text-[12px] font-semibold leading-snug text-navy-700">{text}</span>
      </span>
    </span>
  );
}

export default function Home() {
  const [prospectionMode, setProspectionMode] = useState<'manuel' | 'ia'>('ia');
  const [activeManualCategory, setActiveManualCategory] = useState('all');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const filteredManualOperations = activeManualCategory === 'all'
    ? manualOperations
    : manualOperations.filter((operation) => operation.category === activeManualCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  return (
    <>
      <SEO
        canonical="/"
        title="Performance énergétique réinventée"
        description="Optee analyse vos bâtiments professionnels en 30 secondes : travaux prioritaires, aides CEE et MaPrimeRénov', conformité Décret Tertiaire. Diagnostic gratuit."
        faqs={homeFaqs}
      />
      <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500 rounded-full filter blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Performance<br />
                énergétique.<br />
                <span className="text-green-400">Réinventée.</span>
              </h1>
              <p className="text-lg text-navy-200 leading-relaxed mb-8 max-w-lg">
                En 30 secondes, identifiez tous les travaux possibles sur vos bâtiments. Sans audit. Sans engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/estimer-mon-projet" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-semibold rounded-full hover:bg-green-600 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5">
                  Estimer mon projet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/solutions" className="inline-flex items-center justify-center gap-2 px-6 py-4 text-white/90 font-medium rounded-full hover:text-white hover:bg-white/10 transition-all duration-200">
                  <Play className="w-5 h-5" />
                  Voir la demo
                </Link>
              </div>
            </div>

            {/* ── HERO IMAGE (desktop) ── */}
            <div className="hidden lg:flex flex-col items-center animate-slide-up">

              {/* Cadre avec profondeur — cohérent avec la charte navy/vert du site */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#162040] via-[#0e1830] to-[#080f22] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] p-5">

                {/* Reflet subtil en haut du cadre */}
                <div className="pointer-events-none absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                {/* Halo vert bas-droite — rappel de l'accent chromatique du site */}
                <div className="pointer-events-none absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-green-500/[0.07] blur-3xl" />

                {/* Image */}
                <img
                  src="https://ruoodtssiwpthajpublt.supabase.co/storage/v1/object/public/Images%20du%20site/Photo-accueil%20-%20copie.webp"
                  alt="Analyse énergétique bâtiment Optee"
                  className="relative z-10 w-full h-auto object-contain"
                  draggable={false}
                />

                {/* Boutons — bas-droite du cadre */}
                <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-2 items-end">
                  <Link
                    to="/solutions"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-md border border-white/[0.15] text-white text-sm font-semibold rounded-full hover:bg-white/[0.14] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                  >
                    Voir le plan d&apos;actions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/estimer-mon-projet"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-green-500/30"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Analyse compl&egrave;te
                  </Link>
                </div>
              </div>
            </div>

            {/* ── HERO IMAGE (mobile) ── */}
            <div className="block lg:hidden mt-8 animate-fade-in">
              <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden bg-gradient-to-br from-[#162040] to-[#080f22] border border-white/[0.07] shadow-[0_16px_48px_rgba(0,0,0,0.5)] p-4">
                <div className="pointer-events-none absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
                <div className="pointer-events-none absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-green-500/[0.07] blur-2xl" />
                <img
                  src="https://ruoodtssiwpthajpublt.supabase.co/storage/v1/object/public/Images%20du%20site/Photo-accueil%20-%20copie.webp"
                  alt="Analyse énergétique bâtiment Optee"
                  className="relative z-10 w-full h-auto object-contain"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="bg-navy-50 py-20 lg:py-24 border-b border-navy-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200 rounded-full filter blur-[150px] transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative reveal">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-semibold text-sm rounded-full mb-4">
              Produit
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
              Voyez Optee en action.
            </h2>
            <p className="text-lg text-navy-600 max-w-2xl mx-auto">
              30 secondes pour analyser un bâtiment. Une vidéo parle plus que des mots.
            </p>
          </div>
          
          <div className="relative mx-auto rounded-xl animate-slide-up shadow-2xl overflow-hidden bg-navy-900 w-full" style={{ paddingBottom: 'calc(59.90566037735849% + 41px)' }}>
            {/* macOS Chrome Header */}
            <div className="absolute top-0 left-0 right-0 h-[41px] bg-[#2d3748] flex items-center px-4 border-b border-white/10 z-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="mx-auto bg-black/20 text-white/70 text-xs px-4 py-1 rounded-md max-w-xs w-full text-center truncate">
                app.optee.io — Démo interactive
              </div>
              <div className="w-[52px]" /> {/* Spacer to balance dots */}
            </div>
            
            {/* Arcade Iframe */}
            <iframe 
              className="absolute top-[41px] left-0 w-full h-[calc(100%-41px)]"
              src="https://demo.arcade.software/pcTKpp7ovPp3XSo2QZLc?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=false" 
              allowFullScreen 
              allow="clipboard-write"
              frameBorder="0" 
              loading="lazy" 
              title="Optee interactive demo">
            </iframe>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 reveal">
          <p className="text-center text-navy-500 text-sm font-medium mb-8">
            Plus de 3 500 projets lances avec Optee
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-sm text-navy-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Logos Clients - ProjetA style */}
      <div className="bg-white border-b border-navy-100 py-12 overflow-hidden">
        <p className="text-center text-navy-500 text-sm font-medium mb-8">Ils nous font déjà confiance</p>
        <div className="relative w-full">
          <div className="flex animate-marquee gap-16 px-8 w-fit">
            {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
              <div key={`logo-top-${idx}`} className="flex-shrink-0 grayscale opacity-50 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer">
                {logo}
              </div>
            ))}
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-navy-950 via-[#0a1628] to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full filter blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Toggle Manuel / IA */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-1 shadow-lg">
              <button
                onClick={() => setProspectionMode('manuel')}
                className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  prospectionMode === 'manuel'
                    ? 'bg-green-500 text-navy-950 shadow-lg shadow-green-500/30'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2 -mt-0.5" />
                Mode Manuel
              </button>
              <button
                onClick={() => setProspectionMode('ia')}
                className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  prospectionMode === 'ia'
                    ? 'bg-green-500 text-navy-950 shadow-lg shadow-green-500/30'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4 inline mr-2 -mt-0.5" />
                Mode IA
              </button>
            </div>
          </div>

          {prospectionMode === 'manuel' ? (
            /* ========== MODE MANUEL ========== */
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                  Prospectez par{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300">filtres intelligents.</span>
                </h2>
                <p className="text-lg text-navy-300 leading-relaxed max-w-2xl mx-auto">
                  Sélectionnez manuellement vos critères pour identifier les meilleurs prospects et générer des plans de travaux sur mesure avec estimations des subventions et ROI.
                </p>
              </div>

              <div className="relative mx-auto max-w-[1180px] rounded-[14px] sm:rounded-[18px] bg-[#eef2ff]/90 p-1.5 sm:p-3 shadow-[0_16px_48px_rgba(0,0,0,0.22)] sm:shadow-[0_32px_90px_rgba(0,0,0,0.32)] ring-1 ring-white/25">
                <div className="overflow-hidden rounded-[10px] sm:rounded-[14px] bg-white shadow-xl sm:shadow-2xl ring-1 ring-[#d9e2ff]">
                  <div className="flex h-9 sm:h-11 items-center gap-2 sm:gap-3 border-b border-[#dce4f7] bg-[#f7f9ff] px-3 sm:px-4">
                    <div className="flex gap-1.5 sm:gap-2">
                      <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ffbd2e]" />
                      <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="mx-auto hidden min-w-0 items-center rounded-md border border-[#d9e2ff] bg-white px-4 py-1 text-xs font-semibold text-navy-500 sm:flex">
                      app.optee.io/prospection/manuelle
                    </div>
                    <div className="hidden sm:block w-[52px]" />
                    <p className="block sm:hidden ml-auto text-[10px] font-semibold text-navy-400 truncate">app.optee.io/prospection</p>
                  </div>

                  {/* ── TABLE DESKTOP (sm+) ── */}
                  <div className="hidden sm:block overflow-x-auto">
                    <div className="min-w-[1060px]">
                      <div className="grid grid-cols-12 gap-5 border-b border-[#edf1fa] px-6 py-5">
                        {manualCategories.map((category) => {
                          const Icon = category.icon;
                          const isActive = activeManualCategory === category.id;
                          return (
                            <button
                              key={category.id}
                              onClick={() => setActiveManualCategory(category.id)}
                              className={`flex flex-col items-center gap-2 transition-colors hover:text-accent-700 ${
                                isActive ? 'text-accent-700' : 'text-navy-900'
                              }`}
                              aria-pressed={isActive}
                            >
                              <Icon className="h-6 w-6 stroke-[1.9]" />
                              <span className={`whitespace-nowrap border-b-[3px] px-1 pb-1 text-[12px] font-semibold leading-none transition-colors ${
                                isActive ? 'border-accent-700 text-accent-700' : 'border-navy-900'
                              }`}>
                                {category.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-[2.1fr_0.7fr_1.1fr_1.15fr_1.25fr_1.25fr_0.75fr] items-center border-b border-[#dbe2f2] px-6 py-4 text-[13px] font-semibold text-navy-300">
                        <span>Type d'opération</span>
                        <span className="flex items-center gap-2 text-accent-700">Score <ChevronDown className="h-4 w-4" /></span>
                        <span>Coût</span>
                        <span>Subventions</span>
                        <span>Reste à charge</span>
                        <span>Impact/ROI</span>
                        <span className="text-center">Actions</span>
                      </div>

                      <div className="h-[430px] overflow-y-auto border-l-[4px] border-accent-700 [scrollbar-color:#8ea6ff_#edf1fa] [scrollbar-width:thin]">
                        {filteredManualOperations.map((operation, operationIndex) => {
                          const Icon = operation.icon;
                          const nudgePosition = infoNudgePositions[operationIndex];
                          return (
                            <div key={`${operation.title}-${operation.address}-${operation.cost}`} className="group/row relative grid min-h-[82px] grid-cols-[2.1fr_0.7fr_1.1fr_1.15fr_1.25fr_1.25fr_0.75fr] items-center border-b border-[#dbe2f2] px-3 py-3 text-navy-900 transition-colors hover:bg-[#f8fbff]">
                              <div className="min-w-0">
                                <div className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[#8ea6ff] bg-[#eef3ff] px-2 py-1 text-[13px] font-bold text-accent-700">
                                  <Icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">{operation.title}</span>
                                </div>
                                <div className="mt-2 flex min-w-0 items-center gap-2">
                                  <p className="truncate text-[12px] font-semibold text-navy-300">{operation.address}</p>
                                  {nudgePosition === 'operation' && (
                                    <InfoNudge text="Cette ligne est une opportunité concrète: opération, adresse et financement sont déjà pré-remplis." />
                                  )}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_0_22px_rgba(45,216,125,0.24)] ring-[5px] ring-green-300">
                                    <span className="text-[12px] font-bold text-accent-700">100</span>
                                  </div>
                                  {nudgePosition === 'score' && (
                                    <InfoNudge text="Score 100: cette opération coche les critères prioritaires pour passer vite à l'action." />
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="text-[15px] font-bold text-navy-950">{operation.cost}</p>
                                <p className="text-[12px] font-semibold text-navy-300">Estimation</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-[15px] font-bold text-green-700">{operation.grant}</p>
                                  {nudgePosition === 'grant' && (
                                    <InfoNudge text="Le montant vert indique l'aide estimée: parfait pour ouvrir une discussion orientée budget." />
                                  )}
                                </div>
                                <p className="text-[12px] font-semibold text-navy-300">Estimation</p>
                              </div>

                              <div>
                                <p className="text-[15px] font-bold text-navy-950">0 €</p>
                                <p className="text-[12px] font-semibold text-navy-300">Estimation</p>
                              </div>

                              <div>
                                {operation.missing ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-[170px] rounded-lg bg-[#f3f5fb] px-4 py-3 text-center">
                                      <p className="text-[11px] font-semibold text-accent-700">Donnée manquante:</p>
                                      <p className="text-[14px] font-black text-accent-700">Conso/m²</p>
                                    </div>
                                    {nudgePosition === 'impact' && (
                                      <InfoNudge text="Une donnée manque: demandez la conso/m² et le ROI pourra être recalculé." align="left" />
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="inline-flex overflow-hidden rounded-full border border-green-300 bg-green-100 text-[13px] font-black text-green-700">
                                      <span className="bg-white/70 px-3 py-1">{operation.roi}</span>
                                      <span className="px-3 py-1">{operation.status}</span>
                                    </div>
                                    {nudgePosition === 'impact' && (
                                      <InfoNudge text="Le badge résume le potentiel: rendement à gauche, délai ou priorité à droite." align="left" />
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="relative flex items-center justify-center gap-2">
                                <div className="pointer-events-none absolute right-[76px] top-1/2 z-20 w-[220px] -translate-y-1/2 translate-x-2 rounded-xl border border-accent-100 bg-white px-4 py-3 text-left opacity-0 shadow-[0_18px_40px_rgba(11,29,78,0.16)] transition-all duration-200 group-hover/row:translate-x-0 group-hover/row:opacity-100">
                                  <div className="absolute right-[-6px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-accent-100 bg-white" />
                                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-green-700">Piste Optee</p>
                                  <p className="mt-1 text-[12px] font-semibold leading-snug text-navy-700">{operation.insight}</p>
                                </div>
                                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7e1ff] bg-white text-accent-700 transition-all hover:scale-105 hover:border-accent-600 hover:bg-accent-50 group-hover/row:border-accent-600 group-hover/row:bg-accent-50" aria-label="Voir les détails">
                                  <Info className="h-4 w-4" />
                                </button>
                                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-700 text-white shadow-lg shadow-accent-700/20 transition-colors hover:bg-accent-600" aria-label="Ajouter l'opération">
                                  <Plus className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {filteredManualOperations.length === 0 && (
                          <div className="px-6 py-10 text-center">
                            <p className="text-sm font-bold text-navy-900">Aucune opération dans cette catégorie.</p>
                            <p className="mt-1 text-xs font-semibold text-navy-300">Cliquez sur "Toutes" pour revenir à la liste complète.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── VUE MOBILE (< sm) ── */}
                  <div className="block sm:hidden">
                    {/* Catégories — scroll horizontal en pills */}
                    <div className="flex gap-2 overflow-x-auto border-b border-[#edf1fa] px-4 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {manualCategories.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeManualCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setActiveManualCategory(category.id)}
                            className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                              isActive
                                ? 'border-accent-700 bg-accent-700 text-white'
                                : 'border-[#d9e2ff] text-navy-900 bg-white'
                            }`}
                            aria-pressed={isActive}
                          >
                            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                            {category.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Cartes opérations */}
                    <div className="divide-y divide-[#edf1fa] overflow-y-auto max-h-[520px] border-l-[3px] border-accent-700 [scrollbar-width:thin]">
                      {filteredManualOperations.map((operation) => {
                        const Icon = operation.icon;
                        return (
                          <div key={`mobile-${operation.title}-${operation.address}`} className="px-4 py-4">
                            {/* En-tête carte : badge opération + score */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="min-w-0 flex-1">
                                <div className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[#8ea6ff] bg-[#eef3ff] px-2 py-1 text-[12px] font-bold text-accent-700 mb-1.5">
                                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{operation.title}</span>
                                </div>
                                <p className="text-[11px] font-semibold text-navy-300 truncate">{operation.address}</p>
                              </div>
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_18px_rgba(45,216,125,0.22)] ring-[4px] ring-green-300">
                                <span className="text-[11px] font-bold text-accent-700">100</span>
                              </div>
                            </div>

                            {/* Montants */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="rounded-lg bg-[#f7f9ff] px-2 py-2 text-center">
                                <p className="text-[10px] font-semibold text-navy-300 mb-0.5">Coût</p>
                                <p className="text-[13px] font-bold text-navy-950">{operation.cost}</p>
                              </div>
                              <div className="rounded-lg bg-[#f0faf4] px-2 py-2 text-center">
                                <p className="text-[10px] font-semibold text-navy-300 mb-0.5">Subvention</p>
                                <p className="text-[13px] font-bold text-green-700">{operation.grant}</p>
                              </div>
                              <div className="rounded-lg bg-[#f7f9ff] px-2 py-2 text-center">
                                <p className="text-[10px] font-semibold text-navy-300 mb-0.5">Reste</p>
                                <p className="text-[13px] font-bold text-navy-950">0 €</p>
                              </div>
                            </div>

                            {/* ROI + boutons */}
                            <div className="flex items-center justify-between gap-2">
                              {operation.missing ? (
                                <div className="rounded-lg bg-[#f3f5fb] px-3 py-1.5 flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-accent-700 truncate">Donnée manquante: Conso/m²</p>
                                </div>
                              ) : (
                                <div className="inline-flex overflow-hidden rounded-full border border-green-300 bg-green-100 text-[12px] font-black text-green-700">
                                  <span className="bg-white/70 px-2.5 py-1">{operation.roi}</span>
                                  <span className="px-2.5 py-1">{operation.status}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d7e1ff] bg-white text-accent-700 transition-colors active:bg-accent-50"
                                  aria-label="Voir les détails"
                                >
                                  <Info className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-700 text-white shadow-md shadow-accent-700/25 transition-colors active:bg-accent-600"
                                  aria-label="Ajouter l'opération"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Insight Optee */}
                            <div className="mt-3 rounded-lg bg-gradient-to-r from-green-50 to-[#f0f7ff] border border-green-100 px-3 py-2">
                              <p className="text-[9px] font-black uppercase tracking-[0.08em] text-green-700 mb-0.5">Piste Optee</p>
                              <p className="text-[11px] font-semibold leading-snug text-navy-700">{operation.insight}</p>
                            </div>
                          </div>
                        );
                      })}
                      {filteredManualOperations.length === 0 && (
                        <div className="px-6 py-10 text-center">
                          <p className="text-sm font-bold text-navy-900">Aucune opération dans cette catégorie.</p>
                          <p className="mt-1 text-xs font-semibold text-navy-300">Appuyez sur "Toutes" pour revenir à la liste complète.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========== MODE IA ========== */
            <div className="animate-fade-in">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                    L'IA qui prospecte{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300">a votre place.</span>
                  </h2>

                  <p className="text-lg text-navy-300 leading-relaxed mb-8 max-w-lg">
                    Notre IA apprend votre entreprise, vos preferences clients, vos cibles ideales. Elle identifie les leads les plus pertinents, analyse leur contexte et redige des emails sur-mesure pour demarcher a votre place.
                  </p>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Send className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">Demarchage proactif</p>
                        <p className="text-navy-400 text-sm leading-relaxed">L'IA contacte automatiquement les prospects que nous identifions, au bon moment, avec le bon message.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">Emails ultra-personnalises</p>
                        <p className="text-navy-400 text-sm leading-relaxed">Chaque message est calibre selon le profil du prospect, son batiment et les opportunites detectees.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">Conversations intelligentes</p>
                        <p className="text-navy-400 text-sm leading-relaxed">L'IA engage et maintient le dialogue avec vos leads jusqu'a la prise de rendez-vous qualifie.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative flex items-center gap-6">
                    <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 to-cyan-500/10 rounded-full filter blur-[60px]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <AiLoader size={160} text="Prospecting" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="opacity-0 animate-cardReveal1">
                        <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-lg">
                          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-3.5 h-3.5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white text-[11px] font-medium leading-tight">Nexity - Paris 8e</p>
                            <p className="text-green-400 text-[10px]">Score 94%</p>
                          </div>
                        </div>
                      </div>

                      <div className="opacity-0 animate-cardReveal2">
                        <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-lg">
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white text-[11px] font-medium leading-tight">Email envoye</p>
                            <p className="text-blue-400 text-[10px]">Ouvert il y a 2min</p>
                          </div>
                        </div>
                      </div>

                      <div className="opacity-0 animate-cardReveal3">
                        <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-lg">
                          <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-white text-[11px] font-medium leading-tight">Gecina - La Defense</p>
                            <p className="text-cyan-400 text-[10px]">RDV confirme</p>
                          </div>
                        </div>
                      </div>

                      <div className="opacity-0 animate-cardReveal4">
                        <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-lg">
                          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white text-[11px] font-medium leading-tight">BET Energie+</p>
                            <p className="text-green-400 text-[10px]">Reponse recue</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======== SPLITS: Diagnostic DPE, Financement, Marketplace (ProjetA) ======== */}
      <section className="bg-white">
        {/* Split 1 — DPE Diagnostic */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="reveal-left">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-semibold text-sm rounded-full mb-4">
                Diagnostic
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-6">
                Votre DPE, optimisé automatiquement.
              </h2>
              <p className="text-navy-600 text-lg leading-relaxed mb-6">
                Optee croise 150+ données officielles pour simuler votre DPE actuel et calculer le scénario de rénovation optimal selon votre budget.
              </p>
              <Link to="/solutions" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors">
                Tester gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="reveal-right">
              <div className="bg-navy-50 rounded-2xl p-6 sm:p-8 border border-navy-100">
                <p className="text-navy-500 text-sm font-semibold mb-6">Simulation DPE</p>
                <div className="space-y-3">
                  {[
                    { letter: 'G', color: '#ef4444', width: '100%', value: '450+' },
                    { letter: 'F', color: '#f97316', width: '82%', value: '331' },
                    { letter: 'E', color: '#eab308', width: '64%', value: '251' },
                    { letter: 'D', color: '#84cc16', width: '46%', value: '181' },
                    { letter: 'C', color: '#22c55e', width: '30%', value: '91' },
                  ].map((item) => (
                    <div key={item.letter} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: item.color }}>{item.letter}</div>
                      <div className="flex-1 h-3 bg-navy-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: item.width, background: item.color }} />
                      </div>
                      <span className="text-navy-600 text-sm font-medium w-12 text-right">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: '#1aab6d', boxShadow: '0 0 14px rgba(26,171,109,.5)' }}>B</div>
                    <div className="flex-1 h-3 bg-navy-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '16%', background: '#1aab6d' }} />
                    </div>
                    <span className="text-green-600 text-sm font-bold w-12 text-right">↑ Cible</span>
                  </div>
                </div>
                <p className="text-navy-500 text-sm mt-4">
                  Classé <strong>E</strong> actuellement. Cible atteinte : classe <strong style={{ color: '#1aab6d' }}>B</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Split 2 — Financement */}
        <div className="bg-navy-50 border-y border-navy-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="reveal-right lg:order-2">
                <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-semibold text-sm rounded-full mb-4">
                  Financement
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-6">
                  Jusqu'à 70% des travaux financés.
                </h2>
                <p className="text-navy-600 text-lg leading-relaxed mb-6">
                  CEE, MaPrimeRénov', aides locales… Optee identifie et cumule toutes les subventions mobilisables pour votre projet. En temps réel.
                </p>
                <Link to="/operations" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Voir les offres
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="reveal-left lg:order-1">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-navy-100 shadow-lg">
                  <div className="mb-6">
                    <span className="text-4xl sm:text-5xl font-bold text-green-600" id="subsidyCounter">42 000€</span>
                    <p className="text-navy-500 text-sm mt-1">de subventions mobilisables estimées</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: '💰', label: 'CEE Isolation', value: '+18 400€' },
                      { icon: '🏠', label: "MaPrimeRénov'", value: '+14 200€' },
                      { icon: '🌿', label: 'Aide Île-de-France', value: '+5 800€' },
                      { icon: '⚡', label: 'CEE Chauffage', value: '+3 600€' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-navy-100 last:border-0">
                        <span className="text-navy-700 font-medium">
                          <span className="mr-2">{item.icon}</span>{item.label}
                        </span>
                        <span className="text-green-600 font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Split 3 — Marketplace */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="reveal-left">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-semibold text-sm rounded-full mb-4">
                Marketplace
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-6">
                Lancez vos travaux en 4 étapes.
              </h2>
              <p className="text-navy-600 text-lg leading-relaxed mb-6">
                De l'analyse au chantier, Optee structure chaque étape. Brief technique, appel d'offres, entreprises RGE, suivi travaux.
              </p>
              <Link to="/marketplace" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors">
                Voir la démo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="reveal-right">
              <div className="bg-navy-50 rounded-2xl p-6 sm:p-8 border border-navy-100 space-y-5">
                {[
                  { n: '1', title: 'Analyse automatique', sub: '150+ données en 10 secondes' },
                  { n: '2', title: 'Brief technique généré', sub: 'Document complet prêt à soumettre' },
                  { n: '3', title: "Appel d'offres marketplace", sub: '500+ entreprises RGE certifiées' },
                  { n: '4', title: 'Réception & suivi travaux', sub: 'Tableau de bord temps réel' },
                ].map((step) => (
                  <div key={step.n} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-navy-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all">
                    <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center text-green-400 font-bold text-lg flex-shrink-0">
                      {step.n}
                    </div>
                    <div>
                      <p className="text-navy-900 font-semibold">{step.title}</p>
                      <p className="text-navy-500 text-sm">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Tout ce dont vous avez besoin pour rénover efficacement
            </h2>
            <p className="text-navy-600 text-lg">
              Une plateforme unique qui centralise l'analyse, la planification et l'exécution de vos projets de rénovation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-2xl p-6 border border-navy-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                  <benefit.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{benefit.title}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-2xl mx-auto mb-20 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Trois etapes pour transformer votre patrimoine
            </h2>
            <p className="text-navy-600 text-lg">
              De l'analyse à l'action, Optee vous guide à chaque étape avec précision.
            </p>
          </div>

          <div className="relative">
            {/* Redesigned Connecting Line (SVG) */}
            <div className="hidden md:block absolute top-10 left-0 w-full h-32 -z-0 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100" fill="none">
                <path 
                  d="M167 40 C 250 40, 417 10, 500 40 C 583 70, 750 40, 833 40" 
                  stroke="url(#step-gradient)" 
                  strokeWidth="2" 
                  strokeDasharray="8 6"
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="step-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
              {steps.map((item, index) => (
                <div key={item.step} className="relative group text-center reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                  {/* The "Angle" / Shape for the number */}
                  <div className="relative inline-flex items-center justify-center mb-10">
                    {/* Outer glowing ring */}
                    <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-xl group-hover:bg-green-500/30 transition-all duration-500 scale-75 group-hover:scale-110" />
                    
                    {/* The Diamond Shape */}
                    <div className="relative w-20 h-20 bg-navy-950 rotate-45 border-2 border-green-500/30 rounded-2xl shadow-2xl flex items-center justify-center group-hover:border-green-500 group-hover:scale-110 transition-all duration-500">
                      {/* The number (rotated back) */}
                      <span className="text-2xl font-black text-green-400 -rotate-45 tracking-tighter">
                        {item.step}
                      </span>
                    </div>

                    {/* Technical decorative elements */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-500/50 rounded-full" />
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-transparent group-hover:border-navy-100 group-hover:shadow-xl group-hover:shadow-navy-900/5 transition-all duration-500">
                    <h3 className="text-xl font-semibold text-navy-900 mb-4 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-navy-600 text-sm leading-relaxed max-w-[280px] mx-auto">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16 reveal">
            <Link to="/solutions" className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg shadow-green-500/25">
              Explorer la plateforme
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-navy-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ils accelerent leur renovation avec Optee
            </h2>
            <p className="text-navy-300 text-lg">
              Des centaines de professionnels de l'immobilier nous font confiance.
            </p>
          </div>
        </div>

        <div className="relative flex flex-col gap-6 overflow-x-hidden group">
          <div className="flex animate-marquee gap-6 px-3 w-fit">
            {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
              <div key={`t1-${idx}`} className="w-[320px] flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-navy-400 text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex animate-marquee-reverse gap-6 px-3 w-fit">
            {[...testimonials2, ...testimonials2, ...testimonials2].map((t, idx) => (
              <div key={`t2-${idx}`} className="w-[320px] flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-navy-400 text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      <FAQSection 
        faqs={homeFaqs} 
        title="Questions fréquentes sur Optee" 
        description="Tout ce qu'il faut savoir sur notre plateforme de rénovation énergétique."
      />

      {/* Mention Partenariat Pisteur - Bas de page avant le CTA final */}
      <section className="bg-navy-50 py-12 border-y border-navy-100 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-lg">
                  <Logo size={20} dark={false} />
                </div>
                <div className="w-12 h-12 rounded-full bg-navy-900 border-2 border-white flex items-center justify-center shadow-lg">
                  <Search className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="h-8 w-px bg-navy-200 hidden md:block" />
              <p className="text-navy-900 font-bold text-lg tracking-tight text-center md:text-left">
                Optee & Pisteur : L&apos;alliance de l&apos;IA et de la donnée terrain.
              </p>
            </div>
            <Link to="/contact" className="text-green-600 font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:text-green-700 transition-colors group">
              En savoir plus sur le partenariat
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto reveal">
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500 rounded-full filter blur-[80px]" />
            </div>
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Découvrez Optee avec un expert
              </h2>
              <p className="text-navy-200 text-lg mb-8">
                Planifiez une démonstration gratuite et découvrez les opportunités de rénovation de votre parc immobilier.
              </p>
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg shadow-green-500/25">
                Planifier une démo gratuite
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps + Business */}
      <section className="py-14 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ minHeight: '300px' }}>
              <iframe
                title="Nous trouver — Optee Paris"
                src="https://maps.google.com/maps?q=Paris,+France&hl=fr&z=13&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', position: 'absolute', inset: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="absolute bottom-4 left-4 bg-navy-950/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Optee</p>
                  <p className="text-navy-300 text-xs">Paris, France</p>
                </div>
              </div>
            </div>

            {/* Info + Google Business */}
            <div className="flex flex-col justify-center gap-6">
              <div>
                <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Où nous trouver</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Basés à Paris,<br />présents partout en France</h2>
                <p className="text-navy-300 text-base leading-relaxed">Notre équipe intervient sur l'ensemble du territoire français pour accompagner vos projets de rénovation énergétique.</p>
              </div>

              <a
                href="https://share.google/Ny1DRi8DwNTJ3IFSg"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-2xl p-5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow">
                  <svg viewBox="0 0 48 48" className="w-6 h-6">
                    <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
                    <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
                    <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.3 0-9.7-3.2-11.3-7.8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
                    <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C40.8 35.6 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Google Business</p>
                  <p className="text-white font-bold text-sm mt-0.5">Voir notre fiche & avis clients</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-navy-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </a>

              <a
                href="https://maps.google.com/maps?q=Paris,+France"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy-300 hover:text-white text-sm font-medium transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Ouvrir dans Google Maps
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Popup "Pisteur" */}
      <div className={`fixed bottom-8 left-8 z-[100] max-w-[320px] transition-all duration-700 ease-out transform ${showPopup ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-accent-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

          <div className="relative bg-white/95 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-5 shadow-[0_32px_64px_rgba(0,0,0,0.14)] overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-navy-300 hover:text-navy-950 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header : icône + Live + Pisteur en grand */}
            <div className="flex items-center gap-3 mb-0 pr-6">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-tr from-navy-950 to-navy-800 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                  <Search className="w-6 h-6 text-green-400 relative z-10" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 px-1.5 py-[2px] rounded-full bg-green-500 text-white text-[8px] font-black uppercase tracking-widest border-2 border-white shadow-md">
                  New
                </div>
              </div>
              <span className="text-2xl font-black text-navy-950 tracking-tight leading-none">Pisteur</span>
            </div>

            {/* Badge NOUVEAU */}
            <div className="flex justify-end mb-4 -mt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">Nouveau</span>
              </div>
            </div>

            <p className="text-navy-600 text-sm leading-relaxed mb-5 font-medium">
              Découvrez notre outil de prospection intelligente. <span className="text-green-600 font-bold">Essayez-le maintenant</span> et boostez vos résultats.
            </p>

            <a
              href="https://pisteur.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative flex items-center justify-center w-full px-6 py-3.5 bg-navy-950 text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-navy-900 shadow-xl shadow-navy-900/20 active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center">
                Essayer Pisteur
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
