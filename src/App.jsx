import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ArrowRight,
  GraduationCap,
  Heartbeat,
  Handshake,
  FileText,
  CheckCircle,
  X,
  Hourglass,
  LockKey,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import OrganigrammeAntenne from "./OrganigrammeAntenne.jsx";

// ============================================================
//  OMAS : la restructuration, à ton échelle
//  Mini-site interactif pour les étudiants des antennes IDF
//  Charte : Helvetica en typographie, palette bleu/teal/or.
// ============================================================

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const CONTENU_MAXW = 1080;

// ---------- Design tokens ----------
const C = {
  bleu: "#2D2F84",
  bleuFonce: "#1F2066",
  bleuClair: "#4A4DA6",
  teal: "#00A09A",
  tealFonce: "#00857F",
  or: "#C8A951",
  orFonce: "#9A7E33",
  encre: "#23243F",
  brume: "#5C5D6B",
  voile: "#EEF0FA",
  voileTeal: "#EBF7F7",
  voileOr: "#FAF3E2",
  papier: "#FBFAF8",
  blanc: "#FFFFFF",
};

// ---------- Élévation : ombres teintées bleu marine, cohérentes sur tout le site ----------
const OMBRE = {
  carte: "0 1px 2px rgba(30,32,96,0.05), 0 14px 30px -14px rgba(30,32,96,0.18)",
  carteHover: "0 4px 10px rgba(30,32,96,0.08), 0 22px 44px -14px rgba(30,32,96,0.26)",
  // équivalents en filter: drop-shadow, pour les cartes focusables (le box-shadow inline
  // bloquerait sinon l'anneau de focus clavier posé en CSS sur le même élément).
  filtreCarte: "drop-shadow(0 1px 1px rgba(30,32,96,0.06)) drop-shadow(0 10px 18px rgba(30,32,96,0.16))",
  filtreCarteHover: "drop-shadow(0 3px 6px rgba(30,32,96,0.1)) drop-shadow(0 16px 30px rgba(30,32,96,0.24))",
};

function surElevation(e, active) {
  e.currentTarget.style.transform = active ? "translateY(-4px)" : "translateY(0)";
  e.currentTarget.style.boxShadow = active ? OMBRE.carteHover : OMBRE.carte;
}

function surElevationFiltre(e, active) {
  e.currentTarget.style.transform = active ? "translateY(-4px)" : "translateY(0)";
  e.currentTarget.style.filter = active ? OMBRE.filtreCarteHover : OMBRE.filtreCarte;
}

// ---------- Données : les publics de l'OMAS ----------
const PUBLICS = [
  {
    mission: "Former",
    cible: "Étudiants en santé",
    Icone: GraduationCap,
    accent: C.bleu,
    iconBg: "rgba(45,47,132,0.1)",
    border: `2px solid ${C.bleu}`,
    badge: "Ton public",
    detail:
      "À l'antenne, via le Parcours omassien : tutorat, méthodologie, et les trois piliers compétence, engagement, éthique.",
  },
  {
    mission: "Servir",
    cible: "Grand public",
    Icone: Heartbeat,
    accent: C.tealFonce,
    iconBg: "rgba(0,160,154,0.12)",
    border: `1px solid rgba(45,47,132,0.1)`,
    badge: "",
    detail:
      "Prévention, dépistages, formations aux gestes qui sauvent : ouverts à tous, sans condition d'adhésion.",
  },
  {
    mission: "Fédérer",
    cible: "Acteurs de santé & institutions",
    Icone: Handshake,
    accent: C.bleuFonce,
    iconBg: "rgba(31,32,102,0.1)",
    border: `1px solid rgba(45,47,132,0.1)`,
    badge: "",
    detail:
      "Professionnels installés (Le Club), partenaires et institutions : un réseau qui dépasse le campus.",
  },
];

// ---------- Données : les 3 dimensions du triptyque ----------
const TRIPTYQUE = [
  {
    cle: "competence",
    titre: "Compétence",
    accent: C.bleu,
    titleColor: C.bleu,
    labelAccent: C.bleu,
    voile: C.voile,
    resume: "Apprendre, réussir, transmettre.",
    detail:
      "Le socle pédagogique. Au-delà du tutorat PASS/LAS/LSPS, un accompagnement méthodologique continu tout au long des études de santé.",
    actions: [
      "Assister à un concours blanc PASS/LAS",
      "Participer à un forum d'orientation pour éclairer son parcours",
      "Accéder aux ressources pédagogiques approfondies du parcours",
    ],
  },
  {
    cle: "engagement",
    titre: "Engagement",
    accent: C.tealFonce,
    titleColor: C.tealFonce,
    labelAccent: C.tealFonce,
    voile: C.voileTeal,
    resume: "Servir, agir, se rendre utile.",
    detail:
      "La dimension solidaire et citoyenne. On ne se forme pas seulement pour soi : on met sa future blouse au service des autres, dès maintenant.",
    actions: [
      "Participer à une maraude auprès de personnes sans abri",
      "Animer une action de prévention en santé",
      "Intervenir auprès de lycéens pour démystifier les études de santé",
    ],
  },
  {
    cle: "ethique",
    titre: "Éthique",
    accent: C.or,
    titleColor: C.bleuClair,
    labelAccent: C.bleuClair,
    voile: C.voileOr,
    resume: "Réfléchir, questionner, se situer.",
    detail:
      "La boussole. Le soignant de demain se construit une pensée : sur la fin de vie, le soin, la relation, le sens de son engagement.",
    actions: [
      "Assister à un atelier sur la loi fin de vie animé par un réanimateur",
      "Débattre d'un cas concret en séance éthique",
      "Confronter ses convictions à la réalité du terrain de soin",
    ],
  },
];

// ---------- Données : ce qui change concrètement ----------
const BASCULEMENTS = [
  {
    titre: "Le public concerné",
    avant: "L'OMAS accompagnait surtout les étudiants en PASS, LAS et LSPS, le temps de préparer un concours.",
    apres:
      "L'OMAS accompagne tous les étudiants en santé, de la première année jusqu'à l'exercice professionnel, quelle que soit la filière.",
  },
  {
    titre: "La nature de l'accompagnement",
    avant:
      "L'accompagnement était surtout pédagogique. Les adhérents profitaient d'un soutien centré sur la réussite au concours.",
    apres:
      "L'accompagnement repose sur trois piliers indissociables, la compétence, l'engagement et l'éthique. Réussir ne suffit plus à définir l'expérience OMAS : servir et se former une conscience de soignant en font désormais partie intégrante.",
  },
  {
    titre: "Les profils de bénéficiaires",
    avant: "La frontière entre ceux qui profitaient de l'OMAS et les autres était peu formalisée.",
    apres:
      "Trois profils de bénéficiaires coexistent clairement, chacun avec un rapport différent à l'association : le non-adhérent, l'adhérent, et l'omassien du parcours.",
  },
];

const PROFILS = [
  {
    nom: "Le non-adhérent",
    accent: C.brume,
    titleColor: C.brume,
    bullets: [
      "Participe aux événements grand public de l'OMAS, ouverts à tous",
      "Accède, sur billetterie, à certains événements (concours blancs, ECOS blancs, conférences)",
      "Aucun lien continu avec l'association : chaque participation reste ponctuelle",
    ],
    note: "S'acquitte, à chaque fois, du tarif non-adhérent.",
  },
  {
    nom: "L'adhérent",
    accent: C.teal,
    titleColor: C.teal,
    bullets: [
      "Fait partie de la communauté OMAS, rattaché à une antenne et une localité",
      "Accède aux ressources et événements ouverts à tous les adhérents",
      "Bénéficie du tarif préférentiel sur les événements à billetterie",
      "Suit la vie de l'antenne, ses temps forts, son information",
    ],
    note: "Ouvert à tous les étudiants en santé, sans sélection : seule l'adhésion est requise.",
  },
  {
    nom: "L'omassien du parcours",
    accent: C.or,
    titleColor: C.bleu,
    bullets: [
      "Un accompagnement humain rapproché : parrain ou marraine, suivi de tutorat, communauté de promotion",
      "Un parcours structuré autour de la compétence, l'engagement et l'éthique, avec des temps dédiés à chacun",
      "En contrepartie : des actions concrètes (maraude, prévention en santé, forum d'orientation) et les temps de formation éthique (atelier loi fin de vie)",
    ],
    note: "Ne s'achète pas : se mérite par l'engagement.",
  },
];

const POLES_INFO = [
  { n: "Savoir", d: "Méthodo, ressources, forum d'orientation", c: C.bleu },
  { n: "PRP", d: "Tutorat, concours blancs, Année 0", c: C.bleuFonce },
  { n: "Éthique", d: "Séances et ateliers, sens du soin", c: C.orFonce },
  { n: "Solidarités", d: "Maraudes, prévention, lycéens", c: C.teal },
  { n: "Logistique", d: "Événements, salles, matériel", c: C.tealFonce },
  { n: "Communication", d: "Réseaux, image, rayonnement", c: C.bleu },
];

