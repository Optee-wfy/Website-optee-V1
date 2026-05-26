const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split(/\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_SERVICE_KEY);

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&amp;|&quot;|&#39;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(html) {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function sourceList(sources) {
  return `<h2>Sources utiles pour approfondir</h2>${list(
    sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`)
  )}`;
}

function buildArticle(a) {
  return `
<p>${a.intro}</p>
<p>Pour les propriétaires, directeurs immobiliers, responsables techniques et exploitants, l'actualité énergétique française n'est plus un sujet abstrait. Elle modifie la manière de gérer un immeuble de bureaux à Paris, un commerce à Marseille, une école à Lyon, un hôtel à Nice, une plateforme logistique près de Lille ou un établissement de santé à Toulouse. Les décisions prises en 2026 conditionnent déjà la valeur locative, les charges, la conformité réglementaire et la capacité à financer les travaux avant les prochaines échéances.</p>
<p>L'enjeu pour un acteur tertiaire n'est donc pas de collectionner les textes, mais de transformer ces obligations en plan d'action mesurable. Un bon article de ressources doit aider à relier les mots clés recherchés par les utilisateurs, comme rénovation énergétique tertiaire France, Décret Tertiaire Paris, GTB Marseille, CEE bâtiment professionnel ou économies d'énergie bureaux, à des décisions concrètes : prioriser les sites, auditer les consommations, dimensionner les travaux, sécuriser les aides et suivre les gains dans la durée.</p>

<h2>Pourquoi ce sujet devient prioritaire en 2026</h2>
<p>${a.actuality}</p>
<p>La période est particulière parce que plusieurs calendriers se superposent. Les gestionnaires doivent suivre les consommations annuelles, préparer les objectifs 2030, intégrer les nouvelles règles de pilotage technique, arbitrer les contrats d'énergie, et composer avec la hausse de la demande de confort d'été. Dans les grandes villes françaises, la pression est encore plus forte : les bâtiments sont souvent occupés, anciens, contraints par la copropriété ou par l'architecture, et les décisions impliquent plusieurs parties prenantes.</p>
<p>Cette superposition crée un risque classique : traiter chaque sujet isolément. Un propriétaire peut lancer un relamping LED sans regarder la ventilation, installer une pompe à chaleur sans corriger les consignes de régulation, ou financer un projet CEE sans l'aligner avec sa trajectoire OPERAT. Le résultat est rarement optimal. La rénovation énergétique performante combine au contraire données, exploitation, travaux et financement dans une feuille de route unique.</p>

<h2>Ce que les acteurs tertiaires doivent retenir</h2>
<p>${a.mustKnow}</p>
<p>Dans un bâtiment tertiaire, les premiers gains viennent souvent de la connaissance. Avant de commander des travaux, il faut vérifier le périmètre assujetti, consolider les factures, comprendre les usages réels, identifier les horaires d'occupation et distinguer ce qui relève du propriétaire de ce qui relève de l'exploitant ou du locataire. Cette étape paraît administrative, mais elle évite des budgets mal ciblés et des discussions difficiles lorsque les gains ne sont pas au rendez-vous.</p>
<p>Le deuxième point est la preuve. Les dispositifs publics et les directions financières demandent de plus en plus de justificatifs : état initial, hypothèses, devis détaillés, fiches techniques, dates de mise en service, attestation de fin de travaux, mesure des consommations. Les entreprises qui structurent ces éléments dès le départ accélèrent les dossiers CEE, sécurisent les audits internes et disposent d'un historique utile en cas de vente ou de renégociation locative.</p>

<h2>Paris, Marseille, Lyon : des contextes locaux très différents</h2>
<p>${a.localAngle}</p>
<p>À Paris et en Île-de-France, la densité du parc de bureaux, les contraintes patrimoniales et la valeur immobilière rendent l'efficacité énergétique stratégique. Un actif mal classé, mal piloté ou coûteux à exploiter peut perdre en attractivité face à des immeubles rénovés, mieux équipés et plus faciles à documenter. Les directions immobilières recherchent donc des trajectoires qui améliorent rapidement les consommations sans immobiliser trop longtemps les surfaces louées.</p>
<p>À Marseille, Nice, Montpellier ou Toulon, la question du confort d'été pèse davantage dans les arbitrages. Une rénovation qui réduit les kWh de chauffage mais aggrave les surchauffes estivales risque de déplacer le problème vers la climatisation. Dans ces villes, la performance énergétique doit intégrer les protections solaires, la ventilation, la régulation, l'inertie, les usages et la production solaire lorsque le site s'y prête.</p>
<p>À Lyon, Lille, Nantes, Bordeaux, Rennes, Strasbourg ou Toulouse, les enjeux dépendent beaucoup de la typologie : sièges sociaux, commerces, campus, santé, enseignement, logistique ou équipements publics. Chaque usage a ses propres horaires, ses charges internes, ses contraintes de continuité et ses marges de sobriété. La méthode reste la même, mais le bon bouquet d'actions change fortement d'un bâtiment à l'autre.</p>

<h2>Les leviers techniques à prioriser</h2>
<p>${a.leversIntro}</p>
${list(a.levers)}
<p>Le bon ordre dépend du bâtiment, mais une règle reste valable : il faut commencer par ce qui permet de mesurer et de stabiliser. Un système de comptage fiable, des consignes cohérentes, une GTB bien paramétrée et une maintenance responsabilisée évitent de surdimensionner les travaux. Ensuite viennent les actions sur l'enveloppe, les équipements, l'éclairage, le chauffage, la climatisation, la ventilation et parfois la production locale d'électricité.</p>
<p>Dans un immeuble occupé, la phasage est déterminant. Les actions rapides, comme la correction des horaires, l'abaissement de températures inutiles, la détection d'équipements en marche hors occupation ou le remplacement de luminaires obsolètes, peuvent financer une partie de la suite. Les opérations plus lourdes, comme l'isolation, le changement de production thermique ou la reprise de CTA, doivent être articulées avec les baux, les arrêts techniques et les plans pluriannuels de travaux.</p>

<h2>Financement : CEE, Fonds vert, budget travaux et valeur verte</h2>
<p>${a.financing}</p>
<p>Les Certificats d'économies d'énergie restent un levier central pour les bâtiments professionnels, mais ils ne remplacent pas une stratégie budgétaire. Les montants varient selon les fiches, les volumes, la zone climatique, la date d'engagement, les caractéristiques techniques et les contrôles. Pour éviter les mauvaises surprises, le dossier doit être cadré avant signature des devis. C'est particulièrement vrai pour les projets multi-sites, où une erreur de calendrier peut réduire fortement l'aide mobilisable.</p>
<p>Pour les collectivités, le Fonds vert et les programmes associés peuvent soutenir les rénovations de bâtiments publics locaux, notamment les écoles, équipements sportifs, médiathèques, mairies et bâtiments administratifs. Pour les foncières, entreprises et commerçants, l'analyse doit aussi intégrer la valeur verte : un bâtiment moins énergivore, mieux documenté et plus confortable se défend mieux dans une négociation locative ou une cession.</p>

