import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Flame, Sun, Wind, Lightbulb, Droplets,
  Shield, Layers, Cpu, Wrench, Building2, Users
} from 'lucide-react';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const operationsFaqs = [
  {
    question: "Quels types de travaux sont couverts par Optee ?",
    answer: "Optee couvre l'ensemble des lots de rénovation énergétique : isolation (murs, toiture, vitrages), chauffage, ventilation, éclairage LED, domotique (GTB) et énergies renouvelables (solaire photovoltaïque)."
  },
  {
    question: "Comment Optee priorise-t-il les opérations ?",
    answer: "La plateforme utilise un score de priorité basé sur plusieurs criteria : le gain énergétique estimé, le coût de mise en œuvre, le montant des subventions disponibles et le temps de retour sur investissement (ROI)."
  },
  {
    question: "Proposez-vous des travaux de mise en conformité ?",
    answer: "Oui, nous intégrons les opérations liées à la sécurité incendie, à l'accessibilité PMR et à la mise aux normes électriques pour assurer une rénovation globale et conforme."
  }
];

const categories = [
  { id: 'chauffage', icon: Flame, label: 'Chauffage', title: 'Chauffage & Climatisation', description: 'Remplacement de chaudières, installation de pompes à chaleur, régulation thermique et systèmes de climatisation performants.', operations: ['Pompe à chaleur air/eau', 'Chaudière biomasse', 'Régulation & GTB', 'Réseau de chaleur'] },
  { id: 'isolation', icon: Layers, label: 'Isolation', title: 'Isolation thermique', description: 'Isolation des murs, toitures, planchers et menuiseries pour réduire les déperditions et améliorer le confort.', operations: ['ITE facades', 'Isolation toiture', 'Isolation planchers', 'Menuiseries performantes'] },
  { id: 'solaire', icon: Sun, label: 'Solaire', title: 'Énergie solaire', description: 'Installation de panneaux photovoltaïques et solaires thermiques pour l\'autoconsommation et la production d\'énergie renouvelable.', operations: ['Photovoltaïque', 'Solaire thermique', 'Autoconsommation', 'Ombrières'] },
  { id: 'ventilation', icon: Wind, label: 'Ventilation', title: 'Ventilation & Qualité d\'air', description: 'Systèmes de ventilation mécanique, récupération de chaleur et qualité de l\'air intérieur.', operations: ['VMC double flux', 'CTA haute efficacité', 'Récupération de chaleur', 'Qualité air intérieur'] },
  { id: 'eclairage', icon: Lightbulb, label: 'Éclairage', title: 'Éclairage performant', description: 'Passage à l\'éclairage LED, détection de présence et gestion intelligente de l\'éclairage.', operations: ['Relamping LED', 'Détection de présence', 'Gradation intelligente', 'Éclairage extérieur'] },
  { id: 'domotique', icon: Cpu, label: 'Domotique', title: 'Domotique & GTB', description: 'Gestion technique centralisée, capteurs IoT et automatisation des systèmes pour un pilotage intelligent.', operations: ['GTB/GTC', 'Capteurs IoT', 'Comptage intelligent', 'Supervision énergie'] },
  { id: 'eau', icon: Droplets, label: 'Gestion de l\'eau', title: 'Gestion de l\'eau', description: 'Récupération d\'eaux pluviales, réduction des consommations et systèmes de gestion intelligente.', operations: ['Récupération eaux pluviales', 'Robinetterie économe', 'Détection de fuites', 'Traitement eaux grises'] },
  { id: 'securite', icon: Shield, label: 'Sécurité', title: 'Sécurité & Conformité', description: 'Mise aux normes, sécurité incendie, accessibilité et conformité réglementaire.', operations: ['Sécurité incendie', 'Accessibilité PMR', 'Mise aux normes électriques', 'Désamiantage'] },
  { id: 'structure', icon: Building2, label: 'Structure', title: 'Structure & Gros oeuvre', description: 'Ravalement, étanchéité, renforcement structurel et travaux de pérennité du bâti.', operations: ['Ravalement facade', 'Étanchéité toiture', 'Renforcement structure', 'Réfection parking'] },
  { id: 'accompagnement', icon: Users, label: 'Accompagnement', title: 'Accompagnement & Audit', description: 'Audits énergétiques, assistance à maîtrise d\'ouvrage et accompagnement réglementaire.', operations: ['Audit énergétique', 'AMO', 'Certification BREEAM/HQE', 'Schéma directeur énergie'] },
  { id: 'maintenance', icon: Wrench, label: 'Maintenance', title: 'Maintenance & Exploitation', description: 'Contrats de performance, maintenance préventive et optimisation de l\'exploitation.', operations: ['CPE', 'Maintenance préventive', 'Commissioning', 'Optimisation exploitation'] },
];

export default function Operations() {
  const [active, setActive] = useState(categories[0].id);
  const activeCat = categories.find((c) => c.id === active)!;

  return (
    <>
      <SEO 
        title="Opérations de Rénovation | Travaux et Solutions" 
        description="Explorez tous les types de travaux de rénovation énergétique analysés par Optee : chauffage, isolation, solaire, ventilation et bien plus." 
        faqs={operationsFaqs}
      />
      <section className="relative pt-32 pb-16 bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Toutes les opérations de rénovation
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Découvrez l'ensemble des travaux que la plateforme Optee peut analyser, recommander et piloter pour vos bâtiments.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-12 reveal">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === cat.id
                    ? 'bg-navy-900 text-white shadow-lg'
                    : 'bg-gray-100 text-navy-600 hover:bg-gray-200'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-8 sm:p-10 border border-navy-100 reveal">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                <activeCat.icon className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900">{activeCat.title}</h3>
            </div>
            <p className="text-navy-600 leading-relaxed mb-8">{activeCat.description}</p>
            <div className="grid sm:grid-cols-2 gap-3 reveal">
              {activeCat.operations.map((op) => (
                <div key={op} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-navy-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-navy-700 font-medium">{op}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12 reveal">
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/25">
              Analyser un bâtiment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <FAQSection faqs={operationsFaqs} />
    </>
  );
}