// ---------- Données : les rôles orientés par le test ----------
// cercle : 0 = porte d'entrée · 1 = antenne · 2 = localité
const ROLES = {
  tuteur: {
    nom: "Tuteur·rice",
    cercle: 0,
    accent: C.bleu,
    pitch:
      "Tu prends un petit groupe d'étudiants et tu les fais progresser, séance après séance. La porte d'entrée la plus directe si transmettre te parle.",
    entree: "Se propose auprès du Responsable PRP, sans campagne de candidatures.",
  },
  parrain: {
    nom: "Parrain / Marraine",
    cercle: 0,
    accent: C.teal,
    pitch:
      "Tu accompagnes une personne, pas une matière. Un binôme, de la confiance, une présence dans les moments de doute.",
    entree: "Rejoint le dispositif de mentorat, accessible dès la première année.",
  },
  chargeMission: {
    nom: "Chargé·e de mission",
    cercle: 0,
    accent: C.bleuClair,
    pitch:
      "Un périmètre précis, une mission concrète : le Discord, les réseaux, une maraude, une matière. Tu épaules un délégué sans passer par une élection.",
    entree: "Proposé par un délégué, validé par le responsable d'antenne.",
  },
  respAntenne: {
    nom: "Responsable d'antenne",
    cercle: 1,
    accent: C.bleuFonce,
    pitch:
      "Tu pilotes toute la communauté étudiante de ton campus. Tu fais le lien avec la localité, tu tiens le cap, tu fais grandir ton équipe.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delSavoir: {
    nom: "Délégué·e Savoir",
    cercle: 1,
    accent: C.bleu,
    pitch:
      "Méthodologie, mutualisation pédagogique, forum d'orientation : tu portes le volet compétence du parcours sur ton campus, main dans la main avec le PRP.",
    entree: "Poste électif, campagne de candidatures.",
  },
  respPRP: {
    nom: "Délégué PRP",
    cercle: 1,
    accent: C.bleuFonce,
    pitch:
      "Le tutorat, les concours blancs PASS/LAS, l'Année 0 : tu fais tourner la machine pédagogique qui a fait la réputation de l'OMAS.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delEthique: {
    nom: "Délégué·e Éthique",
    cercle: 1,
    accent: C.bleuClair,
    pitch:
      "Tu organises les séances d'éthique, les ateliers avec des intervenants (comme celui sur la loi fin de vie).",
    entree: "Poste électif, campagne de candidatures.",
  },
  delSolidarites: {
    nom: "Délégué·e Solidarités",
    cercle: 1,
    accent: C.teal,
    pitch:
      "Maraudes, prévention en santé, interventions auprès des lycéens : tu portes l'engagement de terrain de ton antenne.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delLogistique: {
    nom: "Délégué·e Logistique",
    cercle: 1,
    accent: C.tealFonce,
    pitch: "Salles, matériel, outils, organisation des événements : rien ne se fait sans toi.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delComm: {
    nom: "Délégué·e Communication",
    cercle: 1,
    accent: C.bleu,
    pitch:
      "Réseaux, visuels, présence locale : tu fais rayonner l'antenne et tu donnes envie de rejoindre.",
    entree: "Poste électif, campagne de candidatures.",
  },
  refPromo: {
    nom: "Référent·e de promo",
    cercle: 1,
    accent: C.teal,
    pitch: "Un·e par promo. Tu es le point de contact humain de ta promotion, le relais de l'Année 0.",
    entree: "Poste électif, campagne de candidatures.",
  },
  respPoleLoc: {
    nom: "Responsable de pôle en localité",
    cercle: 2,
    accent: C.bleuFonce,
    pitch: "Tu déclines un pôle à l'échelle de tout un territoire, au-dessus des antennes.",
    entree: "Échelon localité : une trajectoire, pas un premier poste.",
  },
  bureauLoc: {
    nom: "Bureau de localité",
    cercle: 2,
    accent: C.bleuFonce,
    pitch: "Président·e, VP, secrétaire, trésorier·e : la tête d'un territoire entier.",
    entree: "Échelon localité : élu par l'AG de localité.",
  },
  refPortefeuille: {
    nom: "Référent·e de portefeuille (localité)",
    cercle: 2,
    accent: C.tealFonce,
    pitch:
      "Internes, communauté professionnelle (Le Club), relations institutionnelles : tu portes un public que l'antenne ne couvre pas.",
    entree: "Échelon localité : nomination après appel à candidatures.",
  },
};

// ---------- Fiches de poste complètes (cercle 2 uniquement) ----------
const FICHES = {
  respAntenne: {
    titre: "Responsable d'antenne",
    axe: "Pilotage, coordonne les deux axes (pôle et promo)",
    rattachement: "Bureau de localité IDF",
    temps: "Engagement soutenu, présence régulière sur le campus",
    mission:
      "Le responsable d'antenne est le visage et le pilote de l'OMAS sur son campus. Il ne fait pas tout lui-même : il coordonne une équipe, garantit que le socle de la rentrée est tenu, et fait le lien entre son antenne et la localité.",
    responsabilites: [
      "Constituer et animer l'équipe d'antenne (délégués de pôle et référents de promo)",
      "Garantir l'accueil et l'adhésion des nouveaux : mission socle, portée directement avec les référents de promo et appuyée par la Logistique",
      "Veiller au lancement et au bon déroulement du parcours étudiant sur le campus",
      "Faire remonter à la localité les besoins, les signaux et le bilan de l'antenne",
      "Représenter l'antenne dans les échanges avec le bureau de localité",
    ],
    profil:
      "Étudiant du campus, fédérateur et fiable, capable de déléguer et de tenir un cap. Une expérience associative ou de tutorat est un plus, mais l'engagement et le sérieux priment sur l'expérience.",
    candidater:
      "Précisez votre campus, votre année d'étude, et votre vision en quelques lignes pour l'antenne cette année.",
  },
  delSavoir: {
    titre: "Délégué Savoir",
    axe: "Pôle, opère la dimension compétence",
    rattachement: "Responsable d'antenne et responsable local du pôle Savoir",
    temps: "Soutenu en période de rentrée et de concours blancs",
    mission:
      "Le délégué Savoir porte la mission la plus attendue par les étudiants : réussir. Il opère la méthodologie et le volet compétence du parcours, le forum d'orientation, et mutualise les ressources pédagogiques. C'est le pôle où l'OMAS prouve sa valeur concrète auprès des PASS/LAS/LSPS, en lien étroit avec le Délégué PRP.",
    responsabilites: [
      "Animer le volet compétence du parcours (méthodologie, accompagnement)",
      "Organiser ou contribuer à un forum d'orientation pour éclairer les parcours des étudiants",
      "Mutualiser les supports pédagogiques avec les autres antennes via la localité",
      "Travailler en lien étroit avec le Délégué PRP, sans se substituer à lui sur le tutorat",
    ],
    profil:
      "Étudiant ayant réussi son parcours pré-clinique, organisé et pédagogue, à l'aise pour structurer et transmettre une méthode.",
    candidater:
      "Précisez votre expérience d'accompagnement méthodologique ou de mutualisation de ressources, et ce que vous aimeriez améliorer sur votre campus.",
  },
  respPRP: {
    titre: "Délégué PRP (Plan Réussite PASS/LAS)",
    axe: "Pôle, opère et coordonne le dispositif de tutorat",
    rattachement: "Responsable d'antenne, en binôme avec le Délégué Savoir (pas de lien hiérarchique entre les deux)",
    temps: "Le plus soutenu de l'antenne en période de concours blancs",
    mission:
      "Le Délégué PRP porte le dispositif historique de l'OMAS : le tutorat PASS/LAS. C'est un poste à part entière tant la charge est réelle (recrutement des tuteurs, planning, concours blancs, suivi des étudiants), distinct du délégué Savoir qui porte la méthodologie transversale.",
    responsabilites: [
      "Recruter et coordonner l'équipe de tuteurs de l'antenne",
      "Organiser au moins un concours blanc PASS/LAS dans l'année",
      "Suivre la progression des étudiants accompagnés et ajuster le dispositif",
      "S'appuyer sur des chargés de mission si besoin (par matière, par cohorte)",
    ],
    profil:
      "Étudiant idéalement ancien tuteur, rigoureux, organisé, capable d'animer une équipe et de tenir un planning exigeant.",
    candidater:
      "Précisez votre expérience de tutorat, le nombre de tuteurs que vous pensez pouvoir mobiliser, et le concours que vous connaissez le mieux.",
  },
  delEthique: {
    titre: "Délégué Éthique",
    axe: "Pôle, opère la dimension éthique",
    rattachement: "Responsable d'antenne et responsable local du pôle Éthique",
    temps: "Modéré, concentré autour des séances",
    mission:
      "Le délégué Éthique porte la dimension qui distingue l'OMAS d'un simple tutorat. Il organise des séances régulières de réflexion (par exemple un atelier sur la loi fin de vie animé par un réanimateur), les articule au calendrier de l'antenne, s'appuie sur les ressources et intervenants qualifiés fournis au national, et veille au climat de respect et d'ouverture.",
    responsabilites: [
      "Organiser des séances et ateliers de réflexion éthique (fin de vie, sens du soin, relation soignant-soigné)",
      "Mobiliser des intervenants qualifiés (professionnels de santé, experts) via les ressources nationales",
      "Articuler ces temps au calendrier de l'antenne sans surcharger les étudiants",
      "Veiller à un climat d'écoute et de mesure durant les échanges",
    ],
    profil:
      "Étudiant sensible aux questions d'éthique du soin et de sens, capable d'animer un échange avec écoute et mesure. Aucune expertise théologique ou médicale requise : de la sincérité et du tact.",
    candidater: "Précisez un sujet éthique qui vous tient à cœur et comment vous animeriez un échange dessus.",
  },
  delSolidarites: {
    titre: "Délégué Solidarités",
    axe: "Pôle, opère la dimension engagement",
    rattachement: "Responsable d'antenne et responsable local du pôle Solidarités",
    temps: "Variable, par pics d'action",
    mission:
      "Le délégué Solidarités porte l'engagement et le service, la dimension qui met la blouse au service des autres dès maintenant. Il organise les temps d'engagement de l'antenne (maraudes, prévention en santé) et contribue aux actions grand public pilotées par la localité (interventions auprès des lycéens) en mobilisant des volontaires du campus.",
    responsabilites: [
      "Organiser des maraudes et actions de prévention en santé à l'échelle de l'antenne",
      "Mobiliser des volontaires pour les actions grand public pilotées par la localité (orientation lycéens, dépistage)",
      "Sensibiliser la communauté étudiante à la dimension citoyenne du parcours",
      "Remonter les opportunités d'action locale à la localité",
    ],
    profil: "Étudiant animé par le service et le terrain, bon mobilisateur, à l'aise pour donner envie de s'engager.",
    candidater: "Précisez une action solidaire que vous avez menée ou aimeriez lancer sur votre campus.",
  },
  delLogistique: {
    titre: "Délégué Logistique",
    axe: "Pôle, opère l'intendance",
    rattachement: "Responsable d'antenne et responsable local en charge de la logistique",
    temps: "Concentré autour des événements",
    mission:
      "Le délégué Logistique est le bras opérationnel qui fait tenir les événements. Il réserve les salles et gère le matériel, assure l'intendance de l'événement d'accueil de rentrée et des séances régulières, et appuie les autres délégués dans l'organisation matérielle.",
    responsabilites: [
      "Réserver les salles et gérer le matériel de l'antenne",
      "Assurer l'intendance de l'accueil de rentrée et des séances régulières",
      "Appuyer les autres délégués dans l'organisation matérielle de leurs actions",
      "Tenir un inventaire simple des ressources",
    ],
    profil:
      "Étudiant organisé, fiable et réactif, à l'aise avec l'intendance et l'anticipation. Peut s'entourer de chargés de mission (par exemple un chargé de mission Discord pour animer le serveur de l'antenne).",
    candidater: "Précisez une organisation logistique que vous avez déjà menée, même modeste.",
  },
  delComm: {
    titre: "Délégué Communication",
    axe: "Pôle, opère la visibilité",
    rattachement: "Responsable d'antenne et responsable local de la communication",
    temps: "Régulier, en continu",
    mission:
      "Le délégué Communication est la voix et la présence de l'antenne. Il anime la présence en ligne de l'antenne, relaie les événements et les campagnes d'adhésion, produit des visuels simples conformes à l'identité visuelle, et appuie l'accueil des nouveaux par la visibilité des temps de rentrée.",
    responsabilites: [
      "Animer les réseaux sociaux de l'antenne",
      "Relayer les événements et les campagnes d'adhésion (dont les candidatures)",
      "Produire des visuels simples conformes à la charte graphique nationale",
      "Appuyer la visibilité de l'accueil des nouveaux",
    ],
    profil:
      "Étudiant à l'aise avec les réseaux, sensible au respect d'une charte commune. La créativité est un plus, la régularité est essentielle.",
    candidater:
      "Précisez vos outils de prédilection (visuel, vidéo, rédaction) et un exemple de contenu que vous avez produit.",
  },
  refPromo: {
    titre: "Référent de promo",
    axe: "Promo, anime un périmètre humain",
    rattachement: "Responsable d'antenne",
    temps: "Léger, mais régulier",
    mission:
      "Le référent de promo est le lien humain de proximité, un par promotion. Il est le point de contact de sa promotion, accueille les nouveaux membres, relaie les informations et les temps forts, fait remonter besoins et ressentis, et contribue à la cohésion. Ce n'est pas un poste de pouvoir mais de lien.",
    responsabilites: [
      "Être le point de contact identifié de sa promotion",
      "Accueillir les nouveaux membres de la promo",
      "Relayer les informations et temps forts de l'antenne",
      "Faire remonter besoins et ressentis au responsable d'antenne",
    ],
    profil: "Étudiant apprécié de sa promotion, disponible et à l'écoute. Idéal pour un premier engagement : peu de charge, beaucoup d'impact humain.",
    candidater: "Précisez votre promotion et pourquoi vous voulez être ce point de contact.",
  },
};

