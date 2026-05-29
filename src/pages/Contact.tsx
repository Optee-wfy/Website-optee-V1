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
        canonical="/contact"
        title="Contactez nos Experts"
        description="Contactez l'équipe Optee à Paris. Réponse sous 24h, démonstration personnalisée de 30 min, analyse gratuite d'un bâtiment. Téléphone, email et WhatsApp."
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

            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl p-7 border border-navy-100">
                <h3 className="text-lg font-semibold text-navy-900 mb-5">Nous contacter directement</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-navy-500">Téléphone</p>
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

              {/* Google Business */}
              <a
                href="https://share.google/Ny1DRi8DwNTJ3IFSg"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-white border border-navy-100 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/5 rounded-2xl p-5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white shadow border border-navy-100 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 48 48" className="w-6 h-6">
                    <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
                    <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
                    <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.3 0-9.7-3.2-11.3-7.8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
                    <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C40.8 35.6 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Google Business</p>
                  <p className="text-sm font-bold text-navy-900 mt-0.5">Voir notre fiche & avis clients</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </a>

              {/* Ce que vous obtiendrez */}
              <div className="bg-gray-50 rounded-2xl p-7 border border-navy-100">
                <h3 className="text-lg font-semibold text-navy-900 mb-5">Ce que vous obtiendrez</h3>
                <ul className="space-y-3">
                  {['Démonstration personnalisée de 30 min', "Analyse gratuite d'un bâtiment", 'Estimation des économies potentielles', 'Présentation des aides disponibles', 'Réponses à toutes vos questions'].map((item) => (
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

      {/* Map section */}
      <section className="bg-navy-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Localisation</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Nous trouver</h2>
              <p className="text-navy-300 mt-2 text-sm">Notre équipe est basée à Paris et intervient sur tout le territoire français.</p>
            </div>
            <a
              href="https://share.google/Ny1DRi8DwNTJ3IFSg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl text-white text-sm font-bold transition-all flex-shrink-0"
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
                <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
                <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.3 0-9.7-3.2-11.3-7.8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C40.8 35.6 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              Ouvrir dans Google Maps
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ height: '380px' }}>
            <iframe
              title="Localisation Optee — Paris, France"
              src="https://maps.google.com/maps?q=Paris,+France&hl=fr&z=13&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="absolute bottom-4 left-4 bg-navy-950/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Optee</p>
                <p className="text-navy-300 text-xs">Paris, France</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={contactFaqs} title="Questions fréquentes sur le contact" showContact={false} />
    </>
  );
}
