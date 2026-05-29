import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, CheckCircle2, MapPin, Award } from 'lucide-react';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const marketplaceFaqs = [
  {
    question: "Comment sont sélectionnées les entreprises sur la marketplace ?",
    answer: "Toutes les entreprises présentes sur Optee sont rigoureusement auditées : vérification des certifications RGE, des assurances décennales, de leur santé financière et de leurs références passées."
  },
  {
    question: "Comment fonctionne la mise en relation ?",
    answer: "Une fois votre diagnostic validé, Optee génère un brief technique. Ce brief est envoyé aux entreprises partenaires spécialisées dans les lots concernés, qui vous répondent avec un devis sous 48h à 72h."
  },
  {
    question: "Est-ce gratuit d'utiliser la marketplace ?",
    answer: "La consultation d'entreprises et la réception de devis via Optee est gratuite pour les porteurs de projets. Nous nous rémunérons via des frais de mise en relation auprès des entreprises."
  }
];

const companies = [
  { name: 'Dalkia', specialty: 'Chauffage & Climatisation', rating: 4.8, projects: 340, certifications: ['RGE', 'ISO 14001'], location: 'Île-de-France' },
  { name: 'SPIE Facilities', specialty: 'Multi-techniques', rating: 4.7, projects: 280, certifications: ['RGE', 'Qualibat'], location: 'National' },
  { name: 'Bouygues Énergies', specialty: 'Rénovation globale', rating: 4.9, projects: 195, certifications: ['RGE', 'ISO 50001'], location: 'National' },
  { name: 'Eiffage Énergie', specialty: 'Éclairage & Électricité', rating: 4.6, projects: 220, certifications: ['RGE', 'Qualifelec'], location: 'Grand Est' },
  { name: 'Engie Solutions', specialty: 'Performance énergétique', rating: 4.8, projects: 410, certifications: ['RGE', 'ISO 14001', 'ISO 50001'], location: 'National' },
  { name: 'Solaire Pro France', specialty: 'Photovoltaïque', rating: 4.7, projects: 145, certifications: ['RGE', 'QualiPV'], location: 'Sud-Est' },
];

const guarantees = [
  { icon: Shield, title: 'Entreprises vérifiées', description: 'Certifications et assurances contrôlées par nos équipes.' },
  { icon: Award, title: 'Qualité garantie', description: 'Suivi de satisfaction et notations transparentes.' },
  { icon: CheckCircle2, title: 'Devis en 48h', description: 'Des réponses rapides grâce à nos briefs pré-qualifiés.' },
];

export default function Marketplace() {
  return (
    <>
      <SEO
        canonical="/marketplace"
        title="Marketplace Entreprises RGE Certifiées"
        description="Trouvez des entreprises certifiées RGE pour vos travaux de rénovation énergétique. Devis rapides, qualité garantie et entreprises vérifiées."
        faqs={marketplaceFaqs}
      />
      <section className="relative pt-32 pb-16 bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Marketplace Entreprises</h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Accédez à un réseau d'entreprises qualifiées et certifiées pour réaliser vos travaux de rénovation énergétique.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-3 gap-6">
            {guarantees.map((g) => (
              <div key={g.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <g.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-sm">{g.title}</h3>
                  <p className="text-navy-500 text-sm">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Entreprises partenaires</h2>
            <p className="text-navy-600">Des professionnels sélectionnés pour leur expertise et leur fiabilité.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.name} className="bg-white rounded-2xl p-6 border border-navy-100 hover:shadow-lg hover:border-green-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-navy-700 text-lg">{company.name[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-navy-700">{company.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-navy-900 mb-1">{company.name}</h3>
                <p className="text-sm text-navy-500 mb-3">{company.specialty}</p>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-navy-400" />
                  <span className="text-xs text-navy-500">{company.location}</span>
                  <span className="text-xs text-navy-400 ml-auto">{company.projects} projets</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {company.certifications.map((cert) => (
                    <span key={cert} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">{cert}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/25">
              Lancer un appel d'offres
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <FAQSection faqs={marketplaceFaqs} title="Tout savoir sur la Marketplace" />
    </>
  );
}
