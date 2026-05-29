import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, BarChart3, FileText, Users,
  TrendingUp, Layers, Target, Globe
} from 'lucide-react';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const solutionsFaqs = [
  {
    question: "Quelles sont les principales fonctionnalités d'Optee ?",
    answer: "Optee propose l'analyse automatique de bâtiments, la simulation de DPE, le calcul du ROI des travaux, l'identification des aides financières (CEE, MaPrimeRénov') et la génération de briefs techniques."
  },
  {
    question: "Comment Optee identifie-t-il les aides financières ?",
    answer: "Notre moteur d'éligibilité analyse en temps réel les barèmes nationaux (CEE, ADEME) et locaux pour calculer le montant exact des subventions mobilisables pour chaque scénario de travaux."
  },
  {
    question: "Peut-on exporter les rapports générés par Optee ?",
    answer: "Oui, vous pouvez exporter des briefs techniques complets et des synthèses financières au format PDF pour les partager avec vos clients, partenaires ou prestataires."
  }
];

const features = [
  { icon: Building2, title: 'Analyse bâtimentaire automatique', description: 'Récupérez automatiquement les caractéristiques techniques de n\'importe quel bâtiment à partir de son adresse.' },
  { icon: Target, title: 'Prospection intelligente avec Pisteur', description: 'Identifiez vos meilleures cibles bâtimentaires grâce à notre nouveau partenaire technologique Pisteur.' },
  { icon: BarChart3, title: 'Diagnostic énergétique intelligent', description: 'Notre moteur d\'analyse évalue le potentiel de rénovation et identifie les travaux les plus pertinents.' },
  { icon: TrendingUp, title: 'Calcul des économies et du ROI', description: 'Estimez précisément les économies d\'énergie, les réductions de CO2 et le retour sur investissement.' },
  { icon: Layers, title: 'Identification des aides financières', description: 'Détectez automatiquement toutes les aides disponibles : CEE, MaPrimeRénov\', fonds chaleur, aides locales.' },
  { icon: FileText, title: 'Génération de briefs techniques', description: 'Créez en un clic des cahiers des charges professionnels, détaillés et prêts à transmettre.' },
];

const audiences = [
  { icon: Globe, title: 'Gestionnaires immobiliers', description: 'Pilotez la rénovation de votre parc avec une vision consolidée et des données fiables.' },
  { icon: Target, title: 'Asset managers', description: 'Optimisez la valeur de vos actifs et anticipez les obligations réglementaires.' },
  { icon: Building2, title: 'Propriétaires & exploitants', description: 'Identifiez rapidement les travaux les plus rentables et réduisez vos charges.' },
  { icon: FileText, title: 'Bureaux d\'études & architectes', description: 'Gagnez du temps sur la phase d\'analyse et concentrez-vous sur la conception.' },
];

export default function Solutions() {
  return (
    <>
      <SEO
        canonical="/solutions"
        title="Nos Solutions | Diagnostic et Planification Énergie"
        description="Découvrez les fonctionnalités d'Optee : analyse automatique, simulation DPE, calcul d'aides CEE et MaPrimeRénov', marketplace de travaux RGE."
        faqs={solutionsFaqs}
      />
      <section className="relative pt-32 pb-16 bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            La plateforme tout-en-un pour la rénovation énergétique
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto mb-8">
            De l'analyse à l'exécution, Optee automatise chaque étape pour vous faire gagner du temps et de l'argent.
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-semibold rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/25">
            Découvrir Optee gratuitement
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Des fonctionnalités pensées pour les professionnels
            </h2>
            <p className="text-navy-600 text-lg">
              Chaque outil est conçu pour simplifier votre quotidien et accélérer vos projets.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
            {features.map((f) => (
              <div key={f.title} className="group">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                  <f.icon className="w-6 h-6 text-green-600" />
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
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Pour chaque professionnel de l'immobilier
            </h2>
            <p className="text-navy-600 text-lg">
              Optee s'adapte à vos besoins spécifiques, quel que soit votre rôle.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 reveal">
            {audiences.map((a) => (
              <div key={a.title} className="bg-white rounded-2xl p-8 border border-navy-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-4">
                  <a.icon className="w-6 h-6 text-navy-700" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{a.title}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={solutionsFaqs} />

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
            Prêt à transformer votre approche de la rénovation ?
          </h2>
          <p className="text-navy-600 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez les professionnels qui accélèrent leurs projets avec Optee.
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-semibold rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/25">
            Planifier une démo gratuite
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
