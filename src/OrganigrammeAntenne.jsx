import React from "react";

// Organigramme-type d'une antenne OMAS. Rendu à sa taille native (viewBox
// 1240x1120) : le conteneur appelant gère le défilement horizontal plutôt
// que de le faire rétrécir, pour garder les libellés lisibles.
export default function OrganigrammeAntenne() {
  return (
    <svg
      width="1240"
      height="1120"
      viewBox="0 0 1240 1120"
      role="img"
      aria-labelledby="orga-antenne-titre orga-antenne-desc"
      fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
      style={{ display: "block" }}
    >
      <title id="orga-antenne-titre">Organigramme-type d'une antenne OMAS</title>
      <desc id="orga-antenne-desc">
        Schéma de l'organisation d'une antenne : référent d'antenne, conseil
        d'antenne, axe promo, axe délégués (pôles et filières), lien vers
        l'accompagnement PRP et détail de l'équipe PASS/LAS.
      </desc>
      <defs>
        <style>{`
      .bleu{fill:#2D2F84;} .vert{fill:#00A09A;} .or{fill:#C8A951;}
      .bleu2{fill:#222463;} .vertd{fill:#007A76;} .ord{fill:#9A7E33;}
      .ltbleu{fill:#EEF0FA;} .ltvert{fill:#E4F5F4;} .ltor{fill:#FAF3E2;}
      .wt{fill:#FFFFFF;} .ink{fill:#24263A;} .muted{fill:#63657E;}
      .th{font-weight:bold;}
      .lk{stroke:#9DA0B8;stroke-width:1.8;fill:none;}
      .lkd{stroke:#9DA0B8;stroke-width:1.5;fill:none;stroke-dasharray:5 4;}
        `}</style>
      </defs>
      <rect x="0" y="0" width="1240" height="1120" fill="#FFFFFF" />

      <text x="60" y="56" className="bleu" fontSize="30" fontWeight="bold">
        Organigramme-type d'une antenne
      </text>
      <text x="60" y="86" className="muted" fontSize="16">
        Antenne : [NOM DU CAMPUS], cadre général adaptable, géométrie variable selon la maturité
      </text>
      <line x1="60" y1="102" x2="1180" y2="102" stroke="#C8A951" strokeWidth="2.5" />

      <g transform="translate(60,120)" fontSize="12.5">
        <rect x="0" y="0" width="15" height="15" rx="3" className="vert" />
        <text x="22" y="13" className="ink">Animation d'antenne</text>
        <rect x="180" y="0" width="15" height="15" rx="3" className="bleu" />
        <text x="202" y="13" className="ink">Délégués (pôles / filières)</text>
        <rect x="410" y="0" width="15" height="15" rx="3" className="or" />
        <text x="432" y="13" className="ink">Accompagnement PASS/LAS</text>
        <line x1="660" y1="8" x2="698" y2="8" className="lkd" />
        <text x="706" y="13" className="ink">Consultation / veto suspensif</text>
      </g>

      {/* Rattachement localité */}
      <rect x="470" y="150" width="300" height="42" rx="8" className="vertd" />
      <text x="620" y="176" className="wt th" fontSize="13" textAnchor="middle">
        Bureau de localité (échelon supérieur)
      </text>
      <line x1="620" y1="192" x2="620" y2="212" className="lk" />

      {/* Référent d'antenne */}
      <rect x="450" y="212" width="340" height="56" rx="9" className="vert" />
      <text x="620" y="236" className="wt th" fontSize="15" textAnchor="middle">
        Référent·e d'antenne
      </text>
      <text x="620" y="255" className="wt" fontSize="10.5" textAnchor="middle" opacity="0.9">
        anime la communauté, préside le conseil d'antenne
      </text>

      {/* Conseil d'antenne (choura) */}
      <line x1="790" y1="240" x2="900" y2="240" className="lkd" />
      <rect x="900" y="216" width="280" height="48" rx="8" className="ltor" />
      <text x="1040" y="236" className="ord th" fontSize="12" textAnchor="middle">
        Conseil d'antenne
      </text>
      <text x="1040" y="253" className="muted" fontSize="10" textAnchor="middle">
        choura : tous les référents + PRP
      </text>

      {/* 3 axes */}
      <line x1="620" y1="268" x2="620" y2="288" className="lk" />
      <line x1="230" y1="288" x2="1010" y2="288" className="lk" />
      <line x1="230" y1="288" x2="230" y2="308" className="lk" />
      <line x1="620" y1="288" x2="620" y2="308" className="lk" />
      <line x1="1010" y1="288" x2="1010" y2="308" className="lk" />

      {/* AXE PROMO */}
      <rect x="60" y="308" width="340" height="290" rx="11" className="ltvert" />
      <text x="84" y="333" className="vertd th" fontSize="14">Axe promo</text>
      <text x="84" y="352" className="muted" fontSize="10.5">le quotidien de chaque année d'études</text>
      <g fontSize="11.5">
        <rect x="84" y="366" width="292" height="36" rx="6" className="wt" stroke="#00A09A" />
        <text x="100" y="389" className="bleu th">Référent·e PASS / LAS</text>
        <rect x="84" y="410" width="292" height="36" rx="6" className="wt" stroke="#00A09A" />
        <text x="100" y="433" className="bleu th">Référent·e L1</text>
        <rect x="84" y="454" width="292" height="36" rx="6" className="wt" stroke="#00A09A" />
        <text x="100" y="477" className="bleu th">Référents P2, D1, D2, D3, D4</text>
        <rect x="84" y="498" width="292" height="36" rx="6" className="wt" stroke="#00A09A" />
        <text x="100" y="521" className="bleu th">Référents SMA (si concernés)</text>
      </g>
      <text x="84" y="558" className="muted" fontSize="10">Chaque référent de promo est le relais d'info et de</text>
      <text x="84" y="573" className="muted" fontSize="10">cohésion de son année. Un foyer, une promo.</text>
      <text x="84" y="590" className="ord" fontSize="10" fontStyle="italic">(adaptable selon les cursus du campus)</text>

      {/* AXE DÉLÉGUÉS */}
      <rect x="430" y="308" width="380" height="290" rx="11" className="ltbleu" />
      <text x="454" y="333" className="bleu th" fontSize="14">Axe délégués (pôles et filières)</text>
      <text x="454" y="352" className="muted" fontSize="10.5">déclinaison locale des missions nationales</text>
      <g fontSize="11.5">
        <rect x="454" y="366" width="160" height="52" rx="6" className="wt" stroke="#2D2F84" />
        <text x="534" y="390" className="bleu th" textAnchor="middle">Délégué Savoir</text>
        <text x="534" y="407" className="muted" fontSize="9.5" textAnchor="middle">appui pédagogique</text>
        <rect x="626" y="366" width="160" height="52" rx="6" className="wt" stroke="#2D2F84" />
        <text x="706" y="390" className="bleu th" textAnchor="middle">Délégué Éthique</text>
        <text x="706" y="407" className="muted" fontSize="9.5" textAnchor="middle">séances, sens</text>
        <rect x="454" y="426" width="160" height="52" rx="6" className="wt" stroke="#2D2F84" />
        <text x="534" y="450" className="bleu th" textAnchor="middle">Délégué Solidarités</text>
        <text x="534" y="467" className="muted" fontSize="9.5" textAnchor="middle">actions terrain</text>
        <rect x="626" y="426" width="160" height="52" rx="6" className="wt" stroke="#2D2F84" />
        <text x="706" y="446" className="bleu th" textAnchor="middle">Délégué Logistique</text>
        <text x="706" y="463" className="muted" fontSize="9.5" textAnchor="middle">= Développement</text>
      </g>
      <rect x="454" y="490" width="332" height="44" rx="6" className="ltvert" stroke="#00A09A" />
      <text x="620" y="512" className="vertd th" fontSize="11.5" textAnchor="middle">Délégués de filière</text>
      <text x="620" y="528" className="muted" fontSize="9.5" textAnchor="middle">si l'antenne regroupe plusieurs filières de santé</text>
      <text x="454" y="558" className="muted" fontSize="10">Réseau et Recherche ne sont pas déclinés à l'antenne :</text>
      <text x="454" y="573" className="muted" fontSize="10">le lien pros/Club/seniors reste porté par la localité.</text>
      <text x="454" y="590" className="ord" fontSize="10" fontStyle="italic">Vocabulaire : délégué à l'antenne = responsable ailleurs.</text>

      {/* ACCOMPAGNEMENT (droite) */}
      <rect x="840" y="308" width="340" height="290" rx="11" className="ltor" />
      <text x="864" y="333" className="ord th" fontSize="14">Lien vers l'accompagnement</text>
      <rect x="864" y="352" width="292" height="44" rx="7" className="or" />
      <text x="1010" y="374" className="wt th" fontSize="12" textAnchor="middle">Responsable PRP d'antenne</text>
      <text x="1010" y="390" className="wt" fontSize="9.5" textAnchor="middle" opacity="0.9">détaillé dans le bloc ci-dessous</text>
      <text x="864" y="424" className="muted" fontSize="10.5">Le Responsable PRP siège au conseil</text>
      <text x="864" y="440" className="muted" fontSize="10.5">d'antenne. Il pilote toute l'équipe</text>
      <text x="864" y="456" className="muted" fontSize="10.5">d'accompagnement PASS/LAS selon</text>
      <text x="864" y="472" className="muted" fontSize="10.5">le principe de choura.</text>
      <text x="864" y="500" className="ink th" fontSize="11">Le délégué Savoir travaille</text>
      <text x="864" y="516" className="ink th" fontSize="11">étroitement avec le PRP</text>
      <text x="864" y="532" className="muted" fontSize="10">(pédagogie de l'antenne).</text>

      {/* ligne vers bloc PRP */}
      <line x1="1010" y1="396" x2="1010" y2="612" className="lkd" />
      <line x1="1010" y1="612" x2="620" y2="612" className="lk" />
      <line x1="620" y1="612" x2="620" y2="628" className="lk" />

      {/* BLOC PRP DÉTAILLÉ */}
      <rect x="60" y="628" width="1120" height="420" rx="12" className="ltor" />
      <text x="84" y="656" className="ord th" fontSize="16">L'équipe d'accompagnement PASS/LAS : le PRP</text>
      <text x="84" y="678" className="muted" fontSize="11.5">
        Gouvernance en choura : le Responsable PRP décide et rend compte, le conseil pédagogique est consulté et peut opposer un veto suspensif.
      </text>

      <rect x="480" y="694" width="280" height="46" rx="8" className="or" />
      <text x="620" y="716" className="wt th" fontSize="13" textAnchor="middle">Responsable PRP d'antenne</text>
      <text x="620" y="732" className="wt" fontSize="9.5" textAnchor="middle" opacity="0.9">pilote, décide, rend compte</text>

      {/* veto */}
      <line x1="480" y1="717" x2="300" y2="717" className="lkd" />
      <line x1="300" y1="717" x2="300" y2="250" className="lkd" />
      <line x1="300" y1="250" x2="450" y2="250" className="lkd" />
      <text x="360" y="708" className="ord" fontSize="10" textAnchor="middle">veto suspensif vers référent d'antenne</text>

      <line x1="620" y1="740" x2="620" y2="756" className="lk" />
      <rect x="220" y="756" width="800" height="32" rx="6" className="ord" />
      <text x="620" y="777" className="wt th" fontSize="11.5" textAnchor="middle">
        Conseil pédagogique : consultation obligatoire sur les décisions majeures
      </text>

      <line x1="620" y1="788" x2="620" y2="804" className="lk" />
      <line x1="180" y1="804" x2="1060" y2="804" className="lk" />
      <g className="lk">
        <line x1="180" y1="804" x2="180" y2="820" />
        <line x1="400" y1="804" x2="400" y2="820" />
        <line x1="620" y1="804" x2="620" y2="820" />
        <line x1="840" y1="804" x2="840" y2="820" />
        <line x1="1060" y1="804" x2="1060" y2="820" />
      </g>

      <g fontSize="10.5" textAnchor="middle">
        <rect x="90" y="820" width="180" height="58" rx="7" className="wt" />
        <text x="180" y="843" className="bleu th">Responsable PASS</text>
        <text x="180" y="861" className="muted" fontSize="9.5">coordonne le public PASS</text>
        <rect x="310" y="820" width="180" height="58" rx="7" className="wt" />
        <text x="400" y="843" className="bleu th">Responsable LAS</text>
        <text x="400" y="861" className="muted" fontSize="9.5">coordonne le public LAS</text>
        <rect x="530" y="820" width="180" height="58" rx="7" className="wt" />
        <text x="620" y="843" className="bleu th">Responsable L1</text>
        <text x="620" y="861" className="muted" fontSize="9.5">coordonne le public L1</text>
        <rect x="750" y="820" width="180" height="58" rx="7" className="wt" />
        <text x="840" y="843" className="bleu th">Responsables Matière</text>
        <text x="840" y="861" className="muted" fontSize="9.5">supports, qualité (RM)</text>
        <rect x="970" y="820" width="180" height="58" rx="7" className="ltvert" />
        <text x="1060" y="843" className="bleu th">Parrains / Marraines</text>
        <text x="1060" y="861" className="muted" fontSize="9.5">accompagnement humain</text>
      </g>

      {/* tuteurs sous responsables d'année */}
      <line x1="180" y1="878" x2="180" y2="894" className="lk" />
      <line x1="400" y1="878" x2="400" y2="894" className="lk" />
      <line x1="620" y1="878" x2="620" y2="894" className="lk" />
      <line x1="180" y1="894" x2="620" y2="894" className="lk" />
      <line x1="400" y1="894" x2="400" y2="908" className="lk" />
      <rect x="300" y="908" width="200" height="42" rx="7" className="wt" stroke="#9DA0B8" />
      <text x="400" y="928" className="ink th" fontSize="11" textAnchor="middle">Tuteurs</text>
      <text x="400" y="944" className="muted" fontSize="9.5" textAnchor="middle">sous les responsables PASS/LAS/L1</text>

      {/* oraux, saisonnier */}
      <rect x="750" y="900" width="400" height="42" rx="7" className="ltbleu" stroke="#2D2F84" strokeDasharray="4 3" />
      <text x="950" y="920" className="bleu th" fontSize="11" textAnchor="middle">Responsable Oraux</text>
      <text x="950" y="936" className="muted" fontSize="9.5" textAnchor="middle">rôle saisonnier, actif à l'approche des oraux d'admission</text>

      <rect x="90" y="972" width="1060" height="54" rx="8" className="bleu" />
      <text x="620" y="995" className="wt th" fontSize="12.5" textAnchor="middle">
        Le PRP est la 1re dimension du parcours omassien (compétence). Éthique et Solidarités complètent l'accompagnement
      </text>
      <text x="620" y="1015" className="wt" fontSize="11" textAnchor="middle" opacity="0.9">
        via les délégués Éthique et Solidarités : on n'accompagne pas un candidat, on accueille un membre.
      </text>

      <text x="60" y="1082" className="muted" fontSize="10.5">
        OMAS, organigramme-type d'antenne, juillet 2026. À dupliquer et personnaliser pour chaque antenne. Les rôles s'activent selon les cursus et la maturité du campus.
      </text>
    </svg>
  );
}
