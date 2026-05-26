import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, FileText, Shield, Clock,
  Database, Lock, Zap, CheckCircle2, Target
} from 'lucide-react';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const proFaqs = [
  {
    question: "Qu'est-ce que l'Espace Pro d'Optee ?",
    answer: "L'Espace Pro est une interface dédiée aux gestionnaires de parcs immobiliers, permettant de centraliser l'analyse de plusieurs bâtiments, de suivre les consommations globales et de planifier des campagnes de travaux multi-sites."
  },
  {
    question: "Peut-on intégrer nos propres données de consommation ?",
    answer: "Oui, la plateforme permet l'import de données via fichier Excel/CSV ou via API pour synchroniser vos factures énergétiques et affiner les diagnostics."
  },
  {
    question: "L'Espace Pro aide-t-il pour le Décret Tertiaire ?",
    answer: "Absolument. Optee génère automatiquement les indicateurs nécessaires pour Opera et vous aide à définir la meilleure trajectoire pour atteindre les objectifs de réduction de 2030, 2040 et 2050."
  }
];

const proFeatures = [
  { icon: Database, title: 'Gestion de parc immobilier', description: 'Centralisez tous vos bâtiments sur une interface unique. Visualisez les performances et priorisez vos investissements.' },
  { icon: BarChart3, title: 'Tableaux de bord avancés', description: 'Accédez à des indicateurs détaillés : consommations, émissions CO2, budgets travaux et retours sur investissement.' },
  { icon: FileText, title: 'Rapports automatisés', description: 'Générez automatisés des rapports personnalisés pour vos comités de direction ou reporting réglementaire.' },
  { icon: Shield, title: 'Conformité réglementaire', description: 'Suivez votre conformité au Décret Tertiaire et Décret BACS avec des alertes proactives.' },
  { icon: Clock, title: 'Planification pluriannuelle', description: 'Construisez votre plan de travaux sur 5 à 10 ans avec une vision budgétaire claire.' },
  { icon: Lock, title: 'Sécurité & Confidentialité', description: 'Données hébergées en France, chiffrement de bout en bout et contrôle d\'accès granulaire.' },
];

const included = [
  'Accès illimité à la plateforme',
  'Prospection bâtimentaire (Pisteur)',
  'Analyse de parc complète',
  'Export des données et rapports',
  'Support dédié par téléphone',
  'Mises à jour réglementaires',
  'Formation équipe incluse',
  'API disponible',
];

export default function EspacePro() {
  return (
    <>
      <SEO 
        title="Espace Professionnel | Gestion de Parc Immobilier" 
        description="Pilotez la transition énergétique de votre patrimoine immobilier avec nos outils pros : tableaux de bord, planification de travaux et suivi réglementaire." 
        faqs={proFaqs}
      />
      <section className="relative pt-32 pb-16 bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300 font-medium">Espace Professionnel</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            L'outil des professionnels de l'immobilier
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto mb-8">
            Pilotez la rénovation de votre parc immobilier avec des outils d'analyse et de planification adaptés aux exigences des professionnels.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-semibold rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/25">
              Demander un accès Pro
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a href="https://pisteur.tech/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base font-semibold rounded-lg hover:bg-white/20 transition-all">
              Découvrir Pisteur
              <Target className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* New Partnership Highlight */}
      <section className="py-12 bg-green-500 overflow-hidden relative text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl flex-shrink-0">
               <Target className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Boostez votre prospection</h3>
              <p className="text-black font-medium opacity-90 max-w-2xl mx-auto">
                Optee vous ouvre les portes de <span className="font-bold">Pisteur</span>, votre outil partenaire indispensable pour identifier vos futurs chantiers et bâtir votre réseau de projets de demain.
              </p>
            </div>
            <a href="https://pisteur.tech/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-navy-950 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl hover:bg-navy-900 transition-all">
              Découvrir Pisteur
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Des outils conçus pour les grands parcs
            </h2>
            <p className="text-navy-600 text-lg">
              Fonctionnalités avancées pour la gestion multi-sites et le pilotage stratégique.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
            {proFeatures.map((f) => (
              <div key={f.title} className="group">
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy-100 transition-colors">
                  <f.icon className="w-6 h-6 text-navy-700" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{f.title}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-navy-100 shadow-sm reveal">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Ce qui est inclus</h2>
              <p className="text-navy-600">Tout ce dont vous avez besoin, sans surprises.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-navy-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg shadow-green-500/25">
                Planifier une démo gratuite
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={proFaqs} title="Questions sur l'Espace Pro" />
    </>
  );
}
