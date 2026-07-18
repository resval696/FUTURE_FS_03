// Kokouvi Wash - Base de données
// Données réalistes reflétant près de 80 ans d'expertise en blanchisserie à Lomé, Togo.

import ironingTableImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_22_23.png";
import receptionCounterImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_22_11.png";
import frontstoreExteriorImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_22_03.png";
import washingMachinesImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_14_24.png";
import receptionInteriorImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_14_17.png";

export const BUSINESS_INFO = {
  name: "Kokouvi Wash",
  founded: 1946,
  address: "63 Rue Madjatom, Porte N°272, Tokoin Gbadago, Lomé, Togo",
  phones: ["+228 91864972", "+228 90038527", "+228 90564296"],
  workingHours: {
    weekdays: "07:00 - 20:00",
    sunday: "Fermé"
  },
  whatsappBaseUrl: "https://wa.me/22891864972"
};

// Données des Services (8 services principaux demandés)
export const SERVICES_DATA = [
  {
    id: "laundry",
    title: "Lavage Classique (Laundry)",
    description: "Lavage et désinfection éco-responsables de qualité supérieure pour vos vêtements du quotidien, préservant la fraîcheur et l'éclat.",
    icon: "Sparkles",
    detail: "Notre processus de lavage standard combine un lavage doux à base d'eau et des détergents professionnels haut de gamme pour protéger les fibres tout en éliminant les taches."
  },
  {
    id: "dry-cleaning",
    title: "Nettoyage à Sec (Dry Cleaning)",
    description: "Soin haut de gamme spécialisé, sans solvants agressifs, pour costumes délicats, soies et vêtements d'extérieur structurés.",
    icon: "ShieldAlert",
    detail: "Idéal pour les costumes, manteaux, robes de mariée et tissus traditionnels riches qui ne supportent pas le lavage en machine classique."
  },
  {
    id: "ironing",
    title: "Repassage Professionnel",
    description: "Finition soignée à la main, avec un pli impeccable pour vos tenues professionnelles, traditionnelles ou votre linge de maison.",
    icon: "Flame",
    detail: "Chaque pièce est repassée avec précision à l'aide de fers à vapeur professionnels par des techniciens expérimentés qui maîtrisent la tolérance thermique de chaque textile."
  },
  {
    id: "pressing",
    title: "Pressing & Finition",
    description: "Traitement à la vapeur qui régénère et restructure vos vêtements, leur redonnant l'éclat et la tenue d'une pièce neuve.",
    icon: "Printer",
    detail: "Le pressing redonne de la forme et élimine les plis profonds des tissus lourds, des vestes et des tenues de cérémonie."
  },
  {
    id: "curtains",
    title: "Nettoyage de Rideaux",
    description: "Aspiration complète de la poussière, lavage en profondeur et repassage vapeur parfait pour rideaux lourds, voilages ou doublés.",
    icon: "Layers",
    detail: "Nous traitons les rideaux de toutes tailles et de tous poids, en vous les restituant avec des plis parfaits et sans aucun rétrécissement."
  },
  {
    id: "household-linen",
    title: "Linge de Maison",
    description: "Nettoyage hygiénique rigoureux pour draps de lit, housses de couette, nappes et couvertures de toutes dimensions.",
    icon: "Bed",
    detail: "Parfait pour les hôtels, maisons d'hôtes ou familles recherchant une literie et du linge ultra-propres et hypoallergéniques."
  },
  {
    id: "delicate-fabrics",
    title: "Tissus Délicats",
    description: "Soin expert et délicat pour la soie, la dentelle, le cachemire et les textiles africains traditionnels brodés à la main.",
    icon: "Heart",
    detail: "Nous appliquons des méthodes de lavage manuel à température contrôlée et pH neutre pour protéger les broderies délicates et les fibres fragiles."
  },
  {
    id: "professional-laundry",
    title: "Blanchisserie B2B & Professionnels",
    description: "Contrats de blanchisserie et de nettoyage à sec à grand volume pour hôtels, entreprises, restaurants et cliniques.",
    icon: "Briefcase",
    detail: "Un service fiable de collecte et de livraison programmée avec des délais d'exécution garantis pour assurer le bon fonctionnement de votre activité."
  }
];

