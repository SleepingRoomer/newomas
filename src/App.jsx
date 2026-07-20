import React, { useState, useMemo, useRef } from "react";
import OrganigrammeAntenne from "./OrganigrammeAntenne.jsx";

// ============================================================
//  OMAS : la restructuration, à ton échelle
//  Mini-site interactif pour les étudiants des antennes IDF
//  Palette maison : bleu #2D2F84 · teal #00A09A · or #C8A951
// ============================================================

// ---------- Design tokens ----------
const C = {
  bleu: "#2D2F84",
  bleuFonce: "#1E2060",
  teal: "#00A09A",
  tealFonce: "#007A76",
  or: "#C8A951",
  orFonce: "#9A7E33",
  encre: "#1B1C2E",
  brume: "#63657E",
  voile: "#EEF0FA",
  voileTeal: "#E4F5F4",
  voileOr: "#FAF3E2",
  papier: "#FBFAF7",
  blanc: "#FFFFFF",
};

// ---------- Données : les 3 dimensions du triptyque ----------
const TRIPTYQUE = [
  {
    cle: "competence",
    titre: "Compétence",
    accent: C.bleu,
    labelAccent: C.bleu,
    voile: C.voile,
    resume: "Apprendre, réussir, transmettre.",
    detail:
      "Le socle pédagogique. Au-delà du tutorat PASS/LAS/LSPS, un accompagnement méthodologique continu tout au long des études de santé.",
    actions: [
      "Assister à un concours blanc PASS/LAS encadré par le PRP",
      "Participer à un forum d'orientation pour éclairer son parcours",
      "Accéder aux ressources pédagogiques approfondies du parcours",
    ],
  },
  {
    cle: "engagement",
    titre: "Engagement",
    accent: C.tealFonce,
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
    accent: C.orFonce,
    // l'or, même foncé, ne passe pas 4.5:1 sur le voile clair pour du petit texte : encre pour le libellé fin.
    labelAccent: C.encre,
    voile: C.voileOr,
    resume: "Réfléchir, questionner, se situer.",
    detail:
      "La boussole. Le soignant de demain se construit une pensée : sur la fin de vie, le soin, la relation, le sens de son engagement.",
    actions: [
      "Assister à un atelier sur la loi fin de vie animé par un réanimateur",
      "Débattre d'un cas concret en séance éthique et spiritualité",
      "Confronter ses convictions à la réalité du terrain de soin",
    ],
  },
];

