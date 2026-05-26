import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

import { useLocation } from 'react-router-dom';
import { getEmailJsConfig } from '../lib/emailjs';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const contactFaqs = [
  {
    question: "Quel est le délai de réponse moyen ?",
    answer: "Notre équipe s'engage à vous recontacter sous 24h ouvrées pour qualifier votre demande et fixer un premier rendez-vous avec un expert."
  },
  {
    question: "Proposez-vous des démonstrations en ligne ?",
    answer: "Oui, nous réalisons des démonstrations personnalisées en visioconférence d'environ 30 minutes pour vous présenter la plateforme et répondre à vos questions."
  },
  {
    question: "Où sont situés vos bureaux ?",
    answer: "Notre équipe est basée à Paris, mais nous intervenons sur l'ensemble du territoire français pour accompagner vos projets de rénovation énergétique."
  }
];

const reasons = [
  'Demande de demonstration',
  'Informations tarifaires',
  'Partenariat',
  'Support technique',
  'Presse / Media',
  'Simulation de projet',
  'Autre',
];

export default function Contact() {
  const location = useLocation();
  const simData = location.state || {}; // On récupère les données de la simulation s'il y en a

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setIsSubmitting(true);
    setError(false);

    const emailJsConfig = getEmailJsConfig();

    if (!emailJsConfig) {
      setError(true);
      setIsSubmitting(false);
      return;
    }

    const form = formRef.current;

    Promise.all([
      // 1. Envoi au client (accusé de réception)
      emailjs.sendForm(emailJsConfig.serviceId, emailJsConfig.templateClient, form, { publicKey: emailJsConfig.publicKey }),
      // 2. Envoi à l'équipe Optee (notification)
      emailjs.sendForm(emailJsConfig.serviceId, emailJsConfig.templateNotif, form, { publicKey: emailJsConfig.publicKey })
    ]).then(
      async () => {
        // 3. Sauvegarde dans Supabase (silencieux en cas d'erreur)
        try {
          const getValue = (name: string) =>
            (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)?.value ?? '';

          await supabase.from('contact_submissions').insert({
            firstname: getValue('user_firstname'),
            lastname: getValue('user_lastname'),
            company: getValue('user_company'),
            email: getValue('user_email'),
            subject: getValue('contact_reason'),
            message: getValue('message'),
          });
        } catch (_e) {
          // silent — emailjs already succeeded
        }
        setSubmitted(true);
        setIsSubmitting(false);
      },
      (error) => {
        console.error('FAILED...', error);
        setError(true);
        setIsSubmitting(false);
      }
    );
  };

  return (
    <>
      <SEO 
        title="Contactez nos Experts" 
        description="Besoin d'un accompagnement pour votre rénovation énergétique ? Contactez l'équipe Optee pour une démo ou des informations." 
        faqs={contactFaqs}
      />
      <section className="relative pt-32 pb-16 bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Parlons de votre projet
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Un expert vous recontacte sous 24h pour vous accompagner.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Contactez-nous</h2>
              <p className="text-navy-600 mb-8">
                Remplissez le formulaire et un expert vous contactera rapidement.
              </p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-navy-900 mb-2">Message envoye</h3>
                  <p className="text-navy-600">Un expert Optee vous contactera tres prochainement.</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-4 text-sm">
                      Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Prenom</label>
                      <input type="text" name="user_firstname" required className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none" placeholder="Jean" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Nom</label>
                      <input type="text" name="user_lastname" required className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none" placeholder="Dupont" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Email professionnel</label>
                    <input type="email" name="user_email" required className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none" placeholder="jean@entreprise.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Entreprise</label>
                    <input type="text" name="user_company" required className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none" placeholder="Nom de votre entreprise" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Raison du contact</label>
                    <select name="contact_reason" defaultValue={simData.fromSimulation ? 'Simulation de projet' : ''} required className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none">
                      <option value="">Selectionnez une raison</option>
                      {reasons.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Message</label>
                    <textarea 
                      name="message" 
                      rows={4} 
                      required 
                      defaultValue={simData.fromSimulation ? `Bonjour,\n\nJe souhaite obtenir les résultats de mon estimation :\n- Type de bâtiment : ${simData.buildingType}\n- Surface : ${simData.surface} m²\n- DPE actuel : ${simData.dpe}\n- Projet principal : ${simData.projectReason}\n\nMerci de me recontacter.` : ''}
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none resize-none" 
                      placeholder="Parlez-nous de votre projet..." 
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-semibold rounded-full hover:bg-green-600 transition-all shadow-lg shadow-green-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                    {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-8 border border-navy-100">
                <h3 className="text-lg font-semibold text-navy-900 mb-6">Nous contacter directement</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-navy-500">Telephone</p>
                      <a href="tel:+33620432059" className="text-navy-900 font-medium hover:text-green-600 transition-colors">+33 6 20 43 20 59</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-navy-500">Email</p>
                      <span className="text-navy-900 font-medium">contact@optee.io</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-navy-500">WhatsApp</p>
                      <a href="https://wa.me/33620432059?text=Bonjour%20Maxime%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Optee." target="_blank" rel="noopener noreferrer" className="text-navy-900 font-medium hover:text-green-600 transition-colors">Envoyer un message</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-navy-500">Adresse</p>
                      <span className="text-navy-900 font-medium">Paris, France</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-navy-100">
                <h3 className="text-lg font-semibold text-navy-900 mb-6">Ce que vous obtiendrez</h3>
                <ul className="space-y-4">
                  {['Demonstration personnalisee de 30 min', 'Analyse gratuite d\'un batiment', 'Estimation des economies potentielles', 'Presentation des aides disponibles', 'Reponses a toutes vos questions'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-navy-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={contactFaqs} title="Questions fréquentes sur le contact" showContact={false} />
    </>
  );
}