// Historique pour la page À Propos
export const TIMELINE_DATA = [
  {
    year: "1946",
    title: "La Fondation",
    description: "Fondé à Lomé par la famille EGLOH en tant que service artisanal de lavage à la main et de repassage de précision, desservant le quartier avec un soin inégalé."
  },
  {
    year: "1972",
    title: "Expansion de l'Atelier",
    description: "Déménagement dans le quartier historique de Tokoin Gbadago au 63 Rue Madjatom. Modernisation avec des fers industriels et des tables à vapeur tout en gardant nos standards artisanaux."
  },
  {
    year: "1998",
    title: "Soin Premium & Nettoyage à Sec",
    description: "Introduction de systèmes avancés de nettoyage à sec et de solvants spécialisés pour traiter les textiles importés haut de gamme et les tenues traditionnelles africaines de cérémonie."
  },
  {
    year: "2015",
    title: "Initiative Éco-Responsable",
    description: "Transition complète vers des détergents sans phosphate et des technologies de traitement d'eau à basse température et haute efficacité, une première locale en matière d'écologie textile."
  },
  {
    year: "2026",
    title: "80 Ans de Maîtrise",
    description: "Célébration de près de huit décennies de confiance, d'expertise et de soin textile impeccable. Alliance parfaite entre l'artisanat togolais historique et la commodité du numérique."
  }
];

export interface PricingItem {
  name: string;
  price: number | null;
  type: string;
}

export interface PricingCategory {
  id: string;
  name: string;
  description: string;
  status?: string;
  items: PricingItem[];
}

// Catégories de Tarification
export const PRICING_DATA: PricingCategory[] = [
  {
    id: "men",
    name: "Hommes",
    description: "Nettoyage à sec et blanchisserie de qualité supérieure pour les vêtements professionnels et de cérémonie pour hommes.",
    items: [
      { name: "Chemise", price: 500, type: "Lavage & Repassage" },
      { name: "Costume 2 Pièces", price: 1700, type: "Nettoyage à Sec" },
      { name: "Costume 3 Pièces", price: 2200, type: "Nettoyage à Sec" },
      { name: "Veste Seule", price: 800, type: "Nettoyage à Sec" },
      { name: "Pantalon", price: 500, type: "Lavage & Repassage" },
      { name: "Gilet", price: 400, type: "Nettoyage à Sec" },
      { name: "Cravate / Nœud Papillon", price: 300, type: "Nettoyage à Sec" },
      { name: "Boubou Traditionnel", price: 1500, type: "Nettoyage à Sec & Pressing" },
      { name: "T-Shirt / Polo", price: 300, type: "Lavage & Repassage" },
      { name: "Sweatshirt / Pull", price: 600, type: "Lavage Classique" }
    ]
  },
  {
    id: "curtains",
    name: "Rideaux",
    description: "Nettoyage professionnel et finitions plissées impeccables pour tous types de rideaux.",
    items: [
      { name: "Rideau Simple - par mètre", price: 700, type: "Nettoyage en Profondeur & Pressing" },
      { name: "Rideau Doublé / Lourd - par mètre", price: 1200, type: "Nettoyage en Profondeur & Pressing" },
      { name: "Voilage - par mètre", price: 500, type: "Lavage Délicat" },
      { name: "Rideau Occultant - par mètre", price: 1300, type: "Nettoyage en Profondeur" }
    ]
  },
  {
    id: "women",
    name: "Femmes",
    description: "Soin délicat pour les tenues de bureau, de soirée et vêtements traditionnels pour femmes.",
    items: [
      { name: "Robe Simple", price: 800, type: "Lavage & Repassage" },
      { name: "Robe de Soirée / Cérémonie", price: 1800, type: "Nettoyage à Sec & Pressing" },
      { name: "Taille Basse Traditionnelle", price: 1500, type: "Nettoyage à Sec & Pressing" },
      { name: "Jupe", price: 500, type: "Lavage & Repassage" },
      { name: "Chemisier", price: 500, type: "Lavage & Repassage" }
    ]
  },
  {
    id: "kids",
    name: "Enfants",
    description: "Nettoyage doux et hypoallergénique pour la peau sensible des enfants.",
    items: [
      { name: "Vêtements Bébé", price: 200, type: "Lavage Doux & Hypoallergénique" },
      { name: "Robe Enfant", price: 400, type: "Lavage & Repassage" },
      { name: "Pantalon / Short Enfant", price: 300, type: "Lavage & Repassage" },
      { name: "Uniforme Scolaire", price: 400, type: "Lavage & Repassage" }
    ]
  },
  {
    id: "household-linen",
    name: "Linge de Maison",
    description: "Fraîcheur et désinfection parfaite pour toute votre literie et textiles de maison.",
    items: [
      { name: "Drap de Lit", price: 600, type: "Lavage Haute Température & Calandrage" },
      { name: "Housse de Couette", price: 1000, type: "Lavage & Désinfection" },
      { name: "Taie d'oreiller", price: 200, type: "Lavage & Repassage" },
      { name: "Couverture / Couette Lourde", price: 2000, type: "Nettoyage Thermique & Gonflant" },
      { name: "Nappe de Table", price: 500, type: "Détachage & Repassage" }
    ]
  },
  {
    id: "special-services",
    name: "Services Spéciaux",
    description: "Nettoyage complexe et préservation méticuleuse pour vos pièces à forte valeur sentimentale ou matérielle.",
    items: [
      { name: "Robe de Mariée (Préservation & Nettoyage)", price: 15000, type: "Soin Manuel de Prestige & Coffret" },
      { name: "Restauration Textile (Tissus anciens ou de collection)", price: 5000, type: "Traitement Spécialisé" },
      { name: "Traitement Imperméabilisant", price: 1500, type: "Finition Technique" }
    ]
  }
];