// ---------- Formulaire de candidature : postes ouverts et leurs questions ----------
const POSTE_LIST = [
  "respAntenne",
  "delSavoir",
  "respPRP",
  "delEthique",
  "delSolidarites",
  "delLogistique",
  "delComm",
  "refPromo",
];

const POSTE_QUESTIONS = {
  respAntenne: {
    competence: "Précisez votre campus, votre année d'étude, et votre vision en quelques lignes pour l'antenne cette année.",
    valeurs: "Qu'est-ce qui vous donnerait envie de porter la responsabilité de toute une communauté étudiante, plutôt qu'une seule mission ?",
  },
  delSavoir: {
    competence: "Précisez votre expérience d'accompagnement méthodologique ou de mutualisation de ressources, et ce que vous aimeriez améliorer sur votre campus.",
    valeurs: "Qu'est-ce qui, dans le fait de transmettre une méthode plutôt qu'un savoir ponctuel, vous parle personnellement ?",
  },
  respPRP: {
    competence: "Précisez votre expérience de tutorat, le nombre de tuteurs que vous pensez pouvoir mobiliser, et le concours que vous connaissez le mieux.",
    valeurs: "Racontez un moment où vous avez vu quelqu'un progresser grâce à vous. Qu'est-ce que ça vous a fait ?",
  },
  delEthique: {
    competence: "Précisez un sujet éthique qui vous tient à cœur et comment vous animeriez un échange dessus.",
    valeurs: "Le triptyque de l'OMAS place l'éthique au même rang que la compétence et l'engagement. Pourquoi cette dimension compte-t-elle pour vous, dans votre future pratique de soignant ?",
  },
  delSolidarites: {
    competence: "Précisez une action solidaire que vous avez menée ou aimeriez lancer sur votre campus.",
    valeurs: "Qu'est-ce que servir les autres, avant même d'être diplômé, représente pour vous ?",
  },
  delLogistique: {
    competence: "Précisez une organisation logistique que vous avez déjà menée, même modeste.",
    valeurs: "Ce poste se voit peu et se remarque surtout quand quelque chose manque. Qu'est-ce qui vous motive dans un rôle qui demande de la rigueur plus que de la visibilité ?",
  },
  delComm: {
    competence: "Précisez vos outils de prédilection (visuel, vidéo, rédaction) et un exemple de contenu que vous avez produit.",
    valeurs: "Qu'auriez-vous envie que les gens ressentent en découvrant l'OMAS à travers ce que vous publiez ?",
  },
  refPromo: {
    competence: "Précisez votre promotion et pourquoi vous voulez être ce point de contact.",
    valeurs: "Qu'est-ce que vous aimeriez qu'un camarade de votre promo ressente en sachant qu'il peut se tourner vers vous ?",
  },
};

// ==== CONFIGURATION GOOGLE FORM (candidature) ====
// Formulaire : "Candidature Antenne OMAS"
// https://docs.google.com/forms/d/e/1FAIpQLSdRU_VNhbyDOEsGfCFMDnVW7E2gn6oQwfR5Yu09mMp3bfng-Q/viewform
const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdRU_VNhbyDOEsGfCFMDnVW7E2gn6oQwfR5Yu09mMp3bfng-Q/formResponse";
const GOOGLE_FORM_FIELDS = {
  prenomNom: "entry.621192451",
  email: "entry.1259729682",
  campus: "entry.1740388283",
  anneeFiliere: "entry.769357271",
  motivation: "entry.1682605124",
  ordrePostes: "entry.1306058184",
  postes: {
    respAntenne: { competence: "entry.1702122848", valeurs: "entry.1571863979" },
    delSavoir: { competence: "entry.1962427621", valeurs: "entry.1558166777" },
    respPRP: { competence: "entry.2051041900", valeurs: "entry.1532740468" },
    delEthique: { competence: "entry.157198701", valeurs: "entry.420741420" },
    delSolidarites: { competence: "entry.1547746428", valeurs: "entry.2092266740" },
    delLogistique: { competence: "entry.1586038474", valeurs: "entry.932272086" },
    delComm: { competence: "entry.1830815083", valeurs: "entry.11561215" },
    refPromo: { competence: "entry.1839402481", valeurs: "entry.1788734151" },
  },
};

function envoyerCandidature(payload) {
  const fd = new FormData();
  fd.append(GOOGLE_FORM_FIELDS.prenomNom, payload.prenomNom);
  fd.append(GOOGLE_FORM_FIELDS.email, payload.email);
  fd.append(GOOGLE_FORM_FIELDS.campus, payload.campus);
  fd.append(GOOGLE_FORM_FIELDS.anneeFiliere, payload.anneeFiliere);
  fd.append(GOOGLE_FORM_FIELDS.motivation, payload.motivation);
  fd.append(GOOGLE_FORM_FIELDS.ordrePostes, payload.ordrePostes);
  payload.postesChoisis.forEach((key) => {
    const champs = GOOGLE_FORM_FIELDS.postes[key];
    const rep = payload.reponses[key] || {};
    if (champs) {
      fd.append(champs.competence, rep.competence || "");
      fd.append(champs.valeurs, rep.valeurs || "");
    }
  });
  // mode "no-cors" : Google renvoie une réponse opaque, on ne peut pas lire le succès,
  // mais la soumission passe. L'appelant bascule sur l'écran de confirmation de façon optimiste.
  return fetch(GOOGLE_FORM_ACTION_URL, { method: "POST", mode: "no-cors", body: fd });
}

// ---------- Le test : questions à deux axes ----------
// Chaque option pèse sur un pôle (mission) et/ou un mode (type d'action).
const QUESTIONS = [
  {
    q: "Un vendredi soir libre à l'OMAS, tu te vois plutôt…",
    opts: [
      { t: "Reprendre un chapitre difficile avec un petit groupe", pole: "savoir", mode: "accompagner" },
      { t: "Préparer une maraude pour le week-end", pole: "solidarites", mode: "operer" },
      { t: "Boucler l'organisation d'un gros événement", pole: "logistique", mode: "coordonner" },
      { t: "Monter une story pour annoncer la prochaine séance", pole: "communication", mode: "operer" },
    ],
  },
  {
    q: "Ce qui te donne le plus d'énergie, c'est…",
    opts: [
      { t: "Voir quelqu'un comprendre grâce à toi", pole: "savoir", mode: "accompagner" },
      { t: "Aider concrètement une personne en difficulté", pole: "solidarites", mode: "accompagner" },
      { t: "Qu'un projet compliqué tombe enfin juste", pole: "logistique", mode: "coordonner" },
      { t: "Faire réfléchir un groupe sur une vraie question", pole: "ethique", mode: "operer" },
    ],
  },
  {
    q: "Dans un projet de groupe, ton réflexe naturel…",
    opts: [
      { t: "Je répartis, je planifie, je tiens le cap", pole: "coordination", mode: "coordonner" },
      { t: "Je prends une tâche précise et je la livre nickel", pole: "logistique", mode: "operer" },
      { t: "Je m'assure que personne ne décroche", pole: "solidarites", mode: "accompagner" },
      { t: "Je soigne la présentation et le message", pole: "communication", mode: "operer" },
    ],
  },
  {
    q: "Un sujet qui te ferait rester tard à en débattre…",
    opts: [
      { t: "La loi fin de vie, le sens du soin", pole: "ethique", mode: "operer" },
      { t: "Comment mieux préparer les PASS au concours", pole: "savoir", mode: "coordonner" },
      { t: "Comment toucher plus de monde sur les réseaux", pole: "communication", mode: "operer" },
      { t: "Comment fédérer étudiants et pros ensemble", pole: "reseau", mode: "coordonner" },
    ],
  },
  {
    q: "On te confie une mission. Tu préfères qu'elle soit…",
    opts: [
      { t: "Un accompagnement suivi, dans la durée, avec des gens", pole: "savoir", mode: "accompagner" },
      { t: "Un périmètre concret et bien délimité à faire tourner", pole: "logistique", mode: "operer" },
      { t: "Une équipe à animer et une vision à porter", pole: "coordination", mode: "coordonner" },
    ],
  },
  {
    q: "Le compliment qui te toucherait le plus…",
    opts: [
      { t: "« Sans toi, je n'y serais jamais arrivé·e »", pole: "savoir", mode: "accompagner" },
      { t: "« Tu as vraiment changé les choses sur le terrain »", pole: "solidarites", mode: "operer" },
      { t: "« Tu as tenu toute l'équipe ensemble »", pole: "coordination", mode: "coordonner" },
      { t: "« Ça, personne n'osait le dire, tu l'as posé »", pole: "ethique", mode: "operer" },
    ],
  },
  {
    q: "Ton rapport à la lumière et aux responsabilités…",
    opts: [
      { t: "À l'aise devant tout le monde, j'aime porter", pole: "coordination", mode: "coordonner" },
      { t: "Plus efficace dans l'ombre, sur du concret", pole: "logistique", mode: "operer" },
      { t: "En tête à tête, c'est là que je suis le·la meilleur·e", pole: "savoir", mode: "accompagner" },
      { t: "J'aime prendre la parole pour porter un message", pole: "communication", mode: "operer" },
    ],
  },
  {
    q: "Dans dix ans, ce qui te rendrait fier·e de ton passage à l'OMAS…",
    opts: [
      { t: "Des dizaines d'étudiants que j'ai aidés à réussir", pole: "savoir", mode: "accompagner" },
      { t: "Des actions solidaires qui existent encore après moi", pole: "solidarites", mode: "coordonner" },
      { t: "Une antenne / un territoire que j'ai fait grandir", pole: "coordination", mode: "coordonner" },
      { t: "Une culture éthique que j'ai contribué à installer", pole: "ethique", mode: "operer" },
    ],
  },
];