// ---------- Données : les rôles orientés par le test ----------
// cercle : 0 = porte d'entrée · 1 = antenne · 2 = localité
// pole : mission dominante · mode : accompagner | operer | coordonner
const ROLES = {
  tuteur: {
    nom: "Tuteur·rice",
    cercle: 0,
    pole: "savoir",
    mode: "accompagner",
    accent: C.bleu,
    pitch:
      "Tu prends un petit groupe d'étudiants et tu les fais progresser, séance après séance. La porte d'entrée la plus directe si transmettre te parle.",
    entree: "Se propose auprès du Responsable PRP, sans campagne de candidatures.",
  },
  parrain: {
    nom: "Parrain / Marraine",
    cercle: 0,
    pole: "solidarites",
    mode: "accompagner",
    accent: C.teal,
    pitch:
      "Tu accompagnes une personne, pas une matière. Un binôme, de la confiance, une présence dans les moments de doute. Le mentorat dans ce qu'il a de plus humain.",
    entree: "Rejoint le dispositif de mentorat, accessible dès la première année.",
  },
  chargeMission: {
    nom: "Chargé·e de mission",
    cercle: 0,
    pole: "logistique",
    mode: "operer",
    accent: C.orFonce,
    pitch:
      "Un périmètre précis, une mission concrète : le Discord, les réseaux, une maraude, une matière. Tu épaules un délégué sans passer par une élection.",
    entree: "Proposé par un délégué, validé par le responsable d'antenne.",
  },
  respAntenne: {
    nom: "Responsable d'antenne",
    cercle: 1,
    pole: "coordination",
    mode: "coordonner",
    accent: C.bleuFonce,
    pitch:
      "Tu pilotes toute la communauté étudiante de ton campus. Tu fais le lien avec la localité, tu tiens le cap, tu fais grandir ton équipe.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delSavoir: {
    nom: "Délégué·e Savoir",
    cercle: 1,
    pole: "savoir",
    mode: "operer",
    accent: C.bleu,
    pitch:
      "Méthodologie, mutualisation pédagogique, forum d'orientation : tu portes le volet compétence du parcours sur ton campus, main dans la main avec le PRP.",
    entree: "Poste électif, campagne de candidatures.",
  },
  respPRP: {
    nom: "Responsable PRP",
    cercle: 1,
    pole: "savoir",
    mode: "coordonner",
    accent: C.bleu,
    pitch:
      "Le tutorat, les concours blancs PASS/LAS, l'Année 0 : tu fais tourner la machine pédagogique qui a fait la réputation de l'OMAS. Tu animes une équipe de tuteurs.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delEthique: {
    nom: "Délégué·e Éthique",
    cercle: 1,
    pole: "ethique",
    mode: "operer",
    accent: C.or,
    pitch:
      "Tu organises les séances éthique et spiritualité, les ateliers avec des intervenants (comme celui sur la loi fin de vie). Tu fais réfléchir ta communauté.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delSolidarites: {
    nom: "Délégué·e Solidarités",
    cercle: 1,
    pole: "solidarites",
    mode: "operer",
    accent: C.teal,
    pitch:
      "Maraudes, prévention en santé, interventions auprès des lycéens : tu portes l'engagement de terrain de ton antenne. Le pôle qui met la blouse au service des autres.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delLogistique: {
    nom: "Délégué·e Logistique",
    cercle: 1,
    pole: "logistique",
    mode: "operer",
    accent: C.orFonce,
    pitch:
      "Salles, matériel, outils, organisation des événements : rien ne se fait sans toi. Le profil qui aime que les choses tournent et tombent juste.",
    entree: "Poste électif, campagne de candidatures.",
  },
  delComm: {
    nom: "Délégué·e Communication",
    cercle: 1,
    pole: "communication",
    mode: "operer",
    accent: C.tealFonce,
    pitch:
      "Réseaux, visuels, présence locale : tu fais rayonner l'antenne et tu donnes envie de rejoindre. La voix et l'image de ton campus.",
    entree: "Poste électif, campagne de candidatures.",
  },
  refPromo: {
    nom: "Référent·e de promo",
    cercle: 1,
    pole: "solidarites",
    mode: "accompagner",
    accent: C.teal,
    pitch:
      "Un·e par promo. Tu es le point de contact humain de ta promotion, le relais de l'Année 0, celui ou celle vers qui on se tourne. La proximité incarnée.",
    entree: "Poste électif, campagne de candidatures.",
  },
  respPoleLoc: {
    nom: "Responsable de pôle en localité",
    cercle: 2,
    pole: "coordination",
    mode: "coordonner",
    accent: C.bleuFonce,
    pitch:
      "Tu déclines un pôle (Savoir, Éthique, Solidarités, Réseau, Développement) à l'échelle de tout un territoire, au-dessus des antennes. La perspective quand piloter une mission te motive.",
    entree: "Échelon localité : une trajectoire, pas un premier poste.",
  },
  bureauLoc: {
    nom: "Bureau de localité",
    cercle: 2,
    pole: "coordination",
    mode: "coordonner",
    accent: C.bleuFonce,
    pitch:
      "Président·e, VP, secrétaire, trésorier·e : la tête d'un territoire entier. La perspective long terme si la coordination t'anime vraiment.",
    entree: "Échelon localité : élu par l'AG de localité.",
  },
  refPortefeuille: {
    nom: "Référent·e de portefeuille (localité)",
    cercle: 2,
    pole: "reseau",
    mode: "coordonner",
    accent: C.tealFonce,
    pitch:
      "Internes, communauté professionnelle (Le Club), relations institutionnelles : tu portes un public que l'antenne ne couvre pas. Pour qui pense déjà au-delà du campus.",
    entree: "Échelon localité : nomination après appel à candidatures.",
  },
};

// ---------- Le test : questions à deux axes ----------
// Chaque option pèse sur un pôle (mission) et/ou un mode (type d'action).
const POLES = ["savoir", "ethique", "solidarites", "logistique", "communication", "reseau"];
const MODES = ["accompagner", "operer", "coordonner"];

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