// Conseils d'Entretien du Linge (8 sujets demandés)
export const TIPS_DATA = [
  {
    title: "Entretien des Costumes",
    category: "Tailleur",
    summary: "Comment préserver l'entoilage et la structure des épaules de vos costumes haut de gamme.",
    content: "Ne lavez jamais un costume structuré en machine. Suspendez-le sur un large cintre en bois après chaque utilisation pour laisser reposer les fibres, brossez-le délicatement pour enlever la poussière et optez pour un nettoyage à sec à basse température. Un nettoyage 2 à 3 fois par saison suffit amplement, sauf tache accidentelle."
  },
  {
    title: "Manipulation de la Soie",
    category: "Délicats",
    summary: "Protéger la brillance naturelle et le tissage fragile de vos vêtements en soie pure.",
    content: "La soie est extrêmement sensible à l'humidité, à la chaleur et aux savons alcalins. Évitez de frotter vigoureusement une tache ; tamponnez-la plutôt immédiatement avec un chiffon propre et humide. Privilégiez un lavage à la main professionnel ou un nettoyage à sec pour conserver son drapé luxueux."
  },
  {
    title: "Préservation du Lin",
    category: "Fibres Naturelles",
    summary: "Éviter la rigidité et les plis tenaces tout en gardant le lin souple et aéré.",
    content: "Le lin gagne en résistance lorsqu'il est mouillé mais se froisse très facilement. Lavez-le à basse température avec un cycle doux. Pour un repassage parfait, repassez le vêtement encore légèrement humide avec un fer chaud à forte vapeur. Suspendez-le immédiatement."
  },
  {
    title: "Soin du Coton de Qualité",
    category: "Quotidien",
    summary: "Éviter la décoloration et le rétrécissement de votre coton biologique de haute qualité.",
    content: "Lavez vos vêtements en coton à l'envers, à l'eau froide ou tiède, pour fixer les couleurs éclatantes. Pour le coton blanc, évitez le chlore qui jaunit les fibres à long terme ; préférez des détachants doux à l'oxygène actif. Repassez avec un réglage de vapeur moyen."
  },
  {
    title: "Nettoyage des Rideaux",
    category: "Décoration",
    summary: "Comment maintenir vos tentures propres et éviter l'accumulation de poussière.",
    content: "Les rideaux absorbent la poussière ambiante et les vapeurs au fil des mois. Aspirez-les régulièrement avec un embout brosse doux. Pour le nettoyage en profondeur, lavez les voilages légers sur cycle délicat dans un filet protecteur, et confiez les rideaux occultants ou doublés à un professionnel."
  },
  {
    title: "Couvertures & Couettes",
    category: "Literie",
    summary: "Garder vos couettes gonflantes, chaudes et parfaitement saines.",
    content: "Les couvertures volumineuses nécessitent des tambours professionnels pour garantir un rinçage parfait et une distribution uniforme de la lessive. Assurez-vous d'un séchage complet à basse température : le moindre reste d'humidité peut favoriser les moisissures. Lavez-les tous les 3 à 6 mois."
  },
  {
    title: "Vêtements Traditionnels",
    category: "Patrimoine",
    summary: "Préserver l'éclat des pagnes wax, des broderies riches et des pagnes tissés (Kente/Kita).",
    content: "Les pagnes africains wax et les vêtements tissés main ont des teintures spécifiques qui peuvent dégorger sous l'effet de détergents agressifs. Lavez à l'eau froide salée au premier lavage pour fixer les couleurs. Repassez toujours sur l'envers sous un tissu de protection pour ne pas abîmer les broderies."
  },
  {
    title: "Robes de Mariée",
    category: "Haute Couture",
    summary: "Restauration impeccable, élimination des taches et conservation optimale.",
    content: "Une robe de mariée nécessite une attention méticuleuse après le grand jour. Les taches invisibles au départ (champagne, transpiration) finissent par jaunir. Nous effectuons des traitements manuels ultra-ciblés sur la dentelle, les perles et les sequins, suivis d'un emballage de conservation sans acide."
  }
];