// ---------- Moteur de scoring ----------
function calculerResultat(reponses) {
  const scPole = {};
  const scMode = { accompagner: 0, operer: 0, coordonner: 0 };
  let coordination = 0;

  reponses.forEach((opt) => {
    if (!opt) return;
    if (opt.pole === "coordination") coordination += 1;
    else if (opt.pole) scPole[opt.pole] = (scPole[opt.pole] || 0) + 1;
    if (opt.mode) scMode[opt.mode] += 1;
  });

  const poleTop =
    Object.entries(scPole).sort((a, b) => b[1] - a[1])[0]?.[0] || "savoir";
  const modeTop =
    Object.entries(scMode).sort((a, b) => b[1] - a[1])[0]?.[0] || "operer";
  const penchantCoord = coordination >= 3 || modeTop === "coordonner";

  // --- Porte d'entrée (cercle 0) : la plus accessible selon le penchant ---
  let entree;
  if (modeTop === "accompagner") {
    entree = poleTop === "solidarites" ? "parrain" : "tuteur";
  } else {
    entree = "chargeMission";
  }

  // --- Trajectoire cible (cercle 1, parfois 2) ---
  let cible;
  const mapOpere = {
    savoir: "delSavoir",
    ethique: "delEthique",
    solidarites: "delSolidarites",
    logistique: "delLogistique",
    communication: "delComm",
    reseau: "delComm",
  };
  const mapCoord = {
    savoir: "respPRP",
    solidarites: "refPromo",
    ethique: "delEthique",
    logistique: "delLogistique",
    communication: "delComm",
    reseau: "refPortefeuille",
  };

  if (penchantCoord) {
    if (coordination >= 4) cible = "respAntenne";
    else cible = mapCoord[poleTop] || "respAntenne";
  } else if (modeTop === "accompagner") {
    if (poleTop === "savoir") cible = "delSavoir";
    else if (poleTop === "solidarites") cible = "delSolidarites";
    else cible = "refPromo";
  } else {
    cible = mapOpere[poleTop] || "delSavoir";
  }

  // --- Perspective localité (cercle 2) si forte coordination ---
  let perspective = null;
  if (coordination >= 4) {
    perspective = poleTop === "reseau" ? "refPortefeuille" : "respPoleLoc";
  }

  return { entree, cible, perspective, poleTop, modeTop };
}

// ---------- Logique du bandeau temporel ----------
function phaseCandidature(maintenant) {
  const ouverture = new Date("2026-07-27T00:00:00");
  const cloture = new Date("2026-08-02T23:59:59");
  if (maintenant < ouverture) return "avant";
  if (maintenant > cloture) return "apres";
  return "pendant";
}

const PHASE_CONTENU = {
  avant: {
    tag: "Bientôt",
    titre: "Les candidatures ouvrent le lundi 27 juillet",
    texte: "En attendant, explore les postes et fais le test. Tu seras prêt·e le jour J.",
    couleur: C.teal,
    badgeBg: C.tealFonce,
    badgeTexte: C.blanc,
    ctaLabel: "Revenir le 27 juillet",
    ctaActive: false,
  },
  pendant: {
    tag: "C'est ouvert",
    titre: "Les candidatures sont ouvertes",
    texte: "Tu as jusqu'au dimanche 2 août à 23h59 pour déposer la tienne. Repère ton poste et lance-toi.",
    couleur: C.or,
    badgeBg: C.or,
    badgeTexte: C.encre,
    ctaLabel: "Candidater maintenant",
    ctaActive: true,
  },
  apres: {
    tag: "Clôturé",
    titre: "Les candidatures sont closes",
    texte: "La fenêtre 2026 est terminée. Le site reste ouvert pour découvrir l'OMAS. À très vite pour la suite.",
    couleur: C.brume,
    badgeBg: C.brume,
    badgeTexte: C.blanc,
    ctaLabel: "Candidatures closes",
    ctaActive: false,
  },
};

// ============================================================
//  Composants
// ============================================================

function Eyebrow({ children, color = C.tealFonce, style }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Section({ children, style, id }) {
  return (
    <section id={id} style={{ padding: "76px 32px", ...style }}>
      <div style={{ maxWidth: CONTENU_MAXW, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

// ---------- Barre de navigation ----------
function Topbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(251,250,248,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(45,47,132,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: CONTENU_MAXW,
          margin: "0 auto",
          padding: "0 32px",
          height: 66,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: C.bleu, letterSpacing: "-0.01em" }}>
          OMAS
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 13.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.brume,
          }}
        >
          Antennes Île-de-France
        </span>
      </div>
    </header>
  );
}

// ---------- Bandeau candidature ----------
function BandeauCandidature() {
  const phase = phaseCandidature(new Date());
  const contenu = PHASE_CONTENU[phase];

  return (
    <div
      style={{
        background: C.blanc,
        border: `2px solid ${contenu.couleur}`,
        borderRadius: 18,
        padding: "32px 30px",
        display: "flex",
        gap: 22,
        alignItems: "flex-start",
        flexWrap: "wrap",
        boxShadow: OMBRE.carte,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: contenu.badgeTexte,
          background: contenu.badgeBg,
          padding: "6px 12px",
          borderRadius: 20,
          whiteSpace: "nowrap",
        }}
      >
        {contenu.tag}
      </span>
      <div style={{ flex: 1, minWidth: 240 }}>
        <h3
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 800,
            color: C.encre,
            margin: "0 0 8px",
          }}
        >
          {contenu.titre}
        </h3>
        <p style={{ color: C.brume, margin: 0, lineHeight: 1.6 }}>{contenu.texte}</p>
        <div
          style={{
            marginTop: 16,
            fontFamily: FONT,
            fontSize: 14,
            color: C.encre,
            fontWeight: 600,
          }}
        >
          Fenêtre 2026 : lun. 27 juillet 00h00 → dim. 2 août 23h59
        </div>
      </div>
    </div>
  );
}

// ---------- Carte de rôle (résultat du test) ----------
function CarteRole({ role, label, labelColor, onOpenFiche }) {
  const r = ROLES[role];
  if (!r) return null;
  const hasFiche = !!FICHES[role];
  return (
    <div
      onMouseEnter={(e) => surElevation(e, true)}
      onMouseLeave={(e) => surElevation(e, false)}
      style={{
        background: C.blanc,
        borderRadius: 16,
        padding: "22px 22px 20px",
        border: `1px solid ${C.voile}`,
        borderTop: `4px solid ${r.accent}`,
        boxShadow: OMBRE.carte,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: labelColor,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <h4
        style={{
          fontFamily: FONT,
          fontSize: 20,
          fontWeight: 800,
          color: C.encre,
          margin: "0 0 10px",
        }}
      >
        {r.nom}
      </h4>
      <p style={{ color: C.encre, lineHeight: 1.6, margin: "0 0 12px", fontSize: 14.5 }}>{r.pitch}</p>
      <div
        style={{
          fontSize: 13,
          color: C.brume,
          borderTop: `1px dashed ${C.voile}`,
          paddingTop: 12,
        }}
      >
        {r.entree}
      </div>
      {hasFiche && (
        <button
          type="button"
          onClick={() => onOpenFiche(role)}
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 700,
            color: C.tealFonce,
            background: "transparent",
            border: `1.5px solid ${C.teal}`,
            borderRadius: 999,
            padding: "9px 18px",
            cursor: "pointer",
          }}
        >
          Consulter la fiche de poste <ArrowRight size={15} weight="bold" />
        </button>
      )}
    </div>
  );
}

