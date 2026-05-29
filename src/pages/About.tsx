import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Linkedin, Lightbulb, Heart, Zap,
  Eye, Wrench, Rocket, TrendingUp, Star,
  Users, Building2, Leaf, MapPin, Quote,
} from 'lucide-react';
import SEO from '../components/SEO';

const timeline = [
  {
    year: '2020',
    title: 'Le déclic',
    icon: Eye,
    color: 'bg-blue-500',
    text: "Maxime Weinstein, consultant auprès d'acteurs de l'immobilier, observe chaque jour la même réalité : des gestionnaires qui veulent bien faire, mais ne savent pas par où commencer. Le Décret Tertiaire vient d'entrer en vigueur. 1,2 million de bâtiments vont devoir se transformer. Et les outils pour y arriver sont inexistants.",
  },
  {
    year: '2021',
    title: 'La construction',
    icon: Wrench,
    color: 'bg-orange-500',
    text: "Plutôt que de continuer à constater, Maxime s'associe à Mourad Bani. Ensemble, ils passent deux ans avec des bureaux d'études, des gestionnaires d'actifs et le CSTB pour concevoir un outil ancré dans la réalité du terrain — loin des logiciels pensés par des ingénieurs pour des ingénieurs.",
  },
  {
    year: '2022',
    title: 'Le lancement',
    icon: Rocket,
    color: 'bg-purple-500',
    text: "Optee sort de l'incubateur du CSTB avec une conviction : automatiser ce qui prenait des mois d'audit manuel. La plateforme analyse n'importe quel bâtiment professionnel en 30 secondes. Les premiers clients valident immédiatement — le marché attendait cet outil.",
  },
  {
    year: '2023',
    title: "L'accélération",
    icon: TrendingUp,
    color: 'bg-indigo-500',
    text: "Grandes foncières, syndics de copropriété et collectivités rejoignent la plateforme. Optee devient progressivement la référence pour analyser, planifier et financer la rénovation énergétique des bâtiments professionnels en France.",
  },
  {
    year: "Aujourd'hui",
    title: 'Une mission qui dure',
    icon: Star,
    color: 'bg-green-500',
    text: "Plus de 175 clients font confiance à Optee pour piloter leur transition énergétique. Mais au fond, la mission reste la même qu'en 2020 : rendre la rénovation énergétique aussi simple qu'une recherche en ligne. Et on n'est qu'au début.",
  },
];

