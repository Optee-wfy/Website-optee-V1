import { FAQItem } from './ui/faq-item';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FAQSectionProps {
  title?: string;
  description?: string;
  faqs: Array<{ question: string; answer: string }>;
  showContact?: boolean;
}

export default function FAQSection({ 
  title = "Questions fréquentes", 
  description = "Tout ce que vous devez savoir sur ce sujet.",
  faqs,
  showContact = true
}: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">{title}</h2>
          <p className="text-navy-600">{description}</p>
        </div>
        <div className="bg-white rounded-2xl border border-navy-100 px-6 sm:px-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        {showContact && (
          <div className="text-center mt-12">
            <p className="text-navy-600 mb-4">Vous avez d'autres questions ?</p>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/25">
              Contactez-nous
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