// ---------- Modale fiche de poste ----------
function ModaleFiche({ role, onClose, onCandidater }) {
  useEffect(() => {
    if (!role) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [role, onClose]);

  if (!role) return null;
  const fiche = FICHES[role];
  if (!fiche) return null;

  return (
    <div
      onClick={onClose}
      className="modale-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,21,55,0.6)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modale-carte"
        style={{
          background: C.blanc,
          borderRadius: 22,
          maxWidth: 640,
          width: "100%",
          maxHeight: "86vh",
          overflowY: "auto",
          padding: "38px 38px 34px",
          position: "relative",
          boxShadow: "0 30px 70px rgba(20,21,55,0.35)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: C.voile,
            color: C.bleu,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} weight="bold" />
        </button>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.tealFonce,
            marginBottom: 10,
          }}
        >
          {fiche.axe}
        </div>
        <h3 style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: C.bleu, margin: "0 0 18px", lineHeight: 1.2 }}>
          {fiche.titre}
        </h3>
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 22,
            paddingBottom: 22,
            borderBottom: `1px solid ${C.voile}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.brume,
                marginBottom: 4,
              }}
            >
              Rattachement
            </div>
            <div style={{ fontSize: 14.5, color: C.encre, fontWeight: 600 }}>{fiche.rattachement}</div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.brume,
                marginBottom: 4,
              }}
            >
              Temps estimé
            </div>
            <div style={{ fontSize: 14.5, color: C.encre, fontWeight: 600 }}>{fiche.temps}</div>
          </div>
        </div>
        <h4
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.bleu,
            margin: "0 0 8px",
          }}
        >
          Mission
        </h4>
        <p style={{ fontSize: 15.5, color: C.encre, lineHeight: 1.65, margin: "0 0 22px" }}>{fiche.mission}</p>
        <h4
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.bleu,
            margin: "0 0 10px",
          }}
        >
          Responsabilités principales
        </h4>
        <div style={{ margin: "0 0 22px" }}>
          {fiche.responsabilites.map((resp, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
              <CheckCircle size={18} weight="fill" color={C.teal} style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 15, color: C.encre, lineHeight: 1.55 }}>{resp}</span>
            </div>
          ))}
        </div>
        <h4
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.bleu,
            margin: "0 0 8px",
          }}
        >
          Profil recherché
        </h4>
        <p style={{ fontSize: 15.5, color: C.encre, lineHeight: 1.65, margin: "0 0 22px" }}>{fiche.profil}</p>
        <div style={{ background: C.voile, borderRadius: 14, padding: "20px 22px" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: C.bleu,
              marginBottom: 8,
            }}
          >
            Comment candidater
          </div>
          <p style={{ fontSize: 14.5, color: C.encre, lineHeight: 1.6, margin: "0 0 14px" }}>{fiche.candidater}</p>
          <button
            type="button"
            onClick={() => onCandidater(role)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT,
              fontSize: 14.5,
              fontWeight: 700,
              color: C.blanc,
              background: C.bleu,
              border: "none",
              cursor: "pointer",
              padding: "11px 22px",
              borderRadius: 999,
            }}
          >
            Candidater à ce poste <ArrowRight size={15} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Le test ----------
function Test({ onOpenFiche, onCandidater }) {
  const [etape, setEtape] = useState(-1); // -1 = intro, 0..n = questions, n = résultat
  const [reponses, setReponses] = useState(Array(QUESTIONS.length).fill(null));
  const testRef = useRef(null);

  const total = QUESTIONS.length;
  const fini = etape >= total;
  const resultat = useMemo(
    () => (fini ? calculerResultat(reponses) : null),
    [fini, reponses]
  );

  const choisir = (opt) => {
    const next = [...reponses];
    next[etape] = opt;
    setReponses(next);
    setTimeout(() => setEtape((e) => e + 1), 180);
  };

  const recommencer = () => {
    setReponses(Array(total).fill(null));
    setEtape(-1);
  };

  // Intro
  if (etape === -1) {
    return (
      <div
        ref={testRef}
        style={{
          background: `linear-gradient(135deg, ${C.bleu}, ${C.bleuFonce})`,
          borderRadius: 22,
          padding: "48px 36px",
          textAlign: "center",
          color: C.blanc,
          boxShadow: OMBRE.carteHover,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <Eyebrow color={C.or}>Test · 2 minutes</Eyebrow>
        <h3
          style={{
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 800,
            margin: "0 0 14px",
            lineHeight: 1.15,
          }}
        >
          Quel rôle te ressemble ?
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.82)",
            maxWidth: 480,
            margin: "0 auto 28px",
            lineHeight: 1.65,
            fontSize: 16,
          }}
        >
          Huit questions, aucune mauvaise réponse. À la fin, on te montre une porte
          d'entrée accessible dès maintenant, et le poste vers lequel ton profil penche.
        </p>
        <button
          onClick={() => setEtape(0)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.filter = "drop-shadow(0 12px 24px rgba(0,0,0,0.35))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.filter = "none";
          }}
          style={{
            fontFamily: FONT,
            fontSize: 16,
            fontWeight: 700,
            color: C.bleu,
            background: C.or,
            border: "none",
            borderRadius: 999,
            padding: "15px 36px",
            cursor: "pointer",
            transition: "transform 0.15s ease, filter 0.15s ease",
          }}
        >
          Commencer le test
        </button>
      </div>
    );
  }

  // Résultat
  if (fini && resultat) {
    const phase = phaseCandidature(new Date());
    const cta = PHASE_CONTENU[phase];
    const slots = [
      { key: resultat.entree, label: "Ta porte d'entrée, dès maintenant", labelColor: C.tealFonce },
      { key: resultat.cible, label: "La trajectoire vers laquelle tu penches", labelColor: C.bleu },
    ];
    if (resultat.perspective) {
      slots.push({ key: resultat.perspective, label: "Et plus loin, si tu veux porter plus grand", labelColor: C.brume });
    }

    return (
      <div ref={testRef} style={{ borderRadius: 22, boxShadow: OMBRE.carteHover, maxWidth: 640, margin: "0 auto" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${C.tealFonce}, ${C.bleuFonce})`,
            borderRadius: "22px 22px 0 0",
            padding: "38px 34px 28px",
            textAlign: "center",
            color: C.blanc,
          }}
        >
          <Eyebrow color={C.blanc}>Ton résultat</Eyebrow>
          <h3
            style={{
              fontFamily: FONT,
              fontSize: 27,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Voici où tu peux commencer, et où tu peux aller
          </h3>
        </div>
        <div
          style={{
            background: C.papier,
            borderRadius: "0 0 22px 22px",
            padding: "30px 26px 34px",
            display: "grid",
            gap: 18,
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            {slots.map((s) => (
              <CarteRole key={s.key} role={s.key} label={s.label} labelColor={s.labelColor} onOpenFiche={onOpenFiche} />
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              color: C.brume,
              fontSize: 14,
              lineHeight: 1.6,
              margin: "4px 0 0",
            }}
          >
            Ce test est une boussole, pas un verdict. Tu peux candidater à n'importe quel poste qui t'inspire.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onCandidater(FICHES[resultat.cible] ? resultat.cible : null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                padding: "13px 28px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                color: cta.ctaActive ? C.blanc : C.brume,
                background: cta.ctaActive ? C.tealFonce : C.voile,
              }}
            >
              {cta.ctaLabel} <ArrowRight size={16} weight="bold" />
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <button
              onClick={recommencer}
              style={{
                fontFamily: FONT,
                fontSize: 13.5,
                fontWeight: 600,
                color: C.brume,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Refaire le test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question en cours
  const question = QUESTIONS[etape];
  const progression = Math.round((etape / total) * 100);

  return (
    <div
      ref={testRef}
      style={{
        background: C.blanc,
        borderRadius: 22,
        padding: "36px 32px 40px",
        border: `1px solid ${C.voile}`,
        boxShadow: OMBRE.carte,
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          height: 6,
          background: C.voile,
          borderRadius: 6,
          marginBottom: 26,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progression}%`,
            height: "100%",
            background: C.teal,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 700,
          color: C.brume,
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        QUESTION {etape + 1} / {total}
      </div>
      <h3
        style={{
          fontFamily: FONT,
          fontSize: 24,
          fontWeight: 800,
          color: C.encre,
          margin: "0 0 24px",
          lineHeight: 1.3,
        }}
      >
        {question.q}
      </h3>
      <div style={{ display: "grid", gap: 12 }}>
        {question.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => choisir(opt)}
            style={{
              textAlign: "left",
              fontFamily: FONT,
              fontSize: 15.5,
              color: C.encre,
              background: C.papier,
              border: `1.5px solid ${C.voile}`,
              borderRadius: 14,
              padding: "15px 18px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.teal;
              e.currentTarget.style.background = C.voileTeal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.voile;
              e.currentTarget.style.background = C.papier;
            }}
          >
            {opt.t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Formulaire de questions ----------
function FormulaireQuestions() {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [envoye, setEnvoye] = useState(false);

  // ===== BRANCHEMENT GOOGLE FORMS =====
  // 1. Crée un Google Form avec 2 questions : "Prénom" (réponse courte) et "Question" (paragraphe).
  // 2. Clique sur les 3 points > "Obtenir le lien pré-rempli", remplis des valeurs test, copie le lien.
  //    Tu y liras des identifiants du type entry.123456789= pour chaque champ.
  // 3. Reporte l'URL du formulaire (en remplaçant /viewform par /formResponse) et les 2 identifiants ci-dessous.
  const GOOGLE_FORM_ACTION =
    "https://docs.google.com/forms/d/e/TON_ID_DE_FORMULAIRE/formResponse";
  const CHAMP_PRENOM = "entry.0000000000"; // identifiant du champ Prénom
  const CHAMP_QUESTION = "entry.1111111111"; // identifiant du champ Question

  const envoyer = () => {
    if (!message.trim()) return;
    const data = new URLSearchParams();
    data.append(CHAMP_PRENOM, nom);
    data.append(CHAMP_QUESTION, message);
    // mode "no-cors" : Google renvoie une réponse opaque, on ne peut pas lire le succès,
    // mais la soumission passe. On bascule sur l'écran de confirmation de façon optimiste.
    fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    }).catch(() => {});
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <div
        style={{
          background: C.voileTeal,
          borderRadius: 18,
          padding: "32px 30px",
          textAlign: "center",
          boxShadow: OMBRE.carte,
        }}
      >
        <h4
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 800,
            color: C.tealFonce,
            margin: "0 0 8px",
          }}
        >
          Question bien reçue
        </h4>
        <p style={{ color: C.brume, margin: 0, lineHeight: 1.6 }}>
          On te répond au plus vite. À très bientôt à l'OMAS.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.blanc,
        borderRadius: 18,
        padding: "30px 28px",
        border: `1px solid ${C.voile}`,
        boxShadow: OMBRE.carte,
      }}
    >
      <h4
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 800,
          color: C.encre,
          margin: "0 0 6px",
        }}
      >
        Une question ? Pose-la.
      </h4>
      <p style={{ color: C.brume, margin: "0 0 22px", lineHeight: 1.6 }}>
        Pas besoin d'attendre l'ouverture des candidatures. Un doute sur un poste, sur le
        parcours, sur l'engagement : écris-nous.
      </p>
      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Ton prénom (facultatif)"
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily: FONT,
          fontSize: 15,
          padding: "13px 16px",
          border: `1.5px solid ${C.voile}`,
          borderRadius: 12,
          marginBottom: 12,
          outline: "none",
        }}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ta question…"
        rows={4}
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily: FONT,
          fontSize: 15,
          padding: "13px 16px",
          border: `1.5px solid ${C.voile}`,
          borderRadius: 12,
          marginBottom: 16,
          outline: "none",
          resize: "vertical",
        }}
      />
      <button
        onClick={envoyer}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.bleuFonce;
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = C.bleu;
          e.currentTarget.style.transform = "translateY(0)";
        }}
        style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 700,
          color: C.blanc,
          background: C.bleu,
          border: "none",
          borderRadius: 999,
          padding: "14px 34px",
          cursor: "pointer",
          transition: "background 0.15s ease, transform 0.15s ease",
        }}
      >
        Envoyer ma question
      </button>
    </div>
  );
}

// ---------- Champ de formulaire (input / textarea) ----------
function champStyle(hasErr, touched, textarea) {
  return {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: FONT,
    fontSize: 15,
    background: C.papier,
    border: `1.5px solid ${touched && hasErr ? "#D9534F" : "rgba(45,47,132,0.14)"}`,
    borderRadius: 12,
    padding: "13px 15px",
    color: C.encre,
    outline: "none",
    ...(textarea ? { resize: "vertical", lineHeight: 1.5 } : {}),
  };
}

const CHAMP_LABEL_STYLE = {
  display: "block",
  fontFamily: FONT,
  fontSize: 13,
  fontWeight: 700,
  color: "#4A4B63",
  marginBottom: 6,
};

// ---------- Modale de candidature ----------
function ModaleCandidature({ open, posteInitial, onClose }) {
  const [common, setCommonState] = useState({ prenomNom: "", email: "", campus: "", anneeFiliere: "", motivation: "" });
  const [postes, setPostesState] = useState(["", "", ""]);
  const [reponses, setReponsesState] = useState({});
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setTouched(false);
    setErrors({});
    if (posteInitial) setPostesState((p) => (p[0] ? p : [posteInitial, p[1], p[2]]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const phase = phaseCandidature(new Date());

  const setCommonField = (field, value) => setCommonState((c) => ({ ...c, [field]: value }));
  const setPoste = (slot, value) => {
    setPostesState((prev) => {
      const next = [...prev];
      next[slot] = value;
      if (value) {
        next.forEach((v, i) => {
          if (i !== slot && v === value) next[i] = "";
        });
      }
      return next;
    });
  };
  const setReponse = (key, field, value) =>
    setReponsesState((r) => ({ ...r, [key]: { ...(r[key] || {}), [field]: value } }));

  const postesChoisis = postes.filter(Boolean);
  const posteOptions = (slotIdx, placeholder) => {
    const opts = POSTE_LIST.filter((k) => postes[slotIdx] === k || !postes.includes(k)).map((k) => ({
      value: k,
      label: ROLES[k].nom,
    }));
    return [{ value: "", label: placeholder }, ...opts];
  };

  const submit = () => {
    const errs = {};
    ["prenomNom", "email", "campus", "anneeFiliere", "motivation"].forEach((f) => {
      if (!common[f] || !common[f].trim()) errs[f] = true;
    });
    if (postesChoisis.length === 0) errs.poste0 = true;
    postesChoisis.forEach((key) => {
      const rep = reponses[key] || {};
      if (!rep.competence || !rep.competence.trim()) errs[key + "_competence"] = true;
      if (!rep.valeurs || !rep.valeurs.trim()) errs[key + "_valeurs"] = true;
    });
    if (Object.keys(errs).length > 0) {
      setTouched(true);
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setErrors({});
    const ordrePostes = postesChoisis.map((k) => ROLES[k].nom).join(" > ");
    envoyerCandidature({ ...common, ordrePostes, postesChoisis, reponses })
      .then(() => {
        setSubmitting(false);
        setSubmitted(true);
      })
      .catch(() => {
        setSubmitting(false);
        setSubmitted(true);
      });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,21,55,0.6)",
        zIndex: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.blanc,
          borderRadius: 22,
          maxWidth: 680,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "34px 30px 30px",
          position: "relative",
          boxShadow: "0 30px 70px rgba(20,21,55,0.35)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: C.voile,
            color: C.bleu,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} weight="bold" />
        </button>

        <div
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.tealFonce,
            marginBottom: 8,
          }}
        >
          Candidature
        </div>
        <h3 style={{ fontFamily: FONT, fontSize: 25, fontWeight: 800, color: C.bleu, margin: "0 0 22px" }}>
          Rejoindre l'équipe de ton antenne
        </h3>

        {phase === "avant" && (
          <div style={{ background: C.voile, borderRadius: 16, padding: "26px 24px", textAlign: "center" }}>
            <Hourglass size={32} color={C.bleu} />
            <p style={{ fontFamily: FONT, fontSize: 15.5, color: C.encre, lineHeight: 1.6, margin: "14px 0 0", fontWeight: 500 }}>
              Les candidatures ouvrent le lundi 27 juillet à 00h00. Reviens à ce moment pour déposer la tienne, ton
              choix de poste restera libre ce jour-là.
            </p>
          </div>
        )}

        {phase === "apres" && (
          <div style={{ background: "#F3F2ED", borderRadius: 16, padding: "26px 24px", textAlign: "center" }}>
            <LockKey size={32} color={C.brume} />
            <p style={{ fontFamily: FONT, fontSize: 15.5, color: C.encre, lineHeight: 1.6, margin: "14px 0 0", fontWeight: 500 }}>
              La fenêtre de candidature 2026 est close. Merci pour ton intérêt, à très vite pour la suite.
            </p>
          </div>
        )}

        {phase === "pendant" && submitted && (
          <div style={{ textAlign: "center", padding: "20px 10px 10px" }}>
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: C.voileTeal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 22px",
              }}
            >
              <CheckCircle size={36} weight="fill" color={C.tealFonce} />
            </div>
            <h4 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, margin: "0 0 10px", fontWeight: 800 }}>
              Candidature envoyée, merci !
            </h4>
            <p style={{ fontSize: 15, color: C.brume, lineHeight: 1.6, margin: "0 0 24px" }}>
              On revient vers toi après la clôture, avec une réponse humaine.
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                color: C.bleu,
                background: C.papier,
                border: "1.5px solid rgba(45,47,132,0.2)",
                padding: "12px 26px",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              Fermer
            </button>
          </div>
        )}

        {phase === "pendant" && !submitted && (
          <>
            {touched && Object.keys(errors).length > 0 && (
              <div
                style={{
                  background: "rgba(217,83,79,0.1)",
                  border: "1px solid rgba(217,83,79,0.3)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 20,
                  fontFamily: FONT,
                  fontSize: 14,
                  color: "#B23B36",
                  fontWeight: 600,
                }}
              >
                Certains champs sont manquants ou incomplets : ils sont signalés ci-dessous.
              </div>
            )}

            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bleu, marginBottom: 12 }}>
              1. Tes informations
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={CHAMP_LABEL_STYLE}>Prénom et nom</label>
                <input
                  type="text"
                  value={common.prenomNom}
                  onChange={(e) => setCommonField("prenomNom", e.target.value)}
                  placeholder="Ton prénom et nom"
                  style={champStyle(errors.prenomNom, touched)}
                />
              </div>
              <div>
                <label style={CHAMP_LABEL_STYLE}>Adresse email</label>
                <input
                  type="email"
                  value={common.email}
                  onChange={(e) => setCommonField("email", e.target.value)}
                  placeholder="toi@exemple.fr"
                  style={champStyle(errors.email, touched)}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={CHAMP_LABEL_STYLE}>Campus ou université</label>
                <input
                  type="text"
                  value={common.campus}
                  onChange={(e) => setCommonField("campus", e.target.value)}
                  placeholder="Ton campus"
                  style={champStyle(errors.campus, touched)}
                />
              </div>
              <div>
                <label style={CHAMP_LABEL_STYLE}>Année d'étude et filière</label>
                <input
                  type="text"
                  value={common.anneeFiliere}
                  onChange={(e) => setCommonField("anneeFiliere", e.target.value)}
                  placeholder="ex. P2 Médecine, LAS Droit, D2…"
                  style={champStyle(errors.anneeFiliere, touched)}
                />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={CHAMP_LABEL_STYLE}>Pourquoi rejoindre l'OMAS, en quelques mots</label>
              <textarea
                rows={3}
                value={common.motivation}
                onChange={(e) => setCommonField("motivation", e.target.value)}
                placeholder="Quelques phrases suffisent."
                style={champStyle(errors.motivation, touched, true)}
              />
            </div>

            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bleu, marginBottom: 4 }}>
              2. Tes choix de poste
            </div>
            <p style={{ fontFamily: FONT, fontSize: 13.5, color: C.brume, margin: "0 0 14px" }}>
              Un poste au minimum, jusqu'à trois par ordre de préférence.
            </p>
            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
              {["1er choix", "2e choix (optionnel)", "3e choix (optionnel)"].map((label, slot) => (
                <div key={slot}>
                  <label style={CHAMP_LABEL_STYLE}>{label}</label>
                  <select
                    value={postes[slot]}
                    onChange={(e) => setPoste(slot, e.target.value)}
                    style={champStyle(slot === 0 && errors.poste0, touched)}
                  >
                    {posteOptions(slot, slot === 0 ? "Choisis un poste" : "Aucun (optionnel)").map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {postesChoisis.length > 0 && (
              <>
                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bleu, marginBottom: 14 }}>
                  3. Tes réponses par poste
                </div>
                {postesChoisis.map((key) => {
                  const rep = reponses[key] || {};
                  const q = POSTE_QUESTIONS[key];
                  return (
                    <div key={key} style={{ background: C.papier, border: `1px solid ${C.voile}`, borderRadius: 14, padding: "20px 20px 18px", marginBottom: 16 }}>
                      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: C.bleu, marginBottom: 14 }}>{ROLES[key].nom}</div>
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ display: "block", fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: C.encre, lineHeight: 1.4, marginBottom: 6 }}>
                          {q.competence}
                        </label>
                        <textarea
                          rows={2}
                          value={rep.competence || ""}
                          onChange={(e) => setReponse(key, "competence", e.target.value)}
                          style={champStyle(errors[key + "_competence"], touched, true)}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: C.encre, lineHeight: 1.4, marginBottom: 6 }}>
                          {q.valeurs}
                        </label>
                        <textarea
                          rows={2}
                          value={rep.valeurs || ""}
                          onChange={(e) => setReponse(key, "valeurs", e.target.value)}
                          style={champStyle(errors[key + "_valeurs"], touched, true)}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 700,
                color: C.blanc,
                background: C.teal,
                padding: 15,
                borderRadius: 12,
                border: "none",
                cursor: submitting ? "default" : "pointer",
                marginTop: 6,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Envoi en cours…" : "Envoyer ma candidature"} <PaperPlaneTilt size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
//  Page
// ============================================================
export default function App() {
  const [modalRole, setModalRole] = useState(null);
  const ouvrirFiche = (role) => setModalRole(role);
  const fermerFiche = () => setModalRole(null);

  const [candidature, setCandidature] = useState({ open: false, posteInitial: null });
  const ouvrirCandidatureGenerale = () => setCandidature({ open: true, posteInitial: null });
  const ouvrirCandidatureDepuisFiche = (role) => {
    setModalRole(null);
    setCandidature({ open: true, posteInitial: role });
  };
  const fermerCandidature = () => setCandidature((c) => ({ ...c, open: false }));

  const cercles = [
    {
      numero: 1,
      titre: "Tes portes d'entrée",
      sub: "Accessibles tout de suite, sans campagne de candidatures.",
      couleur: C.teal,
      badgeBg: C.tealFonce,
      badgeTexte: C.blanc,
      roles: ["tuteur", "parrain", "chargeMission"],
      clickable: false,
    },
    {
      numero: 2,
      titre: "Les postes de ton antenne",
      sub: "L'équipe de ton campus. C'est ici que s'ouvrent les candidatures.",
      couleur: C.bleu,
      badgeBg: C.bleu,
      badgeTexte: C.blanc,
      roles: ["respAntenne", "delSavoir", "respPRP", "delEthique", "delSolidarites", "delLogistique", "delComm", "refPromo"],
      clickable: true,
    },
    {
      numero: 3,
      titre: "Tes perspectives en localité",
      sub: "Pour plus tard, quand tu voudras porter plus grand qu'un campus.",
      couleur: C.bleuFonce,
      badgeBg: C.bleuFonce,
      badgeTexte: C.blanc,
      roles: ["respPoleLoc", "bureauLoc", "refPortefeuille"],
      clickable: false,
    },
  ];

  return (
    <div
      style={{
        fontFamily: FONT,
        color: C.encre,
        background: C.papier,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Topbar />

      {/* ---------- HERO ---------- */}
      <div
        style={{
          background: `radial-gradient(120% 120% at 20% 0%, ${C.bleu} 0%, ${C.bleuFonce} 55%, #14153f 100%)`,
          color: C.blanc,
          padding: "88px 32px 76px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -160,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: `2px solid ${C.teal}`,
            opacity: 0.18,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -80,
            top: -40,
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: `2px solid ${C.or}`,
            opacity: 0.22,
          }}
        />
        <div style={{ maxWidth: CONTENU_MAXW, margin: "0 auto", position: "relative" }}>
          <Eyebrow color={C.or}>OMAS · Antennes Île-de-France</Eyebrow>
          <h1
            style={{
              fontFamily: FONT,
              letterSpacing: "-0.02em",
              fontWeight: 800,
              fontSize: "clamp(38px, 6vw, 58px)",
              lineHeight: 1.08,
              margin: "0 0 22px",
              maxWidth: 760,
            }}
          >
            L'OMAS change d'échelle.{" "}
            <span style={{ color: C.teal }}>Et toi, tu prends quelle place&nbsp;?</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "rgba(255,255,255,0.82)",
              maxWidth: 600,
              lineHeight: 1.6,
              margin: "0 0 32px",
              fontWeight: 500,
            }}
          >
            Hier, une association de tutorat PASS/LAS. Aujourd'hui, un accompagnement
            continu de tous les étudiants en santé, autour de trois exigences :
            compétence, engagement, éthique.
          </p>
          <a
            href="#test"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.filter = "drop-shadow(0 14px 28px rgba(0,0,0,0.4))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.filter = "drop-shadow(0 8px 20px rgba(0,0,0,0.3))";
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 700,
              color: C.bleu,
              background: C.or,
              borderRadius: 999,
              padding: "15px 32px",
              textDecoration: "none",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
              transition: "transform 0.15s ease, filter 0.15s ease",
            }}
          >
            Trouve ton rôle en 2 minutes <ArrowRight size={18} weight="bold" />
          </a>
        </div>
        <svg
          aria-hidden
          className="indice-scroll"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            display: "block",
            margin: "40px auto 0",
            position: "relative",
            opacity: 0.7,
          }}
        >
          <path d="M4 9L12 17L20 9" stroke={C.or} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ---------- POURQUOI, À TON ÉCHELLE ---------- */}
      <Section style={{ background: C.papier, paddingBottom: 20 }}>
        <Eyebrow>Le pourquoi, à ton échelle</Eyebrow>
        <h2
          style={{
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.15,
            margin: "0 0 18px",
            maxWidth: 720,
            color: C.bleu,
          }}
        >
          Ce n'est plus réservé au concours. Ça te concerne, à chaque étape.
        </h2>
        <p style={{ fontSize: 17, color: C.brume, lineHeight: 1.7, maxWidth: 680, margin: "0 0 40px", fontWeight: 500 }}>
          L'OMAS n'est plus seulement un tutorat : c'est un accompagnement pour tous les
          étudiants en santé, de la première année jusqu'à l'exercice professionnel. La
          restructuration répond à une idée simple : on ne t'accompagne pas seulement
          pour passer un cap, mais tout au long de tes études. Quelle que soit ta
          filière, quel que soit ton niveau, il y a une place pour toi et une façon de
          contribuer.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
          {PUBLICS.map((pub) => (
            <div
              key={pub.mission}
              style={{
                background: C.blanc,
                borderRadius: 16,
                padding: "26px 22px",
                border: pub.border,
                boxShadow: OMBRE.carte,
                position: "relative",
              }}
            >
              {pub.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -11,
                    right: 16,
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: C.bleu,
                    background: C.or,
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  {pub.badge}
                </div>
              )}
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: pub.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <pub.Icone size={24} color={pub.accent} weight="regular" />
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: pub.accent === C.teal ? C.tealFonce : pub.accent,
                  marginBottom: 6,
                }}
              >
                {pub.mission}
              </div>
              <h3 style={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: C.encre, margin: "0 0 10px" }}>
                {pub.cible}
              </h3>
              <p style={{ fontSize: 14, color: C.brume, lineHeight: 1.55, margin: 0 }}>{pub.detail}</p>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 22,
            padding: "18px 22px",
            background: C.voileOr,
            borderLeft: `4px solid ${C.or}`,
            borderRadius: "0 12px 12px 0",
          }}
        >
          <p style={{ fontSize: 14.5, color: C.encre, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Le Parcours omassien s'adresse à un public précis : les étudiants en santé,
            quelle que soit leur filière. C'est ton antenne, ce sont les gens de l'OMAS
            autour de toi sur ton campus.
          </p>
        </div>
      </Section>

      {/* ---------- LE PARCOURS OMASIEN : TRIPTYQUE ---------- */}
      <Section
        style={{
          background: C.blanc,
          borderTop: "1px solid rgba(45,47,132,0.07)",
          borderBottom: "1px solid rgba(45,47,132,0.07)",
          marginTop: 56,
        }}
      >
        <Eyebrow color={C.bleuFonce}>Le Parcours OMASien</Eyebrow>
        <h2
          style={{
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            maxWidth: 720,
            color: C.bleu,
          }}
        >
          Trois exigences, une même trajectoire.
        </h2>
        <p style={{ fontSize: 16.5, color: C.brume, lineHeight: 1.7, maxWidth: 680, margin: "0 0 40px", fontWeight: 500 }}>
          Être « du parcours », ce n'est pas un badge : c'est un engagement qui ouvre des
          portes. Le socle reste ouvert à tous les adhérents. Le parcours, lui, donne un
          accès enrichi et prioritaire aux ressources, aux ateliers à places limitées, à
          un accompagnement plus personnalisé.
        </p>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {TRIPTYQUE.map((t) => (
            <div
              key={t.cle}
              onMouseEnter={(e) => surElevation(e, true)}
              onMouseLeave={(e) => surElevation(e, false)}
              style={{
                background: t.voile,
                borderRadius: 18,
                padding: "28px 26px",
                borderTop: `5px solid ${t.accent}`,
                boxShadow: OMBRE.carte,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <h3 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: t.titleColor, margin: "0 0 6px" }}>
                {t.titre}
              </h3>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: C.encre, marginBottom: 14 }}>
                {t.resume}
              </div>
              <p style={{ color: C.brume, lineHeight: 1.6, fontSize: 15, margin: "0 0 18px", fontWeight: 500 }}>
                {t.detail}
              </p>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.labelAccent,
                  marginBottom: 10,
                }}
              >
                Par exemple
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {t.actions.map((a, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 14,
                      color: C.encre,
                      lineHeight: 1.5,
                      paddingLeft: 18,
                      position: "relative",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 7,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: t.accent,
                      }}
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- CE QUI CHANGE CONCRÈTEMENT ---------- */}
      <Section style={{ background: C.papier }}>
        <Eyebrow>D'hier à aujourd'hui</Eyebrow>
        <h2
          style={{
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            maxWidth: 720,
            color: C.bleu,
          }}
        >
          Ce qui change concrètement.
        </h2>
        <p style={{ fontSize: 16.5, color: C.brume, lineHeight: 1.7, maxWidth: 680, margin: "0 0 40px", fontWeight: 500 }}>
          Trois basculements de fond expliquent pourquoi ce n'est plus le même OMAS.
        </p>

        <div className="bascule-row" style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.brume,
              padding: "0 4px 10px",
            }}
          >
            Avant
          </div>
          <div />
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.tealFonce,
              padding: "0 4px 10px",
            }}
          >
            Aujourd'hui
          </div>
        </div>
        {BASCULEMENTS.map((b, i) => (
          <div key={i} className="bascule-row" style={{ alignItems: "stretch", marginBottom: 14 }}>
            <div style={{ background: "#F3F2ED", borderRadius: 14, padding: "20px 22px" }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: C.brume,
                  marginBottom: 8,
                }}
              >
                {b.titre}
              </div>
              <p style={{ fontSize: 14.5, color: C.brume, lineHeight: 1.55, margin: 0 }}>{b.avant}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.teal,
                  color: C.blanc,
                  flexShrink: 0,
                }}
              >
                <ArrowRight size={15} weight="bold" />
              </span>
            </div>
            <div
              style={{
                background: "rgba(0,160,154,0.07)",
                borderRadius: 14,
                padding: "20px 22px",
                border: "1px solid rgba(0,160,154,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: C.tealFonce,
                  marginBottom: 8,
                }}
              >
                {b.titre}
              </div>
              <p style={{ fontSize: 14.5, color: C.encre, lineHeight: 1.55, margin: 0, fontWeight: 500 }}>{b.apres}</p>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 52 }}>
          <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: C.bleu, margin: "0 0 16px" }}>
            Trois profils, un même respect
          </h3>
          <div style={{ background: C.voile, borderLeft: `4px solid ${C.bleu}`, borderRadius: "0 14px 14px 0", padding: "20px 24px", marginBottom: 28 }}>
            <p style={{ fontSize: 15, color: C.encre, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
              La différence entre l'adhérent et l'omassien du parcours n'est pas une
              différence de contenu ou de quantité de ressources : ce n'est pas un accès
              premium contre un accès basique. Elle tient au lien et à l'exigence :
              l'omassien bénéficie d'un accompagnement humain rapproché et, en
              contrepartie, s'engage sur le service et la formation éthique. Un
              engagement qui se mérite, pas un abonnement qui s'achète.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {PROFILS.map((p) => (
              <div
                key={p.nom}
                onMouseEnter={(e) => surElevation(e, true)}
                onMouseLeave={(e) => surElevation(e, false)}
                style={{
                  background: C.blanc,
                  borderRadius: 18,
                  padding: "26px 24px",
                  border: "1px solid rgba(45,47,132,0.1)",
                  borderTop: `5px solid ${p.accent}`,
                  boxShadow: OMBRE.carte,
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <h4 style={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: p.titleColor, margin: "0 0 14px" }}>
                  {p.nom}
                </h4>
                <div style={{ flex: 1 }}>
                  {p.bullets.map((bl, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 10 }}>
                      <CheckCircle size={17} weight="fill" color={p.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: C.encre, lineHeight: 1.5 }}>{bl}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: C.brume, borderTop: `1px dashed ${C.voile}`, paddingTop: 12, marginTop: 6, fontStyle: "italic" }}>
                  {p.note}
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: C.brume, fontSize: 13.5, lineHeight: 1.6, margin: "20px 0 0" }}>
            Trois profils, trois rapports différents à l'OMAS, tout aussi légitimes.
          </p>
        </div>
      </Section>

      {/* ---------- LA NOUVELLE ORGANISATION ---------- */}
      <Section style={{ background: C.blanc, borderTop: "1px solid rgba(45,47,132,0.07)" }}>
        <Eyebrow>La nouvelle organisation</Eyebrow>
        <h2
          style={{
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            maxWidth: 720,
            color: C.bleu,
          }}
        >
          Des pôles, trois échelons, une place pour chacun.
        </h2>
        <p style={{ fontSize: 16.5, color: C.brume, lineHeight: 1.7, maxWidth: 680, margin: "0 0 36px", fontWeight: 500 }}>
          Chaque pôle porte une mission et se décline du national jusqu'à ton campus. À
          ton échelle, l'antenne, ce sont des délégués qui font vivre ces missions et des
          référents qui gardent le lien humain.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
          {POLES_INFO.map((p) => (
            <div
              key={p.n}
              onMouseEnter={(e) => surElevation(e, true)}
              onMouseLeave={(e) => surElevation(e, false)}
              style={{
                background: C.blanc,
                borderRadius: 14,
                padding: "18px 16px",
                border: "1px solid rgba(45,47,132,0.1)",
                borderLeft: `4px solid ${p.c}`,
                boxShadow: OMBRE.carte,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 19, color: p.c, marginBottom: 6 }}>{p.n}</div>
              <div style={{ fontSize: 13, color: C.brume, lineHeight: 1.5 }}>{p.d}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "18px 22px", background: C.voile, borderRadius: 14, fontSize: 14, color: C.encre, lineHeight: 1.6, marginBottom: 40 }}>
          <strong>Le vocabulaire OMAS, en clair :</strong> le <em>responsable</em> décide
          et conçoit, le <em>délégué</em> opère sur ton campus, le <em>référent</em>{" "}
          anime un groupe humain (ta promo). Trois mots, trois fonctions.
        </div>

        <div
          style={{
            border: "1px solid rgba(45,47,132,0.1)",
            borderRadius: 18,
            background: C.papier,
            padding: "36px 28px",
            boxShadow: OMBRE.carte,
          }}
        >
          <OrganigrammeAntenne />
        </div>
        <p style={{ fontSize: 12, color: C.brume, textAlign: "center", marginTop: 12 }}>
          Tous les délégués de pôle sont au même échelon d'antenne, sous le·la référent·e.
        </p>
      </Section>

      {/* ---------- LES RÔLES, EN 3 CERCLES ---------- */}
      <Section style={{ background: C.blanc, borderTop: "1px solid rgba(45,47,132,0.07)" }}>
        <Eyebrow>Les rôles, concrètement</Eyebrow>
        <h2
          style={{
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            maxWidth: 720,
            color: C.bleu,
          }}
        >
          Trois cercles, du plus accessible au plus engageant.
        </h2>
        <p style={{ fontSize: 16.5, color: C.brume, lineHeight: 1.7, maxWidth: 680, margin: "0 0 8px", fontWeight: 500 }}>
          Tu peux commencer petit et grandir. Voici comment ça s'emboîte. Les postes
          d'antenne (cercle 2) ouvrent une fiche de poste complète au clic.
        </p>

        {cercles.map((cercle) => (
          <div key={cercle.titre} style={{ marginTop: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: cercle.badgeBg,
                  color: cercle.badgeTexte,
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {cercle.numero}
              </span>
              <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: cercle.couleur, margin: 0 }}>
                {cercle.titre}
              </h3>
              <span style={{ fontSize: 14, color: C.brume }}>{cercle.sub}</span>
            </div>
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {cercle.roles.map((rk) => {
                const r = ROLES[rk];
                return (
                  <div
                    key={rk}
                    role={cercle.clickable ? "button" : undefined}
                    tabIndex={cercle.clickable ? 0 : undefined}
                    onClick={cercle.clickable ? () => ouvrirFiche(rk) : undefined}
                    onKeyDown={
                      cercle.clickable
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              ouvrirFiche(rk);
                            }
                          }
                        : undefined
                    }
                    onMouseEnter={(e) => (cercle.clickable ? surElevationFiltre(e, true) : surElevation(e, true))}
                    onMouseLeave={(e) => (cercle.clickable ? surElevationFiltre(e, false) : surElevation(e, false))}
                    style={{
                      background: C.papier,
                      borderRadius: 12,
                      padding: "16px 16px",
                      border: `1px solid ${C.voile}`,
                      borderLeft: `3px solid ${r.accent}`,
                      boxShadow: cercle.clickable ? undefined : OMBRE.carte,
                      filter: cercle.clickable ? OMBRE.filtreCarte : undefined,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
                      cursor: cercle.clickable ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT,
                        fontWeight: 600,
                        fontSize: 15,
                        color: C.encre,
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span>{r.nom}</span>
                      {cercle.clickable && <FileText size={16} color={C.brume} style={{ flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: 13, color: C.brume, lineHeight: 1.5 }}>{r.pitch.split(".")[0]}.</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Section>

      {/* ---------- LE TEST ---------- */}
      <Section style={{ background: C.papier }}>
        <div id="test" style={{ scrollMarginTop: 76 }}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <Eyebrow color={C.bleu} style={{ display: "inline-block" }}>
              À toi de jouer
            </Eyebrow>
            <h2
              style={{
                fontFamily: FONT,
                letterSpacing: "-0.02em",
                fontWeight: 800,
                fontSize: "clamp(26px, 3.6vw, 38px)",
                lineHeight: 1.15,
                margin: 0,
                color: C.bleu,
              }}
            >
              Le test qui te trouve une place.
            </h2>
          </div>
          <Test onOpenFiche={ouvrirFiche} onCandidater={(role) => setCandidature({ open: true, posteInitial: role })} />
        </div>
      </Section>

      {/* ---------- CANDIDATURE ---------- */}
      <Section
        id="candidature"
        style={{ background: C.blanc, borderTop: "1px solid rgba(45,47,132,0.07)", scrollMarginTop: 20 }}
      >
        <Eyebrow>Passe à l'action</Eyebrow>
        <h2
          style={{
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.15,
            margin: "0 0 30px",
            color: C.bleu,
          }}
        >
          Prêt·e à prendre ta place ?
        </h2>
        <div style={{ display: "grid", gap: 22 }}>
          <BandeauCandidature />
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={ouvrirCandidatureGenerale}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                padding: "13px 28px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                color: PHASE_CONTENU[phaseCandidature(new Date())].ctaActive ? C.blanc : C.brume,
                background: PHASE_CONTENU[phaseCandidature(new Date())].ctaActive ? C.tealFonce : C.voile,
              }}
            >
              {PHASE_CONTENU[phaseCandidature(new Date())].ctaLabel} <ArrowRight size={16} weight="bold" />
            </button>
          </div>
          <FormulaireQuestions />
        </div>
      </Section>

      {/* ---------- PIED ---------- */}
      <footer style={{ background: C.bleuFonce, color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "40px 24px", fontSize: 14 }}>
        <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: C.blanc, marginBottom: 10 }}>OMAS</div>
        <div aria-hidden style={{ width: 40, height: 3, borderRadius: 3, background: C.or, margin: "0 auto 16px" }} />
        Compétence · Engagement · Éthique · Antennes Île-de-France · 2026
      </footer>

      <ModaleFiche role={modalRole} onClose={fermerFiche} onCandidater={ouvrirCandidatureDepuisFiche} />
      <ModaleCandidature open={candidature.open} posteInitial={candidature.posteInitial} onClose={fermerCandidature} />
    </div>
  );
}