// Foire Aux Questions (FAQs)
export const FAQ_DATA = [
  {
    question: "Où êtes-vous situés à Lomé ?",
    answer: "Notre atelier principal est situé dans le quartier historique de Tokoin Gbadago au 63 Rue Madjatom, Porte N°272, Lomé, Togo. Nous sommes ravis de servir notre communauté historique depuis cette adresse."
  },
  {
    question: "Proposez-vous un service de collecte et de livraison ?",
    answer: "Oui ! Nous proposons un service professionnel de collecte et de livraison à domicile ou au bureau dans tout Lomé. Vous pouvez programmer une collecte via notre formulaire en ligne ou nous contacter directement par WhatsApp."
  },
  {
    question: "Combien de temps prend un nettoyage standard ?",
    answer: "Le lavage classique et le repassage professionnel prennent généralement entre 24 et 48 heures. Le nettoyage à sec de qualité supérieure pour costumes ou tenues traditionnelles prend de 48 à 72 heures. Un service express est disponible sur demande."
  },
  {
    question: "Quels sont vos tarifs pour les vêtements femmes et enfants ?",
    answer: "Toutes nos grilles tarifaires pour les vêtements hommes, femmes, enfants, ainsi que le linge de maison et les rideaux, sont pleinement actives ! Nos prix ont été soigneusement ajustés sur la base de 500 FCFA pour une chemise standard. Vous pouvez utiliser notre Estimateur Interactif de Devis pour simuler votre demande complète et l'envoyer directement via WhatsApp."
  },
  {
    question: "Vos lessives sont-elles adaptées aux peaux sensibles ?",
    answer: "Absolument. Depuis 2015, nous nous engageons à utiliser des détergents écologiques sans phosphate, hypoallergéniques et biodégradables. Ils sont extrêmement doux pour les vêtements de bébé, les peaux sensibles et les fibres biologiques."
  },
  {
    question: "Nettoyez-vous les grands articles comme les couettes et rideaux lourds ?",
    answer: "Oui, nous sommes équipés pour le lavage à grande capacité de tous les textiles de maison, y compris les rideaux occultants lourds, les voilages délicats, les couvertures en laine et les couettes synthétiques."
  }
];

// Images de la Galerie
export const GALLERY_DATA = [
  {
    id: "img1",
    url: ironingTableImg,
    title: "Atelier de Repassage Vapeur",
    category: "Atelier",
    description: "Nos techniciens experts à l'œuvre sur nos tables à repasser professionnelles équipées de générateurs de vapeur de pointe."
  },
  {
    id: "img2",
    url: receptionCounterImg,
    title: "Comptoir de Réception d'Élite",
    category: "Réception",
    description: "Accueil chaleureux, enregistrement et tri rigoureux de vos pièces de prêt-à-porter et de haute couture."
  },
  {
    id: "img3",
    url: frontstoreExteriorImg,
    title: "Notre Devanture Officielle",
    category: "Atelier",
    description: "Notre établissement moderne situé au 63 Rue Madjatom à Tokoin Gbadago, Lomé, au service de vos textiles depuis 1946."
  },
  {
    id: "img4",
    url: washingMachinesImg,
    title: "Équipements de Lavage Professionnels",
    category: "Lavage",
    description: "Nos lave-linge industriels haute technologie et séchoirs de pointe pour un lavage en profondeur et respectueux des fibres."
  },
  {
    id: "img5",
    url: receptionInteriorImg,
    title: "Espace de Stockage & Logistique",
    category: "Réception",
    description: "Racks de vêtements repassés et pliés prêts pour la livraison ou la collecte rapide sous vidéosurveillance."
  }
];

// Valeurs Fondamentales
export const VALUES_DATA = [
  {
    title: "80 Ans de Confiance",
    description: "Fondé en 1946, notre savoir-faire intergénérationnel garantit la sécurité absolue de vos textiles.",
    icon: "Award"
  },
  {
    title: "Engagement Écologique",
    description: "Nous protégeons vos textiles ainsi que l'environnement de Lomé en utilisant des détergents 100% biodégradables.",
    icon: "Leaf"
  },
  {
    title: "Précision Absolue",
    description: "Du pH de l'eau aux températures de la vapeur, chaque étape est calculée pour un résultat irréprochable.",
    icon: "CheckCircle"
  },
  {
    title: "Service Client Digital",
    description: "Réservations en ligne fluides, délais rapides et assistance directe instantanée par WhatsApp.",
    icon: "Smartphone"
  }
];

// Témoignages
export const TESTIMONIALS_DATA = [
  {
    quote: "Kokouvi Wash est le pressing de confiance de notre famille depuis des décennies. Leur soin pour les grands boubous traditionnels et les dentelles délicates est sans égal à Lomé.",
    author: "Client Fidèle",
    role: "Résident de Tokoin Gbadago"
  },
  {
    quote: "Rapidité exceptionnelle et attention aux moindres détails. Mes costumes d'affaires reviennent impeccables, comme neufs. L'intégration WhatsApp facilite énormément la prise de rendez-vous.",
    author: "Client Professionnel",
    role: "Quartier Administratif de Lomé"
  }
];
