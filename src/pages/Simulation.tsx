import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Home, Building2, Factory, Construction, ArrowRight, CheckCircle2, Target, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEmailJsConfig } from '../lib/emailjs';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';

const simulationFaqs = [
  {
    question: "Comment est calculée l'estimation des aides ?",
    answer: "Notre simulateur croise les données de votre bâtiment (surface, type, DPE) avec les barèmes officiels des CEE et de MaPrimeRénov' pour estimer le montant maximum des subventions mobilisables."
  },
  {
    question: "Les résultats de la simulation sont-ils contractuels ?",
    answer: "Non, il s'agit d'une estimation basée on des données statistiques. Une étude approfondie par un de nos experts est nécessaire pour confirmer les montants exacts et l'éligibilité technique de votre projet."
  },
  {
    question: "Combien de temps prend la simulation ?",
    answer: "La saisie des informations prend moins de 2 minutes. Les résultats préliminaires sont affichés instantanément, et une étude complète vous est envoyée par un expert sous 24h."
  }
];

const buildingTypes = [
  { id: 'bureau', label: 'Bureaux', icon: Building2 },
  { id: 'logement', label: 'Logement collectif', icon: Home },
  { id: 'maison', label: 'Maison individuelle', icon: Home },
  { id: 'commerce', label: 'Commerce', icon: Factory },
  { id: 'autre', label: 'Autre', icon: Construction },
];

const dpeOptions = [
  { label: 'A', color: '#1a9e3f', textColor: '#fff' },
  { label: 'B', color: '#53c32a', textColor: '#fff' },
  { label: 'C', color: '#a8d030', textColor: '#333' },
  { label: 'D', color: '#f5d920', textColor: '#333' },
  { label: 'E', color: '#f0a820', textColor: '#333' },
  { label: 'F', color: '#e87020', textColor: '#fff' },
  { label: 'G', color: '#d43020', textColor: '#fff' },
];

const projectReasons = [
  { id: 'isolation', label: 'Isolation (murs, toiture, plancher)' },
  { id: 'chauffage', label: 'Remplacement du Chauffage/CVC' },
  { id: 'gtb', label: 'Installation GTB' },
  { id: 'global', label: 'Rénovation globale' },
  { id: 'audit', label: 'Audit énergétique complet' },
];

