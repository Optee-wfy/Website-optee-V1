import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const faqs = [
  { question: 'Qu\'est-ce qu\'Optee exactement ?', answer: 'Optee est une plateforme technologique qui automatise l\'analyse et la planification de la rénovation énergétique des bâtiments professionnels. À partir d\'une simple adresse, nous identifions les travaux pertinents, les économies réalisables, les aides disponibles et générons des briefs techniques prêts à lancer.' },
  { question: 'Quels types de bâtiments sont couverts ?', answer: 'Optee couvre l\'ensemble des bâtiments tertiaires et industriels : bureaux, commerces, hôtels, établissements de santé, bâtiments d\'enseignement, entrepôts logistiques et sites industriels. Nous disposons de données sur plus de 5 millions de bâtiments en France.' },
  { question: 'Comment fonctionne l\'analyse automatique ?', answer: 'Notre algorithme croise des dizaines de bases de données publiques et privées pour reconstituer les caractéristiques techniques de votre bâtiment : surface, année de construction, système de chauffage, isolation, consommations réelles... En 2 minutes, vous obtenez un diagnostic complet.' },
  { question: 'Les données sont-elles fiables ?', answer: 'Nos données sont issues de sources certifiées (DPE, registre foncier, fichiers ADEME, données cadastrales) et recoupées par nos algorithmes. Nous affichons systématiquement le niveau de confiance de chaque information.' },
  { question: 'Combien coûte la plateforme ?', answer: 'Optee propose une découverte gratuite qui vous permet d\'analyser un premier bâtiment. Pour un usage professionnel sur l\'ensemble de votre parc, nous proposons des formules adaptées à la taille de votre portefeuille. Contactez-nous pour un devis personnalisé.' },
  { question: 'Quelles aides financières sont identifiées ?', answer: 'Optee identifie toutes les aides disponibles : Certificats d\'Économie d\'Énergie (CEE), MaPrimeRénov\' Copropriétés, Fonds Chaleur ADEME, aides régionales et locales, prêts à taux zéro et dispositifs fiscaux.' },
  { question: 'Comment sont sélectionnées les entreprises partenaires ?', answer: 'Les entreprises de notre marketplace sont vérifiées selon des critères stricts : certifications RGE, assurances valides, références vérifiables et satisfaction client. Nous suivons la qualité des interventions régulièrement.' },
  { question: 'Est-ce qu\'Optee aide à la conformité réglementaire ?', answer: 'Oui. La plateforme intègre les exigences du Décret Tertiaire, du Décret BACS et des futures réglementations. Vous pouvez simuler différentes trajectoires et identifier les travaux nécessaires.' },
  { question: 'Puis-je intégrer Optee à mes outils existants ?', answer: 'Optee propose une API REST complète et des intégrations avec les principaux outils de gestion immobilière (GMAO, ERP immobilier, plateformes de reporting).' },
  { question: 'Quelle est la durée d\'engagement ?', answer: 'Il n\'y a aucun engagement minimum. Vous pouvez utiliser la plateforme tant qu\'elle vous apporte de la valeur. Nous proposons des formules mensuelles et annuelles.' },
];

export default function FAQ() {
  return (
    <>
      <SEO
        canonical="/faq"
        title="FAQ Rénovation Énergétique | CEE, DPE, Décret Tertiaire"
        description="Trouvez les réponses à toutes vos questions sur Optee, l'analyse énergétique automatique, les aides CEE et le financement de vos travaux de rénovation."
        faqs={faqs}
      />
      <section className="relative pt-32 pb-16 bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Questions fréquentes</h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur Optee et la rénovation énergétique de vos bâtiments.
          </p>
        </div>
      </section>

      <FAQSection 
        faqs={faqs} 
        title="Réponses à vos questions" 
        description="Parcourez les questions les plus courantes posées par nos utilisateurs."
      />
    </>
  );
}