// ============================================================
//  Composants
// ============================================================

function Eyebrow({ children, color = C.tealFonce }) {
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function Section({ children, style }) {
  return (
    <section style={{ padding: "84px 24px", ...style }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

// ---------- Bandeau candidature ----------
function BandeauCandidature() {
  const phase = phaseCandidature(new Date());
  // couleur : accent du cadre (décoratif). badgeBg / badgeTexte : choisis pour
  // rester au-dessus de 4.5:1 (texte de 12 px), donc distincts de "couleur" par endroits.
  const contenu = {
    avant: {
      tag: "Bientôt",
      titre: "Les candidatures ouvrent le lundi 27 juillet",
      texte:
        "En attendant, explore les postes, fais le test, et pose tes questions ci-dessous. Tu seras prêt·e le jour J.",
      couleur: C.teal,
      badgeBg: C.tealFonce,
      badgeTexte: C.blanc,
    },
    pendant: {
      tag: "C'est ouvert",
      titre: "Les candidatures sont ouvertes",
      texte:
        "Tu as jusqu'au dimanche 2 août à 23h59 pour déposer la tienne. Repère ton poste et lance-toi.",
      couleur: C.or,
      badgeBg: C.or,
      badgeTexte: C.encre,
    },
    apres: {
      tag: "Clôturé",
      titre: "Les candidatures sont closes",
      texte:
        "La fenêtre 2026 est terminée. Le site reste ouvert pour découvrir l'OMAS. À très vite pour la suite.",
      couleur: C.brume,
      badgeBg: C.brume,
      badgeTexte: C.blanc,
    },
  }[phase];

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
      }}
    >
      <span
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
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
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 24,
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
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 14,
            color: C.encre,
            fontWeight: 500,
          }}
        >
          Fenêtre 2026 : lun. 27 juillet 00h00 → dim. 2 août 23h59
        </div>
      </div>
    </div>
  );
}

// ---------- Carte de rôle (résultat) ----------
function CarteRole({ role, label, labelColor }) {
  const r = ROLES[role];
  if (!r) return null;
  return (
    <div
      style={{
        background: C.blanc,
        borderRadius: 16,
        padding: "24px 24px 22px",
        border: `1px solid ${C.voile}`,
        borderTop: `4px solid ${r.accent}`,
      }}
    >
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: labelColor,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <h4
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 22,
          color: C.encre,
          margin: "0 0 10px",
        }}
      >
        {r.nom}
      </h4>
      <p style={{ color: C.encre, lineHeight: 1.6, margin: "0 0 14px", fontSize: 15 }}>
        {r.pitch}
      </p>
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
    </div>
  );
}

// ---------- Le test ----------
function Test() {
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
        }}
      >
        <Eyebrow color={C.or}>Test · 2 minutes</Eyebrow>
        <h3
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 34,
            margin: "0 0 14px",
            lineHeight: 1.15,
          }}
        >
          Quel rôle te ressemble ?
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.82)",
            maxWidth: 520,
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
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: C.bleu,
            background: C.or,
            border: "none",
            borderRadius: 40,
            padding: "15px 38px",
            cursor: "pointer",
          }}
        >
          Commencer le test
        </button>
      </div>
    );
  }

  // Résultat
  if (fini && resultat) {
    return (
      <div ref={testRef}>
        <div
          style={{
            background: `linear-gradient(135deg, ${C.tealFonce}, ${C.bleuFonce})`,
            borderRadius: "22px 22px 0 0",
            padding: "40px 36px 30px",
            textAlign: "center",
            color: C.blanc,
          }}
        >
          <Eyebrow color={C.blanc}>Ton résultat</Eyebrow>
          <h3
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 30,
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
          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "1fr",
            }}
          >
            <CarteRole
              role={resultat.entree}
              label="Ta porte d'entrée, dès maintenant"
              labelColor={C.tealFonce}
            />
            <CarteRole
              role={resultat.cible}
              label="La trajectoire vers laquelle tu penches"
              labelColor={C.bleu}
            />
            {resultat.perspective && (
              <CarteRole
                role={resultat.perspective}
                label="Et plus loin, si tu veux porter plus grand"
                labelColor={C.brume}
              />
            )}
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
            Ce test est une boussole, pas un verdict. Tu peux candidater à n'importe quel
            poste qui t'inspire, et commencer par ce qui te ressemble aujourd'hui.
          </p>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={recommencer}
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: C.bleu,
                background: "transparent",
                border: `2px solid ${C.bleu}`,
                borderRadius: 40,
                padding: "12px 30px",
                cursor: "pointer",
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
      }}
    >
      <div
        style={{
          height: 6,
          background: C.voile,
          borderRadius: 6,
          marginBottom: 28,
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
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: C.brume,
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}
      >
        QUESTION {etape + 1} / {total}
      </div>
      <h3
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 26,
          color: C.encre,
          margin: "0 0 26px",
          lineHeight: 1.25,
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
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 16,
              color: C.encre,
              background: C.papier,
              border: `1.5px solid ${C.voile}`,
              borderRadius: 14,
              padding: "16px 20px",
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
        }}
      >
        <h4
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 24,
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
      }}
    >
      <h4
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 24,
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
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
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
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
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
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: C.blanc,
          background: C.bleu,
          border: "none",
          borderRadius: 40,
          padding: "14px 34px",
          cursor: "pointer",
        }}
      >
        Envoyer ma question
      </button>
    </div>
  );
}