export default function Simulation() {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState<'mon_logement' | 'ma_cible' | ''>('');
  const [buildingType, setBuildingType] = useState('');
  const [address, setAddress] = useState('');
  const [surface, setSurface] = useState('');
  const [dpe, setDpe] = useState<string[]>([]);
  const [projectReason, setProjectReason] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [addressInput, setAddressInput] = useState('');
  const [addressValidated, setAddressValidated] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ place_id: number; display_name: string; class: string; type: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (addressInput.length < 3 || addressValidated) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const params = new URLSearchParams({
          q: addressInput,
          format: 'json',
          limit: '6',
          countrycodes: 'fr',
          addressdetails: '1',
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          headers: { 'Accept-Language': 'fr' },
        });
        const data = await res.json();
        const filtered = situation === 'ma_cible'
          ? data.filter((r: { class: string }) => r.class === 'place' || r.class === 'boundary')
          : data;
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [addressInput, addressValidated, situation]);

  const handleAddressSelect = (suggestion: { place_id: number; display_name: string }) => {
    const cleaned = suggestion.display_name
      .replace(/, France métropolitaine/g, '')
      .replace(/, France$/g, '');
    setAddressInput(cleaned);
    setAddress(suggestion.display_name);
    setAddressValidated(true);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleAddressInputChange = (val: string) => {
    setAddressInput(val);
    setAddressValidated(false);
    setAddress('');
  };

  const goBack = () => {
    if (step === 5 && showForm) { setShowForm(false); return; }
    if (step === 2) {
      setStep(1);
      setSituation('');
      setBuildingType('');
      setAddressInput('');
      setAddress('');
      setAddressValidated(false);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleDpe = (value: string) => {
    if (value === 'Je ne sais pas') {
      setDpe(dpe.includes('Je ne sais pas') ? [] : ['Je ne sais pas']);
    } else {
      const withoutUnknown = dpe.filter(d => d !== 'Je ne sais pas');
      if (withoutUnknown.includes(value)) {
        setDpe(withoutUnknown.filter(d => d !== value));
      } else {
        setDpe([...withoutUnknown, value]);
      }
    }
  };

  const handleSimulationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const emailJsConfig = getEmailJsConfig();

    if (!emailJsConfig) {
      setError(true);
      setIsSubmitting(false);
      return;
    }

    const templateParams = {
      user_firstname: situation === 'ma_cible' ? 'Chasseur/Pro' : 'Propriétaire',
      user_lastname: name,
      user_email: email,
      user_company: buildingType,
      contact_reason: situation === 'ma_cible' ? 'Prospection Cible' : 'Simulation de projet',
      message: `Nouvelle simulation en ligne (${situation === 'ma_cible' ? 'Prospection' : 'Diagnostic'}) :\n- Bâtiment: ${buildingType}\n- Adresse/Localisation: ${address}\n- Surface: ${surface} m²\n- DPE: ${dpe.join(', ')}\n- Projet: ${projectReason}\n- Téléphone prospect: ${phone}`
    };

    Promise.all([
      emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateClient, templateParams, { publicKey: emailJsConfig.publicKey }),
      emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateNotif, templateParams, { publicKey: emailJsConfig.publicKey })
    ]).then(
      () => {
        setSubmitted(true);
        setIsSubmitting(false);
      },
      (err) => {
        console.error('FAILED...', err);
        setError(true);
        setIsSubmitting(false);
      }
    );
  };

  const renderStep1 = () => (
    <div className="animate-fade-in space-y-5 flex flex-col items-center">
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-navy-950 mb-2 tracking-tight">Bienvenue sur votre analyse complète</h2>
        <p className="text-navy-600 text-base sm:text-lg max-w-2xl mx-auto font-medium">Choisissez la situation qui correspond à votre besoin aujourd'hui.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 w-full max-w-3xl">
        <button
          onClick={() => { setSituation('mon_logement'); setStep(2); }}
          className="group relative flex flex-col p-6 bg-white/40 backdrop-blur-xl border border-navy-100 rounded-[2rem] transition-all duration-500 hover:bg-white hover:border-green-500 hover:shadow-[0_40px_80px_rgba(34,197,94,0.12)] text-left overflow-hidden shadow-sm"
        >
          <div className="w-11 h-11 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-500">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div className="inline-flex px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-black uppercase tracking-widest mb-2 w-fit">
            Propriétaire
          </div>
          <h3 className="text-lg font-bold text-navy-950 mb-2 tracking-tight">Quel est le type de votre logement ?</h3>
          <p className="text-navy-500 text-sm leading-relaxed mb-4 font-medium">
            Je souhaite analyser mon propre bien pour identifier les travaux et les aides disponibles.
          </p>
          <div className="mt-auto flex items-center text-green-600 font-black text-sm uppercase tracking-wider">
            Analyser mon bien
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => { setSituation('ma_cible'); setStep(2); }}
          className="group relative flex flex-col p-6 bg-white/40 backdrop-blur-xl border border-navy-100 rounded-[2rem] transition-all duration-500 hover:bg-white hover:border-accent-500 hover:shadow-[0_40px_80px_rgba(51,112,255,0.12)] text-left overflow-hidden shadow-sm"
        >
          <div className="w-11 h-11 bg-gradient-to-tr from-accent-600 to-blue-400 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-accent-500/20 group-hover:scale-110 transition-transform duration-500">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="inline-flex px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20 text-accent-600 text-[10px] font-black uppercase tracking-widest mb-2 w-fit">
            Professionnel
          </div>
          <h3 className="text-lg font-bold text-navy-950 mb-2 tracking-tight">Quel type de logement est votre cible ?</h3>
          <p className="text-navy-500 text-sm leading-relaxed mb-4 font-medium">
            Je suis à la recherche de nouveaux bâtiments à rénover ou pour prospecter de nouveaux clients.
          </p>
          <div className="mt-auto flex items-center text-accent-600 font-black text-sm uppercase tracking-wider">
            Trouver des cibles
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in space-y-5">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mb-1 tracking-tight">
          {situation === 'ma_cible' ? "Quel type de logement est votre cible ?" : "Quel est le type de votre logement ?"}
        </h2>
        <p className="text-navy-500 text-base font-medium">Cette information nous permet de cibler les opportunités spécifiques.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {buildingTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setBuildingType(type.label)}
            className={`group flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all duration-300 ${buildingType === type.label ? 'border-green-500 bg-green-50/50 shadow-lg shadow-green-500/10 scale-105' : 'border-navy-100 bg-white/50 hover:border-navy-200 hover:bg-white'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${buildingType === type.label ? 'bg-green-500 text-white' : 'bg-navy-50 text-navy-400 group-hover:bg-navy-100'}`}>
              <type.icon className="w-5 h-5" />
            </div>
            <span className="font-bold text-navy-900 text-center text-sm">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto text-left space-y-4">
        <div>
          <label className="block text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
            {situation === 'ma_cible' ? "Ville, Quartier ou Arrondissement cible" : "Adresse complète"}
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400 z-10" />
            {loadingSuggestions && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-navy-200 border-t-green-500 rounded-full animate-spin" />
            )}
            {addressValidated && (
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
            <input
              type="text"
              value={addressInput}
              onChange={(e) => handleAddressInputChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className={`w-full pl-12 pr-10 py-3 rounded-xl border focus:ring-4 focus:ring-green-500/5 outline-none text-base font-bold bg-white transition-all shadow-inner ${addressValidated ? 'border-green-500' : 'border-navy-100 focus:border-green-500'}`}
              placeholder={situation === 'ma_cible' ? "Ex: Lyon, Opéra, 6e arrondissement..." : "Ex: 10 rue de la Paix, 75002 Paris"}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-navy-100 rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.map((s) => {
                  const parts = s.display_name.replace(/, France métropolitaine/g, '').replace(/, France$/, '').split(', ');
                  const main = parts.slice(0, 2).join(', ');
                  const sub = parts.slice(2, 4).join(', ');
                  return (
                    <li key={s.place_id}>
                      <button
                        type="button"
                        onMouseDown={() => handleAddressSelect(s)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left border-b border-navy-50 last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-navy-300 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="block text-sm font-bold text-navy-900">{main}</span>
                          {sub && <span className="block text-xs text-navy-400 font-medium">{sub}</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {!addressValidated && addressInput.length >= 3 && !loadingSuggestions && suggestions.length === 0 && (
            <p className="text-xs text-red-400 font-bold mt-1.5 ml-1">Aucun résultat — essayez un autre terme.</p>
          )}
          {!addressValidated && addressInput.length > 0 && addressInput.length < 3 && (
            <p className="text-xs text-navy-400 font-medium mt-1.5 ml-1">Tapez au moins 3 caractères pour rechercher.</p>
          )}
          {addressValidated && (
            <p className="text-xs text-green-600 font-bold mt-1.5 ml-1">Adresse vérifiée ✓</p>
          )}
        </div>

        <button
          disabled={!buildingType || !addressValidated}
          onClick={() => setStep(3)}
          className="w-full inline-flex items-center justify-center px-8 py-4 bg-navy-950 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-navy-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-navy-900/20"
        >
          Continuer
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in space-y-5">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mb-1 tracking-tight">Caractéristiques {situation === 'ma_cible' ? "recherchées" : "de votre bien"}</h2>
        <p className="text-navy-500 text-base font-medium">Indiquez la surface et l'état énergétique pour affiner l'analyse.</p>
      </div>

      <div className="space-y-4 max-w-lg mx-auto">
        <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-navy-100 space-y-4">
          <div>
            <label className="block text-sm font-black text-navy-900 uppercase tracking-widest mb-2 ml-1">Surface (m²)</label>
            <div className="relative">
              <input
                type="number"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-navy-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-bold text-navy-950 bg-white/80"
                placeholder="Ex: 500"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-navy-400 font-bold">m²</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-navy-900 uppercase tracking-widest mb-3 ml-1">
              DPE {situation === 'ma_cible' ? "recherché" : "actuel"}
              <span className="ml-2 text-[10px] text-navy-400 normal-case font-medium tracking-normal">Sélection multiple possible</span>
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {dpeOptions.map(({ label, color, textColor }) => {
                const selected = dpe.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleDpe(label)}
                    style={{ backgroundColor: selected ? color : undefined, color: selected ? textColor : undefined, borderColor: color }}
                    className={`w-11 h-11 rounded-xl border-2 font-black text-base transition-all duration-200 flex items-center justify-center
                      ${selected ? 'scale-110 shadow-lg' : 'bg-white text-navy-700 hover:scale-105 hover:shadow-md'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => toggleDpe('Je ne sais pas')}
              className={`w-full py-2 px-4 rounded-xl border-2 text-sm font-bold transition-all duration-200 text-left
                ${dpe.includes('Je ne sais pas')
                  ? 'bg-navy-100 border-navy-400 text-navy-700'
                  : 'bg-white border-navy-100 text-navy-400 hover:border-navy-300'}`}
            >
              Je ne sais pas
            </button>
          </div>
        </div>

        <button
          disabled={!surface || dpe.length === 0}
          onClick={() => setStep(4)}
          className="w-full inline-flex items-center justify-center px-8 py-4 bg-navy-950 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-navy-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-navy-900/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          Continuer
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const handleStep4Click = (reasonLabel: string) => {
    setProjectReason(reasonLabel);
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setStep(5);
    }, 2000);
  };

  const renderStep4 = () => (
    <div className="animate-fade-in space-y-5">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mb-1 tracking-tight">
          {situation === 'ma_cible' ? "Objectif de prospection" : "Quel est votre projet ?"}
        </h2>
        <p className="text-navy-500 text-base font-medium">Nous personnalisons l'analyse selon vos priorités.</p>
      </div>

      <div className="grid gap-3 max-w-lg mx-auto">
        {projectReasons.map((reason) => (
          <button
            key={reason.id}
            onClick={() => handleStep4Click(reason.label)}
            className="group flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-2 border-navy-100 rounded-xl hover:border-green-500 hover:bg-white hover:shadow-lg hover:shadow-green-500/5 transition-all w-full text-left"
          >
            <span className="font-bold text-navy-900 text-base">{reason.label}</span>
            <div className="w-9 h-9 bg-navy-50 rounded-xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => {
    if (showForm) {
      return (
        <div className="animate-fade-in max-w-lg mx-auto w-full">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-navy-950 mb-2 tracking-tight">Demande envoyée !</h3>
              <p className="text-navy-600 text-base font-medium leading-relaxed mb-6">
                Un expert Optee va traiter votre demande et vous recontactera rapidement.
              </p>
              <Link to="/" className="inline-flex items-center px-6 py-3 bg-navy-950 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-navy-900 transition-all shadow-lg">
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-black text-navy-950 mb-1 tracking-tight">
                {situation === 'ma_cible' ? "Recevoir ma liste de cibles" : "Demander mon étude gratuite"}
              </h3>
              <p className="text-navy-500 text-sm font-medium mb-5">Laissez vos coordonnées pour qu'un expert vous envoie le rapport personnalisé.</p>

              <form onSubmit={handleSimulationSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold">
                    Une erreur est survenue. Veuillez réessayer.
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Nom Complet</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-navy-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none text-base font-bold bg-gray-50/50 transition-all" placeholder="Jean Dupont" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-navy-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none text-base font-bold bg-gray-50/50 transition-all" placeholder="jean@email.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Téléphone</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-navy-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none text-base font-bold bg-gray-50/50 transition-all" placeholder="06..." />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-500/30 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5">
                  {isSubmitting ? 'Traitement...' : 'Être recontacté'}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                </button>
                <p className="text-[10px] text-center text-navy-300 font-bold flex justify-center items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                  Analyse humaine assurée par nos experts
                </p>
              </form>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="animate-fade-in text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-black text-navy-950 tracking-tight">
          {situation === 'ma_cible' ? "Résultats de prospection" : "Aperçu de vos résultats"}
        </h2>

        <div className="bg-green-50/50 backdrop-blur-sm border border-green-200 rounded-[2rem] p-8 max-w-2xl mx-auto shadow-sm">
          <div className="inline-flex px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-widest mb-3">
            {situation === 'ma_cible' ? "Analyse terminée" : "Éligibilité validée"}
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2 tracking-tight">
            {situation === 'ma_cible' ? "De nombreuses opportunités trouvées ! 🎯" : "Bonne nouvelle ! 🎉"}
          </h3>
          <p className="text-green-700 text-base font-medium mb-6">
            {situation === 'ma_cible'
              ? `Notre outil a identifié un grand nombre de bâtiments correspondant à vos critères dans la zone demandée. Souhaitez-vous recevoir la liste détaillée ?`
              : `Votre bâtiment semble présenter un fort potentiel pour des travaux de rénovation énergétique. Contactez un expert pour une analyse complète.`}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-500/30 hover:-translate-y-0.5"
          >
            {situation === 'ma_cible' ? "Recevoir la liste détaillée" : "Demander mon étude gratuite"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Analyse Complète | Optee" 
        description="Analysez votre logement ou prospectez de nouveaux bâtiments avec notre outil d'analyse intelligente." 
        faqs={simulationFaqs}
      />
      <div className="min-h-screen bg-navy-50/30 pt-[8.5rem] pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-4 max-w-4xl mx-auto flex items-center justify-between">
            {(step > 1 || (step === 5 && showForm)) ? (
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-navy-400 hover:text-navy-700 text-xs font-bold transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                Retour
              </button>
            ) : <div />}
            <div className="bg-white px-4 py-2 rounded-xl border border-navy-100 shadow-sm">
              <span className="text-xs font-black text-navy-950 uppercase tracking-widest">Étape {step} / 5</span>
            </div>
          </div>

          <div className="mb-4 max-w-4xl mx-auto">
            <div className="w-full h-3 bg-white border border-navy-100 rounded-full overflow-hidden shadow-inner p-0.5">
              <div
                className={`h-full transition-all duration-700 ease-out rounded-full ${situation === 'ma_cible' ? 'bg-accent-500 shadow-[0_0_12px_rgba(51,112,255,0.4)]' : 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]'}`}
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-5 sm:p-8 shadow-[0_40px_100px_rgba(11,29,78,0.08)] relative flex flex-col justify-center max-w-5xl mx-auto">
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/[0.03] rounded-full filter blur-[120px] -mr-64 -mt-64" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/[0.03] rounded-full filter blur-[120px] -ml-64 -mb-64" />
            </div>

            {isCalculating ? (
              <div key="loader" className="py-12 animate-fade-in flex flex-col items-center justify-center">
                <div className="relative">
                  <div className={`w-16 h-16 border-[5px] border-navy-50 border-t-current rounded-full animate-spin mb-6 ${situation === 'ma_cible' ? 'text-accent-500' : 'text-green-500'}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {situation === 'ma_cible' ? <Target className="w-6 h-6 text-accent-500 animate-pulse" /> : <Search className="w-6 h-6 text-green-500 animate-pulse" />}
                  </div>
                </div>
                <h2 className="text-2xl font-black text-navy-950 mb-2 tracking-tight">Analyse intelligente...</h2>
                <p className="text-navy-500 text-base font-medium">Recherche des meilleures opportunités pour votre projet.</p>
              </div>
            ) : (
              <div key={step} className="relative z-10">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
              </div>
            )}
          </div>

        </div>
      </div>
      <FAQSection faqs={simulationFaqs} title="Questions sur l'analyse" showContact={false} />
    </>
  );
}