<h2>Erreurs fréquentes à éviter</h2>
${list(a.mistakes)}
<p>La plus coûteuse reste de raisonner uniquement en coût de travaux. Une opération moins chère peut être défavorable si elle ne règle pas les dérives d'exploitation, si elle n'est pas compatible avec les obligations à venir ou si elle dégrade le confort. À l'inverse, une opération plus ambitieuse peut être rationnelle lorsqu'elle réduit durablement les charges, améliore l'attractivité et limite les reprises ultérieures.</p>
<p>Autre erreur fréquente : négliger la conduite du changement. Les occupants peuvent annuler une partie des économies si les consignes ne sont pas comprises, si les plages horaires ne correspondent pas aux usages ou si les réglages sont contournés. L'énergie tertiaire est un sujet technique, mais aussi organisationnel. Les gains tiennent mieux lorsque les équipes d'accueil, maintenance, exploitation, achats, finance et immobilier partagent le même tableau de bord.</p>

<h2>Plan d'action recommandé pour les 90 prochains jours</h2>
<p>${a.actionPlanIntro}</p>
<ol>
  <li>Cartographier les sites concernés, les surfaces, les compteurs, les contrats et les responsabilités propriétaire-locataire.</li>
  <li>Rassembler les consommations sur au moins trois années et repérer les anomalies d'occupation, de météo ou de facturation.</li>
  <li>Classer les bâtiments par risque réglementaire, coût énergétique, facilité de travaux et potentiel de financement.</li>
  <li>Lancer un audit ciblé sur les sites prioritaires, avec un volet exploitation, un volet travaux et un volet aides financières.</li>
  <li>Construire une trajectoire de performance en lots cohérents, datés, budgétés et reliés aux objectifs 2030.</li>
  <li>Mettre en place un suivi mensuel simple : kWh, euros, dérives, actions réalisées, gains estimés et gains mesurés.</li>
</ol>
<p>Cette méthode évite de transformer la rénovation énergétique en chantier permanent sans pilotage. Elle permet de choisir les actions qui produisent vite des résultats, de documenter les décisions et de préparer les investissements plus lourds avec une base fiable. Pour une direction générale, le sujet devient lisible : un portefeuille, des risques, des économies, des échéances et un retour sur investissement.</p>

<h2>Quels mots clés SEO travailler autour de ce thème</h2>
<p>Pour capter une demande qualifiée, le contenu doit combiner des requêtes nationales et locales. Les expressions comme <strong>${a.primaryKeyword}</strong>, rénovation énergétique tertiaire France, audit énergétique bâtiment professionnel, économies d'énergie bureaux, travaux CEE tertiaire, performance énergétique commerce et pilotage énergétique bâtiment répondent à une intention claire. Elles doivent être enrichies avec des localisations : Paris, Marseille, Lyon, Toulouse, Bordeaux, Lille, Nantes, Nice, Rennes ou Strasbourg.</p>
<p>Les requêtes locales sont utiles parce que les internautes cherchent souvent un interlocuteur capable de comprendre leurs contraintes de ville, de climat, de parc et de réglementation. Un responsable immobilier peut taper Décret Tertiaire Paris bureaux haussmanniens, GTB Marseille bâtiment tertiaire, CEE commerce Lyon ou rénovation énergétique école Nantes. Un article efficace doit donc rester national dans l'analyse et concret dans les exemples géographiques.</p>