// ============================================================
//  Page
// ============================================================
export default function App() {
  // Charte OMAS : Helvetica en typographie principale.

  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: C.encre,
        background: C.papier,
        minHeight: "100vh",
      }}
    >
      {/* ---------- HERO ---------- */}
      <div
        style={{
          background: `radial-gradient(120% 120% at 20% 0%, ${C.bleu} 0%, ${C.bleuFonce} 55%, #14153f 100%)`,
          color: C.blanc,
          padding: "96px 24px 88px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* motif triptyque : trois arcs concentriques */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -160,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: `2px solid ${C.or}`,
            opacity: 0.25,
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
            border: `2px solid ${C.teal}`,
            opacity: 0.3,
          }}
        />
        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative" }}>
          <Eyebrow color={C.or}>OMAS · Antennes Île-de-France</Eyebrow>
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              letterSpacing: "-0.02em",
              fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 68px)",
              lineHeight: 1.05,
              margin: "0 0 22px",
              maxWidth: 780,
            }}
          >
            L'OMAS change d'échelle.
            <br />
            <span style={{ color: C.or }}>Et toi, tu prends quelle place&nbsp;?</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(17px, 2.2vw, 21px)",
              color: "rgba(255,255,255,0.82)",
              maxWidth: 620,
              lineHeight: 1.6,
              margin: "0 0 34px",
            }}
          >
            Hier, une association de tutorat PASS/LAS. Aujourd'hui, un accompagnement
            continu de tous les étudiants en santé, autour de trois exigences :
            compétence, engagement, éthique.
          </p>
          <a
            href="#test"
            style={{
              display: "inline-block",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: C.bleu,
              background: C.or,
              borderRadius: 40,
              padding: "15px 36px",
              textDecoration: "none",
            }}
          >
            Trouve ton rôle en 2 minutes
          </a>
        </div>
      </div>

      {/* ---------- POURQUOI, À TON ÉCHELLE ---------- */}
      <Section style={{ background: C.papier }}>
        <Eyebrow>Le pourquoi, à ton échelle</Eyebrow>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 1.15,
            margin: "0 0 20px",
            maxWidth: 760,
          }}
        >
          Ce n'est plus réservé au concours. Ça te concerne, à chaque étape.
        </h2>
        <p style={{ fontSize: 18, color: C.brume, lineHeight: 1.7, maxWidth: 720 }}>
          La restructuration de l'OMAS répond à une idée simple : on ne t'accompagne pas
          seulement pour passer un cap, mais tout au long de tes études de santé. Le
          tutorat reste le socle, il s'ouvre désormais sur bien plus. Quelle que soit ta
          filière, quel que soit ton niveau, il y a une place pour toi et une façon de
          contribuer.
        </p>
      </Section>

      {/* ---------- LE PARCOURS OMASIEN : TRIPTYQUE ---------- */}
      <Section style={{ background: C.blanc }}>
        <Eyebrow color={C.bleuFonce}>Le Parcours OMASien</Eyebrow>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            maxWidth: 760,
          }}
        >
          Trois exigences, une même trajectoire.
        </h2>
        <p
          style={{
            fontSize: 17,
            color: C.brume,
            lineHeight: 1.7,
            maxWidth: 720,
            margin: "0 0 44px",
          }}
        >
          Être « du parcours », ce n'est pas un badge : c'est un engagement qui ouvre des
          portes. Le socle reste ouvert à tous les adhérents. Le parcours, lui, donne un
          accès enrichi et prioritaire aux ressources, aux ateliers à places limitées, à
          un accompagnement plus personnalisé, en échange d'actions concrètes.
        </p>
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {TRIPTYQUE.map((t) => (
            <div
              key={t.cle}
              style={{
                background: t.voile,
                borderRadius: 18,
                padding: "28px 26px",
                borderTop: `5px solid ${t.accent}`,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: 26,
                  color: t.accent,
                  margin: "0 0 6px",
                }}
              >
                {t.titre}
              </h3>
              <div
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: C.encre,
                  marginBottom: 14,
                }}
              >
                {t.resume}
              </div>
              <p style={{ color: C.brume, lineHeight: 1.6, fontSize: 15, margin: "0 0 18px" }}>
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
                Pour la valider, par exemple
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

      {/* ---------- LA NOUVELLE ORGANISATION ---------- */}
      <Section style={{ background: C.papier }}>
        <Eyebrow>La nouvelle organisation</Eyebrow>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            maxWidth: 760,
          }}
        >
          Des pôles, trois échelons, une place pour chacun.
        </h2>
        <p
          style={{
            fontSize: 17,
            color: C.brume,
            lineHeight: 1.7,
            maxWidth: 720,
            margin: "0 0 40px",
          }}
        >
          Chaque pôle porte une mission et se décline du national jusqu'à ton campus. À
          ton échelle, l'antenne, ce sont des délégués qui font vivre ces missions et des
          référents qui gardent le lien humain.
        </p>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          }}
        >
          {[
            { n: "Savoir", d: "Méthodo, ressources, forum d'orientation", c: C.bleu },
            { n: "PRP", d: "Tutorat, concours blancs, Année 0", c: C.bleu },
            { n: "Éthique", d: "Séances et ateliers, sens du soin", c: C.orFonce },
            { n: "Solidarités", d: "Maraudes, prévention, lycéens", c: C.tealFonce },
            { n: "Logistique", d: "Événements, salles, matériel", c: C.orFonce },
            { n: "Communication", d: "Réseaux, image, rayonnement", c: C.tealFonce },
          ].map((p) => (
            <div
              key={p.n}
              style={{
                background: C.blanc,
                borderRadius: 14,
                padding: "20px 18px",
                border: `1px solid ${C.voile}`,
                borderLeft: `4px solid ${p.c}`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 19,
                  color: p.c,
                  marginBottom: 6,
                }}
              >
                {p.n}
              </div>
              <div style={{ fontSize: 13, color: C.brume, lineHeight: 1.5 }}>{p.d}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 30,
            padding: "18px 22px",
            background: C.voile,
            borderRadius: 14,
            fontSize: 14,
            color: C.encre,
            lineHeight: 1.6,
          }}
        >
          <strong>Le vocabulaire OMAS, en clair :</strong> le <em>responsable</em> décide
          et conçoit, le <em>délégué</em> opère sur ton campus, le <em>référent</em>{" "}
          anime un groupe humain (ta promo). Trois mots, trois fonctions.
        </div>

        {/* Organigramme de l'antenne : rendu à sa taille native pour rester lisible,
            avec défilement horizontal (conteneur en pleine largeur d'écran pour
            limiter le scroll aux écrans vraiment étroits) ; le zoom tactile reste
            disponible, le viewport de la page n'impose pas de maximum-scale. */}
        <div
          style={{
            marginTop: 26,
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            width: "100vw",
          }}
        >
          <div className="orga-scroll" style={{ overflowX: "auto", padding: "0 16px" }}>
            <div
              style={{
                minWidth: 1240,
                maxWidth: 1240,
                margin: "0 auto",
                border: `1px solid ${C.voile}`,
                borderRadius: 16,
                background: C.blanc,
                padding: 18,
              }}
            >
              <OrganigrammeAntenne />
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: 12,
            color: C.brume,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Fais défiler horizontalement pour voir tout le schéma sur petit écran.
        </p>
      </Section>

      {/* ---------- LES RÔLES, EN 3 CERCLES ---------- */}
      <Section style={{ background: C.blanc }}>
        <Eyebrow color={C.tealFonce}>Les rôles, concrètement</Eyebrow>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            maxWidth: 760,
          }}
        >
          Trois cercles, du plus accessible au plus engageant.
        </h2>
        <p
          style={{
            fontSize: 17,
            color: C.brume,
            lineHeight: 1.7,
            maxWidth: 720,
            margin: "0 0 40px",
          }}
        >
          Tu peux commencer petit et grandir. Voici comment ça s'emboîte.
        </p>

        {[
          {
            titre: "1 · Tes portes d'entrée",
            sub: "Accessibles tout de suite, sans campagne de candidatures.",
            couleur: C.teal,
            roles: ["tuteur", "parrain", "chargeMission"],
          },
          {
            titre: "2 · Les postes de ton antenne",
            sub: "L'équipe de ton campus. C'est ici que s'ouvrent les candidatures.",
            couleur: C.bleu,
            roles: [
              "respAntenne",
              "delSavoir",
              "respPRP",
              "delEthique",
              "delSolidarites",
              "delLogistique",
              "delComm",
              "refPromo",
            ],
          },
          {
            titre: "3 · Tes perspectives en localité",
            sub: "Pour plus tard, quand tu voudras porter plus grand qu'un campus.",
            couleur: C.orFonce,
            roles: ["respPoleLoc", "bureauLoc", "refPortefeuille"],
          },
        ].map((cercle) => (
          <div key={cercle.titre} style={{ marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: 24,
                  color: cercle.couleur,
                  margin: 0,
                }}
              >
                {cercle.titre}
              </h3>
              <span style={{ fontSize: 14, color: C.brume }}>{cercle.sub}</span>
            </div>
            <div
              style={{
                display: "grid",
                gap: 14,
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {cercle.roles.map((rk) => {
                const r = ROLES[rk];
                return (
                  <div
                    key={rk}
                    style={{
                      background: C.papier,
                      borderRadius: 12,
                      padding: "16px 16px",
                      border: `1px solid ${C.voile}`,
                      borderLeft: `3px solid ${r.accent}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 15,
                        color: C.encre,
                        marginBottom: 4,
                      }}
                    >
                      {r.nom}
                    </div>
                    <div style={{ fontSize: 13, color: C.brume, lineHeight: 1.5 }}>
                      {r.pitch.split(".")[0]}.
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Section>

      {/* ---------- LE TEST ---------- */}
      <Section style={{ background: C.papier }} >
        <div id="test" style={{ scrollMarginTop: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <Eyebrow color={C.bleu}>À toi de jouer</Eyebrow>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                letterSpacing: "-0.02em",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Le test qui te trouve une place.
            </h2>
          </div>
          <Test />
        </div>
      </Section>

      {/* ---------- PASSE À L'ACTION ---------- */}
      <Section style={{ background: C.blanc }}>
        <Eyebrow color={C.tealFonce}>Passe à l'action</Eyebrow>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-0.02em",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 1.15,
            margin: "0 0 30px",
            maxWidth: 760,
          }}
        >
          Prêt·e à prendre ta place ?
        </h2>
        <div style={{ display: "grid", gap: 22 }}>
          <BandeauCandidature />
          <FormulaireQuestions />
        </div>
      </Section>

      {/* ---------- PIED ---------- */}
      <footer
        style={{
          background: C.bleuFonce,
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
          padding: "40px 24px",
          fontSize: 14,
        }}
      >
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 22,
            color: C.blanc,
            marginBottom: 8,
          }}
        >
          OMAS
        </div>
        Compétence · Engagement · Éthique · Antennes Île-de-France · 2026
      </footer>
    </div>
  );
}