const heroStats = [
  { icon: Users, value: '175+', label: 'Clients', color: 'text-green-400' },
  { icon: Zap, value: '30 s', label: 'Diagnostic', color: 'text-yellow-400' },
  { icon: Building2, value: '1,2M', label: 'Bâtiments couverts', color: 'text-blue-400' },
  { icon: Leaf, value: '2,23M', label: 'MWh économisés', color: 'text-emerald-400' },
];

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function MobileTimelineItem({ item, index, total }: {
  item: (typeof timeline)[number]; index: number; total: number;
}) {
  const { ref, visible } = useInView(0.2);
  const Icon = item.icon;
  return (
    <div ref={ref} className={`relative mb-8 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
      <div className={`absolute -left-[1.85rem] top-5 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center flex-shrink-0 ${item.color}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-3 ${item.color}`}>
          <Icon className="w-3 h-3" />{item.year}
        </span>
        <h3 className="text-base font-black text-navy-950 mb-2">{item.title}</h3>
        <p className="text-navy-600 text-sm leading-relaxed">{item.text}</p>
      </div>
    </div>
  );
}

function TimelineItem({ item, index }: { item: (typeof timeline)[number]; index: number }) {
  const { ref, visible } = useInView(0.2);
  const isLeft = index % 2 === 0;
  const Icon = item.icon;

  const Card = (
    <div className={`bg-white border border-navy-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 ${isLeft ? 'text-right' : ''}`}>
      <div className={`flex items-center gap-2 mb-4 ${isLeft ? 'justify-end' : ''}`}>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${item.color}`}>
          <Icon className="w-3 h-3" />{item.year}
        </span>
      </div>
      <h3 className="text-lg font-black text-navy-950 mb-2 tracking-tight">{item.title}</h3>
      <p className="text-navy-600 text-sm leading-relaxed">{item.text}</p>
    </div>
  );

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_56px_1fr] items-start">
      <div className={`pr-8 pb-14 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0' : isLeft ? 'opacity-0 -translate-x-12' : 'opacity-0'}`}>
        {isLeft && Card}
      </div>
      <div className="flex flex-col items-center z-10">
        <div className={`w-14 h-14 rounded-full border-4 border-white shadow-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 delay-200 ${item.color} ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {index < timeline.length - 1 && (
          <div className={`w-0.5 flex-1 min-h-[90px] transition-all duration-700 delay-400 ${visible ? 'bg-gradient-to-b from-navy-200 to-transparent' : 'bg-transparent'}`} />
        )}
      </div>
      <div className={`pl-8 pb-14 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0' : !isLeft ? 'opacity-0 translate-x-12' : 'opacity-0'}`}>
        {!isLeft && Card}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <>
      <SEO
        canonical="/a-propos"
        title="À propos | L'histoire d'Optee"
        description="Découvrez l'histoire d'Optee, fondé par Maxime Weinstein : comment un consultant a créé la plateforme de référence pour la rénovation énergétique des bâtiments professionnels."
      />

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-navy-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full filter blur-[120px] -mr-48 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full filter blur-[100px] -ml-32 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black uppercase tracking-widest mb-6">
            Notre histoire
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Simplifier la rénovation<br />
            <span className="text-green-400">énergétique, pour tous.</span>
          </h1>
          <p className="text-navy-300 text-lg leading-relaxed max-w-2xl mx-auto mb-14">
            Optee est né d'un constat simple : rénover un bâtiment professionnel ne devrait pas prendre des mois. On a tout réinventé pour identifier les bons travaux, les aides disponibles et le potentiel de chaque bâtiment en 30 secondes.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {heroStats.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-2xl font-black text-white tracking-tight">{value}</span>
                <span className="text-navy-400 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 sm:py-28 bg-navy-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 text-navy-500 text-xs font-black uppercase tracking-widest mb-4">
              <Star className="w-3 h-3 text-green-500" />
              Nos étapes clés
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight mb-3">De l'idée à la réalité</h2>
            <p className="text-navy-500 text-base max-w-xl mx-auto">Cinq étapes qui ont construit ce qu'est Optee aujourd'hui.</p>
          </div>
          <div className="hidden sm:block">
            {timeline.map((item, i) => <TimelineItem key={item.year} item={item} index={i} />)}
          </div>
          <div className="sm:hidden relative pl-10">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-navy-200" />
            {timeline.map((item, i) => <MobileTimelineItem key={item.year} item={item} index={i} total={timeline.length} />)}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight mb-3">Ce qui nous guide</h2>
            <p className="text-navy-500 text-base max-w-xl mx-auto">Trois convictions qui orientent chacune de nos décisions.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Lightbulb, gradient: 'from-yellow-400 to-orange-400', border: 'hover:border-yellow-200', title: 'Clarté', text: "L'information sur la rénovation énergétique doit être accessible à tous, sans expertise préalable." },
              { icon: Zap, gradient: 'from-green-400 to-emerald-500', border: 'hover:border-green-200', title: 'Efficacité', text: "Ce qui prenait des mois, on le fait en 30 secondes. La vitesse d'exécution est au cœur de tout ce qu'on conçoit." },
              { icon: Heart, gradient: 'from-red-400 to-pink-500', border: 'hover:border-red-200', title: 'Impact', text: "Chaque bâtiment rénové, c'est moins de carbone et des économies concrètes. C'est pourquoi on fait ce métier." },
            ].map(({ icon: Icon, gradient, border, title, text }) => (
              <div key={title} className={`bg-white border border-navy-100 ${border} rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col`}>
                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-navy-950 mb-3">{title}</h3>
                <p className="text-navy-600 text-sm leading-relaxed flex-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full filter blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="relative">
                <div className="w-52 h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <img
                    src="/optee-maxime-weinstein-300x300.jpg"
                    alt="Maxime Weinstein, CEO et co-fondateur d'Optee"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-xl shadow-lg shadow-green-500/30 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-black uppercase tracking-wide">Paris, France</span>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-1">Le fondateur</p>
                <h2 className="text-2xl font-black text-white">Maxime Weinstein</h2>
                <p className="text-navy-400 text-sm font-medium mt-0.5">CEO & Co-fondateur</p>
                <a
                  href="https://www.linkedin.com/in/maxime-weinstein-b4283573"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-sm font-bold transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                  Voir sur LinkedIn
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-7">
                <Quote className="w-8 h-8 text-green-500/40 mb-4" />
                <blockquote className="text-white text-lg font-bold leading-relaxed">
                  "La rénovation énergétique est un enjeu trop important pour rester aussi complexe. On a construit l'outil qu'on aurait voulu avoir."
                </blockquote>
              </div>
              <p className="text-navy-300 text-base leading-relaxed">
                Diplômé de l'ESSCA et fort d'une expérience en conseil auprès d'acteurs de l'immobilier, Maxime a fondé Optee après des années à observer les mêmes blocages sur le terrain : réglementations incompréhensibles, subventions ignorées, propriétaires démunis. Il a décidé de construire la solution plutôt que de continuer à la chercher.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Building2, label: 'ESSCA', sub: 'Formation' },
                  { icon: Users, label: 'Co-fondateur', sub: 'avec Mourad Bani' },
                  { icon: MapPin, label: 'Paris', sub: '→ France entière' },
                  { icon: Leaf, label: 'Incubé au CSTB', sub: '2 ans de R&D' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Icon className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-black leading-tight">{label}</p>
                      <p className="text-navy-400 text-[10px]">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-navy-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mb-4 tracking-tight">Envie d'en savoir plus ?</h2>
          <p className="text-navy-500 text-base mb-8">Analysez votre premier bâtiment gratuitement ou échangez directement avec notre équipe.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/estimer-mon-projet" className="inline-flex items-center justify-center px-7 py-4 bg-green-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-500/30">
              Analyser mon bâtiment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-7 py-4 bg-navy-950 text-white font-bold rounded-2xl hover:bg-navy-800 transition-all">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
