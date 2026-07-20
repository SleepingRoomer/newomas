import React from "react";

const C = {
  bleu: "#2D2F84",
  bleuFonce: "#1F2066",
  teal: "#00A09A",
  tealFonce: "#00857F",
  or: "#C8A951",
  orFonce: "#9A7E33",
  encre: "#23243F",
  brume: "#5C5D6B",
};

const ORG_POLES = [
  { n: "Délégué Savoir", d: "appui pédagogique", c: C.bleu },
  { n: "Délégué Éthique", d: "séances, sens du soin", c: C.or },
  { n: "Délégué Solidarités", d: "actions terrain", c: C.teal },
  { n: "Délégué Logistique", d: "événements, matériel", c: C.tealFonce },
  { n: "Délégué Communication", d: "réseaux, image", c: C.bleu },
];

const ORG_FILIERES = ["Médecine", "Pharmacie", "Odontologie", "Psychologie", "Kinésithérapie", "Ostéopathie"];

const ORG_COTE = [
  { n: "Référent·e de promo", d: "un par promotion", c: C.teal },
  { n: "Délégué PRP", d: "tutorat, concours blancs", c: C.bleuFonce },
];

const ORG_PRP_1 = [
  { n: "Responsable PASS", d: "coordonne le public PASS" },
  { n: "Responsable LAS", d: "coordonne le public LAS" },
  { n: "Responsable L1", d: "coordonne le public L1" },
  { n: "Responsables Matière", d: "supports, qualité" },
];

const ORG_PRP_2 = [
  { n: "Tuteurs", d: "sous PASS/LAS/L1" },
  { n: "Parrains / Marraines", d: "accompagnement humain" },
];

function PetiteCarte({ n, d, c, style }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(45,47,132,0.14)",
        borderTop: c ? `3px solid ${c}` : undefined,
        borderRadius: 10,
        padding: "13px 10px",
        textAlign: "center",
        ...style,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, color: C.encre, marginBottom: 2 }}>{n}</div>
      <div style={{ fontSize: 10.5, color: C.brume, lineHeight: 1.3 }}>{d}</div>
    </div>
  );
}

export default function OrganigrammeAntenne() {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            background: C.bleu,
            color: "#fff",
            borderRadius: 14,
            padding: "16px 30px",
            textAlign: "center",
            minWidth: 220,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16.5, marginBottom: 4 }}>Référent·e d'antenne</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>anime la communauté du campus</div>
        </div>
        <div style={{ width: 2, height: 22, background: "#B9BCD6" }} />
        <div style={{ width: "100%", maxWidth: 1000, height: 2, background: "#B9BCD6", marginBottom: 26 }} />
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{ flex: "2 1 420px", minWidth: 340 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.brume,
              marginBottom: 10,
            }}
          >
            Axe pôles
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 10,
              marginBottom: 22,
            }}
          >
            {ORG_POLES.map((o) => (
              <PetiteCarte key={o.n} {...o} />
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.brume,
              marginBottom: 10,
            }}
          >
            Axe filières{" "}
            <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
              (selon les cursus du campus)
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              gap: 10,
            }}
          >
            {ORG_FILIERES.map((f) => (
              <div
                key={f}
                style={{
                  background: "#fff",
                  border: "1px dashed rgba(74,77,166,0.4)",
                  borderRadius: 10,
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 12, color: "#3C3E7A" }}>{f}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: "1 1 220px", minWidth: 200, borderLeft: `2px dashed ${C.or}`, paddingLeft: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.orFonce,
              marginBottom: 10,
            }}
          >
            À côté
          </div>
          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            {ORG_COTE.map((o) => (
              <PetiteCarte key={o.n} {...o} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 2, height: 14, background: C.or }} />
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: C.orFonce,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Équipe du Délégué PRP
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(95px, 1fr))",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {ORG_PRP_1.map((o) => (
              <div
                key={o.n}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(200,169,81,0.4)",
                  borderRadius: 9,
                  padding: "9px 8px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 11.5, color: C.encre, marginBottom: 2 }}>{o.n}</div>
                <div style={{ fontSize: 10, color: C.brume, lineHeight: 1.25 }}>{o.d}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(95px, 1fr))",
              gap: 8,
            }}
          >
            {ORG_PRP_2.map((o) => (
              <div
                key={o.n}
                style={{
                  background: "#FAF3E2",
                  border: "1px dashed rgba(200,169,81,0.55)",
                  borderRadius: 9,
                  padding: "9px 8px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 11.5, color: C.encre, marginBottom: 2 }}>{o.n}</div>
                <div style={{ fontSize: 10, color: C.brume, lineHeight: 1.25 }}>{o.d}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 10, color: C.orFonce, fontStyle: "italic", margin: "8px 0 0" }}>
            + Responsable Oraux : rôle saisonnier.
          </p>
        </div>
      </div>
    </div>
  );
}