<h2>Ce qu'Optee peut apporter</h2>
<p>${a.opteeAngle}</p>
<p>L'intérêt d'une approche intégrée est de relier la conformité, la technique et le financement. Un audit isolé donne une photographie. Une plateforme et un accompagnement donnent une trajectoire : suivi des consommations, priorisation, simulation de gains, préparation des dossiers d'aides, coordination des travaux et mesure des résultats. Pour un propriétaire ou un exploitant, c'est la différence entre subir les obligations et les utiliser pour moderniser son patrimoine.</p>
<p>En 2026, les bâtiments qui avancent le plus vite ne sont pas forcément ceux qui lancent les plus gros chantiers. Ce sont ceux qui disposent d'une donnée fiable, d'un calendrier clair, d'une gouvernance courte et d'un plan de financement anticipé. Cette discipline permet de transformer les réglementations françaises en avantage opérationnel, que le bâtiment soit situé à Paris, Marseille, Lyon ou dans une ville moyenne.</p>
${sourceList(a.sources)}
`.trim();
}

const commonSources = {
  eet: { label: 'Ministère de la Transition écologique - Éco Énergie Tertiaire', url: 'https://www.ecologie.gouv.fr/eco-energie-tertiaire-eet' },
  operat: { label: 'ADEME - plateforme OPERAT', url: 'https://operat.ademe.fr/' },
  bacs: { label: 'Légifrance - décret BACS n° 2023-259', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047422489' },
  cee: { label: 'Ministère de l’Économie - revue CEE 6e période', url: 'https://www.economie.gouv.fr/cge/revue-du-dispositif-des-certificats-deconomies-denergie-en-preparation-de-la-6eme-periode' },
  ceeConsult: { label: 'Consultation publique - sixième période CEE 2026-2030', url: 'https://www.consultations-publiques.developpement-durable.gouv.fr/projet-de-decret-relatif-a-la-sixieme-periode-du-a3208.html' },
  re2020: { label: 'Légifrance - décret RE2020 tertiaire n° 2026-16', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053378848' },
  cre: { label: 'CRE - délibération TRVE 2026', url: 'https://www.cre.fr/fileadmin/Documents/Deliberations/2026/260114_2026-06_TRVE_2026.pdf' },
  fondsVert: { label: 'Ministère de la Transition écologique - Fonds vert', url: 'https://www.ecologie.gouv.fr/fonds-vert' },
  adapt: { label: 'Ministère de la Transition écologique - Adapt-Bâti-Confort', url: 'https://www.ecologie.gouv.fr/index.php/presse/lancement-du-programme-adapt-bati-confort-finance-certificats-deconomie-denergie-cee' },
  aper: { label: 'Légifrance - article 40 de la loi APER', url: 'https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000047294291' },
};

const baseDate = '2026-05-25T08:00:00+00:00';

const articleInputs = [
  {
    title: 'Décret Tertiaire 2026 : comment préparer vos attestations OPERAT avant 2030',
    slug: 'decret-tertiaire-2026-attestations-operat-2030',
    excerpt: 'En 2026, les gestionnaires tertiaires doivent fiabiliser leurs données OPERAT et préparer la trajectoire 2030. Méthode pour Paris, Marseille, Lyon et partout en France.',
    cover_image: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg',
    cover_image_alt: 'Tableau de suivi énergétique pour déclaration OPERAT Décret Tertiaire',
    meta_description: 'Décret Tertiaire 2026 : préparer OPERAT, fiabiliser les données, piloter les objectifs 2030 et réduire les consommations tertiaires en France.',
    tags: ['Réglementation', 'Tertiaire', 'Guide'],
    primaryKeyword: 'Décret Tertiaire 2026 OPERAT',
    intro: 'Le Décret Tertiaire reste l’un des sujets les plus recherchés par les gestionnaires de bâtiments professionnels en France. En 2026, la question n’est plus seulement de savoir si un site est assujetti, mais de savoir si les données déclarées sur OPERAT sont fiables, exploitables et reliées à une trajectoire crédible vers 2030.',
    actuality: 'L’actualité vient du passage d’une logique de déclaration à une logique de preuve. Le ministère rappelle que l’obligation Éco Énergie Tertiaire vise une réduction progressive des consommations finales, avec des objectifs de moins 40 % en 2030, moins 50 % en 2040 et moins 60 % en 2050. Les propriétaires et occupants doivent donc transformer les consommations déclarées en plan de performance.',
    mustKnow: 'Le dispositif concerne les bâtiments, parties de bâtiments ou ensembles de bâtiments à usage tertiaire dépassant les seuils réglementaires. La plateforme OPERAT centralise les consommations, les objectifs et les attestations. Le point critique est la cohérence entre surface, activité, année de référence, compteurs et situation d’occupation.',
    localAngle: 'Dans un portefeuille parisien, la difficulté tient souvent à la multiplicité des lots, aux copropriétés et à la séparation entre bailleur et preneur. À Marseille ou Montpellier, les consommations de climatisation et les pics estivaux peuvent peser davantage dans la trajectoire. À Lyon, Nantes ou Lille, les typologies mixtes bureaux-commerces-logistique demandent un découpage fin.',
    leversIntro: 'Pour tenir la trajectoire 2030, il faut articuler actions immédiates et investissements structurels.',
    levers: [
      'Fiabiliser les données OPERAT : surfaces, activités, compteurs, factures, année de référence et justificatifs.',
      'Mettre en place un suivi mensuel par usage pour détecter les dérives de chauffage, ventilation, climatisation, éclairage et auxiliaires.',
      'Corriger les horaires, consignes et dérives de régulation avant de dimensionner des travaux lourds.',
      'Prioriser les bâtiments dont l’écart à l’objectif 2030 est le plus élevé ou dont les charges énergétiques pénalisent la location.',
      'Relier chaque opération à un gain mesurable, à un budget et à une possibilité de financement CEE.',
    ],
    financing: 'Le financement doit être pensé dès la feuille de route. Les CEE peuvent soutenir certaines opérations, mais la valeur la plus importante vient souvent de l’ordre des actions : mesurer, optimiser, investir, puis vérifier. Une rénovation tertiaire à Paris ou Marseille peut perdre une partie de son intérêt si le dossier d’aide est préparé après signature du devis.',
    mistakes: [
      'Déclarer des consommations sans conserver les justificatifs ni documenter les changements d’occupation.',
      'Choisir une année de référence favorable en apparence mais impossible à expliquer lors d’un audit.',
      'Lancer des travaux isolés sans vérifier leur contribution à l’objectif 2030.',
      'Oublier les locataires dans la gouvernance énergétique alors qu’ils influencent fortement les usages.',
      'Comparer des bâtiments entre eux sans tenir compte des surfaces, horaires et catégories d’activité.',
    ],
    actionPlanIntro: 'Une organisation simple suffit souvent pour reprendre le contrôle avant les prochaines échéances.',
    opteeAngle: 'Optee peut aider à transformer les déclarations OPERAT en outil de pilotage. Le besoin n’est pas seulement de remplir une plateforme, mais de savoir quels bâtiments traiter, avec quelles actions, dans quel ordre et avec quel financement.',
    sources: [commonSources.eet, commonSources.operat, commonSources.cee],
  },
  {
    title: 'Décret BACS 2027 : pourquoi installer une GTB dès 2026 dans les bâtiments tertiaires',
    slug: 'decret-bacs-2027-gtb-2026-batiments-tertiaires',
    excerpt: 'L’échéance BACS 2027 approche pour les systèmes CVC de plus de 70 kW. Découvrez comment anticiper avec une GTB utile, financée et réellement exploitée.',
    cover_image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    cover_image_alt: 'Supervision GTB bâtiment tertiaire et Décret BACS',
    meta_description: 'Décret BACS 2027 : obligations GTB, seuil 70 kW, financement CEE et méthode pour piloter les bâtiments tertiaires en France dès 2026.',
    tags: ['Domotique', 'Réglementation', 'Technique'],
    primaryKeyword: 'Décret BACS GTB 2027',
    intro: 'Le Décret BACS est devenu un sujet central pour les bâtiments tertiaires équipés de systèmes de chauffage, climatisation ou ventilation significatifs. En 2026, attendre l’échéance 2027 revient souvent à subir les plannings des intégrateurs, les contraintes d’exploitation et les délais de financement.',
    actuality: 'Le décret n° 2023-259 a renforcé l’obligation d’équiper les bâtiments tertiaires de systèmes d’automatisation et de contrôle. Les bâtiments avec des systèmes supérieurs à 290 kW étaient visés avant 2025, tandis que ceux au-dessus de 70 kW doivent être traités au plus tard le 1er janvier 2027, sauf cas d’exemption justifié par le temps de retour.',
    mustKnow: 'Une GTB conforme ne se limite pas à un écran de supervision. Elle doit permettre le suivi, l’enregistrement, l’analyse, l’ajustement des systèmes techniques et l’alerte en cas de dérive. Elle doit aussi être exploitable par les équipes sur site, sinon elle reste un investissement réglementaire sans effet durable.',
    localAngle: 'À Paris, beaucoup de bâtiments ont des installations techniques en sous-sol, des réseaux complexes et des surfaces louées à plusieurs occupants. À Marseille, Nice ou Toulouse, la GTB doit souvent gérer le confort d’été et la climatisation. À Lyon ou Grenoble, le sujet peut être lié au chauffage, à la ventilation et aux réseaux urbains.',
    leversIntro: 'Une bonne GTB commence par une expression de besoin précise, pas par le choix d’un logiciel.',
    levers: [
      'Inventorier les puissances CVC, les automates existants, les compteurs et les équipements raccordables.',
      'Définir les points utiles : températures, consignes, horaires, états de marche, défauts, consommations et indicateurs de confort.',
      'Prévoir l’interopérabilité pour éviter l’enfermement dans une solution propriétaire difficile à faire évoluer.',
      'Former l’exploitant et contractualiser des objectifs de résultat, pas seulement une maintenance corrective.',
      'Utiliser la GTB pour alimenter le suivi énergétique et la stratégie Décret Tertiaire.',
    ],
    financing: 'Le financement par CEE peut rendre le projet plus acceptable, notamment lorsque la GTB est intégrée à une stratégie plus large de réduction des consommations. Le dossier doit être cadré avant engagement. Il faut vérifier la fiche applicable, les exigences techniques, les preuves demandées et les contrôles possibles.',
    mistakes: [
      'Installer une supervision sans plan de comptage ni indicateurs d’exploitation.',
      'Multiplier les capteurs sans définir les décisions qu’ils permettront de prendre.',
      'Négliger la cybersécurité et les accès distants aux équipements techniques.',
      'Oublier la formation des mainteneurs, ce qui conduit à des consignes contournées ou figées.',
      'Traiter BACS séparément du Décret Tertiaire alors que les deux calendriers se renforcent.',
    ],
    actionPlanIntro: 'Pour anticiper 2027, les gestionnaires peuvent avancer dès maintenant avec une démarche pragmatique.',
    opteeAngle: 'Optee peut aider à qualifier les sites concernés, hiérarchiser les bâtiments au-dessus de 70 kW, simuler les gains et suivre si la GTB produit réellement les économies attendues.',
    sources: [commonSources.bacs, commonSources.eet, commonSources.cee],
  },
  {
    title: 'CEE 2026-2030 : quelles opportunités pour financer la rénovation tertiaire en France',
    slug: 'cee-2026-2030-financer-renovation-tertiaire-france',
    excerpt: 'La 6e période CEE redéfinit les conditions de financement des économies d’énergie. Guide pour préparer les dossiers tertiaires à Paris, Lyon, Marseille et en régions.',
    cover_image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    cover_image_alt: 'Montage financier CEE rénovation énergétique tertiaire',
    meta_description: 'CEE 2026-2030 : comprendre la 6e période, financer les travaux tertiaires et sécuriser les dossiers de rénovation énergétique en France.',
    tags: ['CEE', 'Financement', 'Guide'],
    primaryKeyword: 'CEE 2026 rénovation tertiaire',
    intro: 'Les Certificats d’économies d’énergie sont au cœur du financement de nombreuses opérations de rénovation énergétique. En 2026, l’entrée dans la 6e période CEE change le contexte de décision pour les entreprises, collectivités, syndics et foncières qui veulent financer leurs bâtiments tertiaires.',
    actuality: 'Les pouvoirs publics ont préparé la sixième période CEE 2026-2030 avec une attention particulière portée au niveau d’obligation, aux contrôles, aux seuils et aux modalités de pondération. Le Conseil général de l’économie rappelle que le dispositif représente plusieurs milliards d’euros annuels et qu’il doit gagner en stabilité, stratégie et évaluation.',
    mustKnow: 'Un dossier CEE est d’abord un dossier de preuve. Il ne suffit pas qu’une opération économise de l’énergie : elle doit respecter une fiche standardisée ou un cadre spécifique, être engagée au bon moment, produire les justificatifs demandés et être cohérente avec la situation réelle du bâtiment.',
    localAngle: 'À Paris, les CEE peuvent soutenir des opérations sur des bureaux anciens, des hôtels, des commerces ou des copropriétés tertiaires. À Marseille et Nice, les projets de régulation, climatisation performante, isolation et protections solaires peuvent être prioritaires. À Lille, Strasbourg ou Rennes, les besoins de chauffage et de ventilation pèsent souvent plus lourd.',
    leversIntro: 'Pour maximiser les aides, il faut organiser les opérations comme un portefeuille.',
    levers: [
      'Identifier les fiches CEE pertinentes avant toute signature : chauffage, GTB, isolation, éclairage, ventilation ou récupération de chaleur.',
      'Comparer le montant de prime avec le gain réel, le reste à charge et la contribution à la trajectoire Décret Tertiaire.',
      'Regrouper les sites similaires pour améliorer la négociation et standardiser les preuves.',
      'Anticiper les contrôles : photos, fiches techniques, attestations, dates, surfaces et puissances.',
      'Éviter de construire le plan travaux uniquement autour de la prime disponible.',
    ],
    financing: 'La 6e période rend encore plus nécessaire une lecture financière complète. Une prime CEE peut déclencher un investissement, mais le retour doit intégrer les économies d’énergie, la maintenance, la valeur immobilière, le confort et la conformité. Dans certains cas, le meilleur projet n’est pas celui qui maximise la subvention, mais celui qui réduit durablement le coût total d’exploitation.',
    mistakes: [
      'Signer les devis avant d’avoir sécurisé l’éligibilité CEE.',
      'Sous-estimer les délais de collecte documentaire sur un portefeuille multi-sites.',
      'Confondre prime théorique et prime effectivement versée après contrôle.',
      'Choisir une opération standardisée qui ne règle pas la dérive principale du bâtiment.',
      'Oublier d’intégrer les CEE dans le budget pluriannuel des travaux.',
    ],
    actionPlanIntro: 'La préparation de la 6e période peut être structurée en actions courtes et vérifiables.',
    opteeAngle: 'Optee peut aider à détecter les opérations finançables, simuler les gains, prioriser les sites et suivre les économies après travaux pour éviter que le financement soit déconnecté de la performance réelle.',
    sources: [commonSources.cee, commonSources.ceeConsult, commonSources.eet],
  },
  {
    title: 'RE2020 tertiaire 2026 : ce qui change pour hôtels, commerces, santé et équipements publics',
    slug: 're2020-tertiaire-2026-hotels-commerces-sante-equipements',
    excerpt: 'Depuis mai 2026, la RE2020 s’étend à de nouvelles catégories tertiaires. Impacts pour les projets neufs, rénovations lourdes et stratégies énergétiques.',
    cover_image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
    cover_image_alt: 'Bâtiment tertiaire neuf soumis aux exigences RE2020',
    meta_description: 'RE2020 tertiaire 2026 : nouvelles catégories concernées, performance énergétique, carbone, confort d’été et impacts pour les bâtiments professionnels.',
    tags: ['Réglementation', 'Tertiaire', 'Technique'],
    primaryKeyword: 'RE2020 tertiaire 2026',
    intro: 'La RE2020 n’est plus seulement un sujet de logements, de bureaux ou d’enseignement classique. En 2026, son extension à de nouvelles catégories tertiaires et industrielles modifie la manière de concevoir les hôtels, commerces, restaurants, établissements de santé, équipements sportifs, médiathèques et bâtiments universitaires.',
    actuality: 'Le décret n° 2026-16 du 15 janvier 2026 fixe des exigences de performance énergétique et environnementale pour plusieurs activités tertiaires spécifiques. Il entre en vigueur pour les demandes de permis de construire et déclarations préalables déposées à compter du 1er mai 2026 en France métropolitaine.',
    mustKnow: 'Le texte vise plusieurs exigences de résultat : conception énergétique du bâti, consommation d’énergie primaire, impact carbone des consommations, impact carbone des composants et limitation de l’inconfort en période estivale. Pour un maître d’ouvrage, cela déplace les arbitrages dès la programmation.',
    localAngle: 'À Paris, l’enjeu est de concilier rareté foncière, densité et performance environnementale. À Marseille, Nice ou Montpellier, le confort d’été devient un paramètre de conception majeur. À Lyon, Bordeaux ou Nantes, les projets mixtes doivent articuler exigences neuves et stratégie de performance future en exploitation.',
    leversIntro: 'La RE2020 tertiaire doit être anticipée dès les premières esquisses.',
    levers: [
      'Intégrer l’énergie, le carbone et le confort d’été dans le programme, pas seulement dans l’étude thermique finale.',
      'Comparer les solutions constructives en coût global : matériaux, systèmes, maintenance, confort et flexibilité d’usage.',
      'Prévoir le pilotage et le comptage pour que le bâtiment neuf reste performant après livraison.',
      'Aligner la conception RE2020 avec les futures obligations d’exploitation et le Décret Tertiaire.',
      'Travailler la sobriété passive : orientation, protections solaires, ventilation, inertie et éclairage naturel.',
    ],
    financing: 'La RE2020 ne se finance pas comme une opération CEE classique, mais elle influence les coûts d’exploitation futurs et la valeur de l’actif. Pour les maîtres d’ouvrage publics, les arbitrages peuvent être reliés aux dispositifs de soutien à la transition écologique. Pour les investisseurs privés, la réduction du risque réglementaire devient un argument financier.',
    mistakes: [
      'Traiter la RE2020 comme une contrainte de fin de conception.',
      'Optimiser le calcul réglementaire sans penser à l’exploitation réelle du bâtiment.',
      'Sous-estimer le confort d’été dans les villes du Sud et les zones urbaines denses.',
      'Livrer un bâtiment performant sans outils de pilotage ni formation de l’exploitant.',
      'Oublier que le bâtiment neuf aura ensuite une vie énergétique mesurée et comparée.',
    ],
    actionPlanIntro: 'Un projet concerné par l’extension RE2020 doit être cadré très tôt.',
    opteeAngle: 'Optee peut intervenir en aval de la conception pour préparer le pilotage d’exploitation, définir les indicateurs de performance et éviter que les ambitions réglementaires se perdent après la livraison.',
    sources: [commonSources.re2020, commonSources.eet, commonSources.adapt],
  },
  {
    title: 'Prix de l’électricité 2026 : comment les entreprises tertiaires peuvent réduire leur facture',
    slug: 'prix-electricite-2026-entreprises-tertiaires-reduire-facture',
    excerpt: 'Entre TURPE, contrats, profils de consommation et pilotage, les entreprises tertiaires disposent de leviers concrets pour baisser leur facture d’électricité.',
    cover_image: 'https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg',
    cover_image_alt: 'Analyse de facture électricité entreprise tertiaire',
    meta_description: 'Prix électricité 2026 entreprises : réduire la facture tertiaire avec pilotage, contrats, TURPE, puissance souscrite et efficacité énergétique.',
    tags: ['Financement', 'Tertiaire', 'Technique'],
    primaryKeyword: 'prix électricité entreprises 2026',
    intro: 'Le prix de l’électricité reste un sujet de direction générale pour les entreprises tertiaires. Même lorsque les marchés se détendent, la facture dépend du contrat, de l’acheminement, de la puissance souscrite, des taxes, des consommations en pointe et de la capacité du bâtiment à piloter ses usages.',
    actuality: 'La CRE a publié en janvier 2026 une délibération sur les tarifs réglementés de vente d’électricité, avec des éléments sur les coûts d’approvisionnement, les risques, les coûts d’acheminement et le TURPE. Même si toutes les entreprises ne sont pas au tarif réglementé, ces références rappellent que la facture ne se résume pas au prix du kWh.',
    mustKnow: 'Pour un bâtiment tertiaire, réduire la facture passe par deux familles d’actions : acheter mieux et consommer mieux. Acheter mieux signifie vérifier le contrat, la puissance, les options, les périodes et la stratégie de renouvellement. Consommer mieux signifie réduire les volumes inutiles, lisser les pointes et piloter les équipements.',
    localAngle: 'À Paris, les grands immeubles de bureaux peuvent avoir des pointes liées à la climatisation, aux ascenseurs et à la ventilation. À Marseille, les appels de puissance estivaux sont souvent déterminants. À Lyon, Lille ou Strasbourg, le chauffage électrique, les CTA et les usages numériques peuvent structurer le profil.',
    leversIntro: 'La baisse de facture la plus robuste combine énergie, exploitation et achats.',
    levers: [
      'Analyser la courbe de charge pour repérer les consommations nocturnes, week-end et jours fériés.',
      'Vérifier la puissance souscrite et les dépassements éventuels avec un regard technique, pas seulement comptable.',
      'Comparer les contrats en tenant compte du profil de consommation et des risques de marché.',
      'Piloter CVC, éclairage, ventilation et recharge de véhicules pour réduire les pointes.',
      'Mesurer les gains après chaque action afin de séparer effet prix et effet volume.',
    ],
    financing: 'La réduction de facture finance souvent les premières actions. Un audit de courbe de charge, une correction de consignes ou une programmation horaire peuvent produire des économies rapides. Les travaux plus lourds, comme GTB, relamping, remplacement d’équipements ou autoconsommation, doivent être évalués avec les CEE, le coût de maintenance et le prix prévisible de l’énergie.',
    mistakes: [
      'Renégocier le contrat sans traiter les consommations hors occupation.',
      'Comparer deux offres uniquement sur le prix unitaire sans regarder l’acheminement et la puissance.',
      'Ignorer les appels de puissance liés au démarrage simultané des équipements.',
      'Installer des équipements performants sans plan de pilotage.',
      'Ne pas suivre la facture après travaux, ce qui empêche de corriger les écarts.',
    ],
    actionPlanIntro: 'Une entreprise peut obtenir une première vision en moins de trois mois.',
    opteeAngle: 'Optee peut aider à croiser données de facture, usages, équipements et actions techniques pour bâtir un plan qui réduit à la fois les kWh et les euros.',
    sources: [commonSources.cre, commonSources.bacs, commonSources.eet],
  },
  {
    title: 'Confort d’été dans les bureaux : adapter les bâtiments français aux canicules',
    slug: 'confort-ete-bureaux-adapter-batiments-france-canicules',
    excerpt: 'Les canicules changent les priorités de rénovation : protections solaires, ventilation, GTB, sobriété et solutions financées pour les bureaux et bâtiments publics.',
    cover_image: 'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg',
    cover_image_alt: 'Bureaux lumineux avec protections solaires pour confort d’été',
    meta_description: 'Confort d’été bureaux : adapter les bâtiments tertiaires aux canicules avec protections solaires, ventilation, GTB et programme Adapt-Bâti-Confort.',
    tags: ['Technique', 'Tertiaire', 'Guide'],
    primaryKeyword: 'confort d’été bureaux rénovation énergétique',
    intro: 'Le confort d’été est devenu un critère majeur de performance énergétique. Dans les bureaux, écoles, commerces et équipements publics, la question n’est plus seulement de chauffer moins en hiver, mais d’éviter les surchauffes sans faire exploser les consommations de climatisation.',
    actuality: 'Le programme Adapt-Bâti-Confort, financé par les CEE, illustre cette évolution. Les pouvoirs publics relient de plus en plus rénovation énergétique et adaptation climatique, notamment pour soutenir des solutions de rafraîchissement sobres dans les bâtiments exposés aux vagues de chaleur.',
    mustKnow: 'Un bâtiment peut être performant sur le papier et inconfortable en été. Le confort dépend de l’orientation, des vitrages, des protections solaires, de l’inertie, de la ventilation, des apports internes, des horaires et de la régulation. L’efficacité énergétique doit donc intégrer les degrés d’inconfort, pas seulement les kWh annuels.',
    localAngle: 'À Marseille, Nice, Montpellier et Toulouse, le confort d’été est souvent au cœur du projet. À Paris et Lyon, les îlots de chaleur urbains renforcent aussi les besoins de protection solaire et de ventilation nocturne. À Lille ou Rennes, les épisodes chauds sont moins longs mais peuvent surprendre des bâtiments peu adaptés.',
    leversIntro: 'Les solutions efficaces privilégient d’abord la réduction du besoin de froid.',
    levers: [
      'Installer ou restaurer des protections solaires extérieures adaptées à l’orientation.',
      'Limiter les apports internes : éclairage obsolète, équipements numériques, horaires de ventilation mal réglés.',
      'Exploiter la ventilation nocturne lorsque le bâtiment, la sécurité et le climat local le permettent.',
      'Piloter la climatisation avec des consignes sobres, des horaires cohérents et une maintenance rigoureuse.',
      'Suivre les températures réelles par zone pour détecter les locaux critiques.',
    ],
    financing: 'Le confort d’été peut être financé indirectement par plusieurs leviers : CEE sur certains équipements, programmes dédiés, budgets de rénovation, Fonds vert pour des bâtiments publics, et gains d’exploitation. La décision doit tenir compte de la productivité, de l’absentéisme, de la satisfaction des occupants et des risques sanitaires lors des fortes chaleurs.',
    mistakes: [
      'Répondre à toute surchauffe par plus de climatisation sans réduire les apports solaires.',
      'Isoler sans traiter la ventilation et les protections, ce qui peut piéger la chaleur.',
      'Choisir une consigne trop basse qui augmente les consommations et les conflits d’usage.',
      'Oublier les locaux sensibles : salles de réunion, salles serveurs, crèches, classes ou zones exposées plein ouest.',
      'Ne pas mesurer les températures intérieures avant et après travaux.',
    ],
    actionPlanIntro: 'Le diagnostic confort d’été doit combiner mesures, observation et retours occupants.',
    opteeAngle: 'Optee peut aider à relier les données de température, consommation et occupation pour prioriser les zones à traiter et vérifier que les solutions réduisent réellement l’inconfort.',
    sources: [commonSources.adapt, commonSources.re2020, commonSources.eet],
  },
  {
    title: 'Ombrières photovoltaïques 2026 : obligations APER pour les parkings tertiaires',
    slug: 'ombrieres-photovoltaiques-2026-obligations-aper-parkings-tertiaires',
    excerpt: 'Les grands parkings extérieurs doivent anticiper les échéances de solarisation. Guide pour commerces, foncières, hôtels, hôpitaux et sites logistiques.',
    cover_image: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
    cover_image_alt: 'Ombrières photovoltaïques sur parking tertiaire',
    meta_description: 'Ombrières photovoltaïques 2026 : obligations loi APER, parkings tertiaires, échéances, autoconsommation et stratégie énergétique en France.',
    tags: ['Réglementation', 'Technique', 'Tertiaire'],
    primaryKeyword: 'ombrières photovoltaïques parking 2026',
    intro: 'Les ombrières photovoltaïques ne sont plus seulement un projet d’image pour les commerces, hôtels, hôpitaux, campus et plateformes logistiques. Avec la loi APER, certains parkings extérieurs doivent intégrer des dispositifs d’ombrage et de production d’énergie renouvelable selon un calendrier précis.',
    actuality: 'L’article 40 de la loi du 10 mars 2023 relative à l’accélération de la production d’énergies renouvelables prévoit des obligations pour les parcs de stationnement extérieurs de plus de 1 500 m². Pour les parkings non concédés d’au moins 10 000 m², l’échéance du 1er juillet 2026 est un repère majeur.',
    mustKnow: 'Le sujet ne se résume pas à poser des panneaux. Il faut vérifier le périmètre, les exemptions possibles, la structure, le raccordement, l’usage du parking, la sécurité incendie, la gestion des eaux pluviales, la maintenance et le modèle économique : vente totale, autoconsommation, tiers-investissement ou montage hybride.',
    localAngle: 'À Marseille, Montpellier, Nice et Toulouse, l’ensoleillement renforce l’intérêt économique et le confort usager. À Paris et en première couronne, la rareté foncière peut rendre chaque mètre carré plus stratégique. À Lyon, Bordeaux, Lille ou Nantes, les grands parkings de zones commerciales et logistiques doivent arbitrer vite.',
    leversIntro: 'Un projet d’ombrières réussi doit être conçu comme un actif énergétique.',
    levers: [
      'Mesurer la surface réelle du parking et vérifier si elle entre dans le champ des obligations.',
      'Étudier le raccordement, les contraintes de structure, la circulation, les accès pompiers et l’exploitation quotidienne.',
      'Comparer autoconsommation, revente, stockage éventuel et couplage avec bornes de recharge.',
      'Intégrer les ombrières à la stratégie de réduction de facture et à l’image RSE du site.',
      'Planifier les études et autorisations suffisamment tôt pour tenir les échéances.',
    ],
    financing: 'Le financement peut passer par l’investissement direct, le tiers-investissement, un contrat d’achat d’électricité ou un montage d’autoconsommation. Le bon choix dépend de la consommation du site, de son profil horaire, du coût de l’électricité, des contraintes de trésorerie et de la capacité à exploiter l’installation sur la durée.',
    mistakes: [
      'Attendre la date limite alors que les études, autorisations et raccordements prennent du temps.',
      'Dimensionner uniquement selon la surface sans regarder les consommations du bâtiment.',
      'Oublier les usages futurs comme la recharge de véhicules électriques.',
      'Négliger la maintenance, le nettoyage, les assurances et la supervision de production.',
      'Traiter le photovoltaïque séparément du plan global d’efficacité énergétique.',
    ],
    actionPlanIntro: 'Les gestionnaires de parkings peuvent démarrer par un cadrage rapide.',
    opteeAngle: 'Optee peut aider à intégrer les ombrières dans un plan énergétique global : baisse de facture, autoconsommation, pilotage, suivi de production et cohérence avec les obligations tertiaires.',
    sources: [commonSources.aper, commonSources.cre, commonSources.eet],
  },
  {
    title: 'Rénovation énergétique des écoles : Fonds vert, confort et économies pour les collectivités',
    slug: 'renovation-energetique-ecoles-fonds-vert-confort-economies-collectivites',
    excerpt: 'Les écoles et bâtiments publics locaux sont au cœur de la transition énergétique. Méthode pour mobiliser Fonds vert, audits, travaux et suivi des gains.',
    cover_image: 'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg',
    cover_image_alt: 'École rénovée pour améliorer la performance énergétique',
    meta_description: 'Rénovation énergétique écoles : Fonds vert 2026, confort d’été, économies d’énergie et méthode pour collectivités en France.',
    tags: ['Financement', 'Isolation', 'Guide'],
    primaryKeyword: 'rénovation énergétique écoles Fonds vert',
    intro: 'Les écoles sont au centre des politiques locales de rénovation énergétique. Elles consomment de l’énergie, accueillent des publics sensibles, subissent les épisodes de chaleur et représentent souvent une part visible du patrimoine communal. En 2026, les collectivités cherchent à transformer les aides disponibles en projets concrets.',
    actuality: 'Le Fonds vert est reconduit en 2026 avec une enveloppe annoncée pour accélérer la transition écologique dans les territoires. Il soutient notamment la rénovation énergétique des bâtiments publics locaux, l’adaptation au changement climatique et l’amélioration du cadre de vie.',
    mustKnow: 'Une école ne se rénove pas comme un immeuble de bureaux. Les horaires, vacances, contraintes de sécurité, acoustique, ventilation, confort d’été et continuité pédagogique imposent un phasage précis. Les économies d’énergie doivent être compatibles avec la santé et le confort des élèves et personnels.',
    localAngle: 'À Marseille, les écoles exposées aux fortes chaleurs doivent prioriser protections solaires, ventilation et confort d’été. À Paris, Lyon ou Lille, l’enjeu peut être l’isolation, le chauffage et la ventilation dans des bâtiments anciens. À Nantes, Bordeaux ou Rennes, les collectivités cherchent souvent des opérations reproductibles sur plusieurs sites.',
    leversIntro: 'Les écoles demandent une approche globale mais très opérationnelle.',
    levers: [
      'Réaliser un audit par bâtiment avec consommations, confort, ventilation, enveloppe et systèmes.',
      'Planifier les travaux pendant les vacances ou par zones pour limiter l’impact pédagogique.',
      'Combiner isolation, ventilation, chauffage, éclairage LED, régulation et protections solaires.',
      'Mesurer les températures et la qualité d’air intérieur avant de décider des priorités.',
      'Documenter les gains pour sécuriser les financements et convaincre les élus.',
    ],
    financing: 'Le Fonds vert peut soutenir des projets de rénovation énergétique des bâtiments publics, mais il ne dispense pas d’un plan financier robuste. Les collectivités doivent articuler subventions, CEE, budget communal, programmation pluriannuelle et coûts d’exploitation évités. Un bon dossier décrit le gain énergétique, le gain carbone, le confort et la capacité à réaliser.',
    mistakes: [
      'Lancer un chantier d’isolation sans traiter la ventilation et la qualité d’air.',
      'Choisir les bâtiments selon l’urgence politique plutôt que selon les gains et risques réels.',
      'Sous-estimer les délais d’études, de marchés publics et de travaux en site occupé.',
      'Oublier de former les agents techniques aux nouveaux équipements.',
      'Ne pas suivre les consommations après livraison, ce qui réduit la preuve des économies.',
    ],
    actionPlanIntro: 'Une commune peut construire une trajectoire solide en commençant par quelques sites pilotes.',
    opteeAngle: 'Optee peut aider les collectivités à prioriser les écoles, suivre les consommations, comparer les scénarios et documenter les gains pour les financeurs.',
    sources: [commonSources.fondsVert, commonSources.adapt, commonSources.cee],
  },
  {
    title: 'Immobilier de bureaux à Paris : la performance énergétique devient un critère de valeur',
    slug: 'immobilier-bureaux-paris-performance-energetique-valeur',
    excerpt: 'À Paris et en Île-de-France, Décret Tertiaire, charges et attentes locataires font de la performance énergétique un facteur de valeur immobilière.',
    cover_image: 'https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg',
    cover_image_alt: 'Immeuble de bureaux à Paris et performance énergétique',
    meta_description: 'Bureaux Paris performance énergétique : Décret Tertiaire, valeur verte, charges, GTB et rénovation pour propriétaires et asset managers.',
    tags: ['DPE', 'Tertiaire', 'Réglementation'],
    primaryKeyword: 'performance énergétique bureaux Paris',
    intro: 'Sur le marché des bureaux parisiens, la performance énergétique devient un critère de valeur aussi important que l’emplacement, la flexibilité ou les services. Les locataires regardent les charges, les directions RSE demandent des preuves, et les investisseurs anticipent les obligations du Décret Tertiaire.',
    actuality: 'Le contexte 2026 combine pression réglementaire, arbitrages immobiliers et hausse des exigences de reporting. Éco Énergie Tertiaire impose une trajectoire de réduction des consommations, tandis que les outils de pilotage et les données deviennent essentiels pour défendre la qualité d’un actif.',
    mustKnow: 'La valeur verte d’un immeuble de bureaux ne se résume pas à une étiquette. Elle dépend de la consommation réelle, de la capacité à piloter, du confort, de la documentation technique, du coût futur des travaux et de la crédibilité de la trajectoire. Un actif énergivore peut devenir plus difficile à louer ou à arbitrer.',
    localAngle: 'À Paris intra-muros, les contraintes patrimoniales et les copropriétés rendent parfois les travaux lourds plus complexes. À La Défense et en première couronne, les grandes surfaces permettent des stratégies de portefeuille et de GTB plus structurées. À Boulogne, Saint-Denis, Issy-les-Moulineaux ou Montreuil, la compétition entre actifs renforce l’importance des charges maîtrisées.',
    leversIntro: 'Un asset manager doit relier performance énergétique et stratégie locative.',
    levers: [
      'Établir un diagnostic de chaque actif : consommations, équipements, baux, travaux possibles et risques 2030.',
      'Mettre en place des annexes environnementales utiles avec partage des données locataires.',
      'Prioriser les actions visibles et mesurables : GTB, relamping, régulation, ventilation, équilibrage et comptage.',
      'Préparer les CAPEX lourds lorsque l’enveloppe, la production thermique ou la climatisation limitent les gains.',
      'Valoriser les résultats avec des indicateurs simples dans les comités d’investissement.',
    ],
    financing: 'Le financement d’un immeuble de bureaux doit intégrer prime CEE, baisse de charges, réduction du risque réglementaire, maintien de l’occupation et valeur à la revente. Sur un actif parisien, un projet peut être rentable même avec un retour énergétique long si l’opération sécurise un bail, réduit la vacance ou améliore l’attractivité.',
    mistakes: [
      'Reporter les travaux parce que l’immeuble est occupé, sans planifier les fenêtres d’intervention.',
      'Ne pas organiser le partage des données avec les locataires.',
      'Dépenser en communication RSE sans mesure énergétique vérifiable.',
      'Sous-estimer le coût futur d’un actif qui n’a pas de trajectoire 2030 crédible.',
      'Traiter le DPE, le Décret Tertiaire et les charges comme trois sujets séparés.',
    ],
    actionPlanIntro: 'Un portefeuille parisien doit être piloté avec une logique de risque et d’opportunité.',
    opteeAngle: 'Optee peut aider les propriétaires et asset managers à objectiver la performance, prioriser les CAPEX et produire un suivi lisible pour les locataires, investisseurs et équipes techniques.',
    sources: [commonSources.eet, commonSources.operat, commonSources.bacs],
  },
  {
    title: 'Commerces et centres commerciaux : réduire les consommations sans dégrader l’expérience client',
    slug: 'commerces-centres-commerciaux-reduire-consommations-experience-client',
    excerpt: 'Éclairage, CVC, froid, horaires et pilotage : les commerces doivent réduire leurs consommations tout en préservant confort, attractivité et chiffre d’affaires.',
    cover_image: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg',
    cover_image_alt: 'Centre commercial avec éclairage performant et pilotage énergétique',
    meta_description: 'Commerces et centres commerciaux : économies d’énergie, Décret Tertiaire, CEE, éclairage LED, CVC et pilotage sans nuire à l’expérience client.',
    tags: ['Éclairage', 'Tertiaire', 'CEE'],
    primaryKeyword: 'économies énergie commerces centres commerciaux',
    intro: 'Les commerces et centres commerciaux ont un défi particulier : réduire les consommations d’énergie sans nuire à l’expérience client, au confort, à la sécurité et au chiffre d’affaires. L’éclairage, le chauffage, la climatisation, la ventilation, le froid alimentaire et les horaires étendus créent des profils de consommation complexes.',
    actuality: 'L’actualité réglementaire renforce la pression sur les commerces tertiaires : Éco Énergie Tertiaire, BACS, CEE 2026-2030, obligations photovoltaïques sur certains parkings et attentes RSE des enseignes. Pour un retail park à Marseille, un centre commercial à Lyon ou une boutique parisienne, l’énergie devient un sujet commercial autant que technique.',
    mustKnow: 'Un commerce ne peut pas appliquer une sobriété brutale. Les clients doivent voir les produits, circuler confortablement et rester en sécurité. La bonne approche consiste à supprimer les gaspillages invisibles : équipements en marche hors horaires, consignes contradictoires, éclairage surdimensionné, portes ouvertes en climatisation, défauts de froid ou ventilation mal pilotée.',
    localAngle: 'À Paris, les commerces de pied d’immeuble ont souvent peu d’espace technique et des contraintes de copropriété. À Marseille, Nice ou Bordeaux, la climatisation et les portes ouvertes sont des enjeux importants. À Lille, Strasbourg ou Rennes, le chauffage, l’éclairage et la ventilation hivernale pèsent davantage.',
    leversIntro: 'Les commerces disposent de nombreux leviers rapides et finançables.',
    levers: [
      'Remplacer l’éclairage obsolète par des LED adaptées au merchandising et pilotées par zones.',
      'Synchroniser CVC, rideaux d’air, portes automatiques et horaires réels d’ouverture.',
      'Optimiser le froid alimentaire : consignes, entretien, récupération de chaleur et fermeture des meubles.',
      'Installer du comptage par usage pour distinguer boutiques, parties communes, parkings et froid.',
      'Former les équipes magasin aux gestes qui ne dégradent pas l’expérience client.',
    ],
    financing: 'Les CEE peuvent soutenir certaines opérations, notamment éclairage, régulation, froid, GTB ou récupération de chaleur selon les cas. Le calcul doit intégrer les économies d’énergie, la durée d’ouverture, la maintenance, la qualité d’éclairage et l’impact commercial. Un relamping bien conçu améliore souvent à la fois la facture et la présentation produit.',
    mistakes: [
      'Réduire l’éclairage de manière uniforme sans respecter les besoins des zones de vente.',
      'Couper la ventilation sans vérifier la qualité d’air et le confort client.',
      'Laisser les équipements fonctionner en mode manuel après les travaux.',
      'Oublier les parties communes et parkings dans la stratégie énergétique.',
      'Ne pas coordonner bailleur, preneurs, mainteneur et direction magasin.',
    ],
    actionPlanIntro: 'Les commerces peuvent avancer vite avec une démarche par usages.',
    opteeAngle: 'Optee peut aider les enseignes, bailleurs et gestionnaires de centres commerciaux à suivre les consommations par site, détecter les dérives et construire des plans d’action compatibles avec l’exploitation commerciale.',
    sources: [commonSources.eet, commonSources.bacs, commonSources.ceeConsult, commonSources.aper],
  },
];

const articles = articleInputs.map((input, index) => {
  const content = buildArticle(input);
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content,
    cover_image: input.cover_image,
    cover_image_alt: input.cover_image_alt,
    meta_description: input.meta_description,
    tags: input.tags,
    author: 'Équipe Optee',
    author_avatar: null,
    reading_time: Math.max(8, Math.round(wordCount(content) / 220)),
    featured: false,
    published: true,
    published_at: new Date(new Date(baseDate).getTime() - index * 24 * 60 * 60 * 1000).toISOString(),
  };
});

async function main() {
  const counts = articles.map((article) => ({
    slug: article.slug,
    words: wordCount(article.content),
    reading_time: article.reading_time,
  }));
  console.table(counts);

  const tooShort = counts.filter((item) => item.words < 1500);
  if (tooShort.length > 0) {
    throw new Error(`Articles sous 1500 mots: ${tooShort.map((item) => `${item.slug} (${item.words})`).join(', ')}`);
  }

  if (process.argv.includes('--dry-run')) {
    return;
  }

  const { data: existing, error: existingError } = await supabase
    .from('blog_posts')
    .select('slug')
    .in('slug', articles.map((article) => article.slug));

  if (existingError) throw existingError;

  const existingSlugs = new Set((existing || []).map((row) => row.slug));
  const toInsert = articles.filter((article) => !existingSlugs.has(article.slug));

  if (toInsert.length === 0) {
    console.log('No new articles to insert.');
    return;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(toInsert)
    .select('id,title,slug,published_at,reading_time');

  if (error) throw error;
  console.log(JSON.stringify({ inserted: data.length, articles: data }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
