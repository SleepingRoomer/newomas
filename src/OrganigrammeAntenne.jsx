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

const ORG_POLE_DELEGUES = [
  { n: "Délégué Savoir", d: "méthodologie, orientation", c: C.bleu, equipe: null },
  {
    n: "Délégué PRP",
    d: "tutorat, concours blancs",
    c: C.bleuFonce,
    equipe: [
      { n: "RP PASS", d: "coordonne PASS" },
      { n: "RP LAS", d: "coordonne LAS" },
      { n: "RM", d: "resp. matière" },
      { n: "Tuteurs", d: "sous PASS/LAS" },
    ],
  },
  { n: "Délégué Éthique", d: "séances, sens du soin", c: C.or, equipe: null },
  { n: "Délégué Solidarités", d: "maraudes, prévention", c: C.teal, equipe: null },
  {
    n: "Délégué Logistique",
    d: "événements, matériel",
    c: C.tealFonce,
    equipe: [{ n: "Chargé de mission Discord", d: "selon les besoins" }],
  },
  { n: "Délégué Communication", d: "réseaux, image", c: C.bleu, equipe: null },
];

const ORG_FILIERES = ["Médecine", "Pharmacie", "Odontologie", "Psychologie", "Kinésithérapie", "Ostéopathie"];

function CarteDelegue({ n, d, c, equipe }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 0", minWidth: 104 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(45,47,132,0.14)",
          borderTop: `3px solid ${c}`,
          borderRadius: 10,
          padding: "13px 10px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 13, color: C.encre, marginBottom: 2 }}>{n}</div>
        <div style={{ fontSize: 10.5, color: C.brume, lineHeight: 1.3 }}>{d}</div>
      </div>
      {equipe && (
        <>
          <div style={{ width: 0, height: 14, borderLeft: `2px dashed ${C.or}` }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, width: "100%" }}>
            {equipe.map((e) => (
              <div
                key={e.n}
                style={{
                  background: "#FAF3E2",
                  border: "1px dashed rgba(200,169,81,0.55)",
                  borderRadius: 7,
                  padding: "5px 6px",
                  textAlign: "center",
                  flex: "1 1 60px",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 9.5, color: "#6B5720" }}>{e.n}</div>
                <div style={{ fontSize: 8.5, color: C.orFonce, lineHeight: 1.2 }}>{e.d}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LabelAxe({ color, children }) {
  return (
    <div
      style={{
        fontSize: 11.5,
        fontWeight: 800,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

export default function OrganigrammeAntenne() {
  return (
    <div style={{ minWidth: 880 }}>
      {/* Niveau 1 : Responsable d'antenne, rattaché au Bureau de localité IDF */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.brume, marginBottom: 4 }}>
          Bureau de localité IDF
        </div>
        <div style={{ width: 0, height: 16, borderLeft: "2px dashed #B9BCD6" }} />
        <div
          style={{
            background: C.bleu,
            color: "#fff",
            borderRadius: 14,
            padding: "16px 34px",
            textAlign: "center",
            minWidth: 250,
            marginTop: 2,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Responsable d'antenne</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>un seul poste, pilote l'antenne</div>
        </div>
        <div style={{ width: 2, height: 20, background: "#B9BCD6" }} />
      </div>

      {/* Niveau 2 : trois axes au même niveau visuel : pôle, promo, filières */}
      <div style={{ display: "flex", gap: 36, justifyContent: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "3 1 500px" }}>
          <div style={{ width: 2, height: 18, background: "#B9BCD6" }} />
          <LabelAxe color={C.bleu}>Axe pôle</LabelAxe>
          <div style={{ borderTop: "2px solid #E4E5F2", paddingTop: 16, width: "100%", display: "flex", gap: 10, flexWrap: "nowrap", justifyContent: "flex-start" }}>
            {ORG_POLE_DELEGUES.map((o) => (
              <CarteDelegue key={o.n} {...o} />
            ))}
          </div>
        </div>

        <div style={{ width: 1, alignSelf: "stretch", background: "rgba(45,47,132,0.08)" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 170px" }}>
          <div style={{ width: 2, height: 18, background: "#B9BCD6" }} />
          <LabelAxe color={C.tealFonce}>Axe promo</LabelAxe>
          <div style={{ borderTop: "2px solid #E4E5F2", paddingTop: 16 }}>
            <div style={{ background: "#fff", border: "1px solid rgba(45,47,132,0.14)", borderTop: `3px solid ${C.tealFonce}`, borderRadius: 10, padding: "13px 14px", textAlign: "center", minWidth: 150 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.encre, marginBottom: 2 }}>Référent de promo</div>
              <div style={{ fontSize: 10.5, color: C.brume, lineHeight: 1.3 }}>
                un par promo et par filière (ex. P2 Médecine, P2 Dentaire… jusqu'à D4)
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: 1, alignSelf: "stretch", background: "rgba(45,47,132,0.08)" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 190px" }}>
          <div style={{ width: 2, height: 18, background: "#B9BCD6" }} />
          <LabelAxe color="#3C3E7A">Axe filières</LabelAxe>
          <div style={{ borderTop: "2px solid #E4E5F2", paddingTop: 16 }}>
            <div style={{ background: "#fff", border: "1px solid rgba(45,47,132,0.14)", borderTop: "3px solid #3C3E7A", borderRadius: 10, padding: "13px 14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
                {ORG_FILIERES.map((f) => (
                  <div key={f} style={{ background: "#F4F4FA", borderRadius: 7, padding: "5px 4px", textAlign: "center" }}>
                    <div style={{ fontWeight: 600, fontSize: 10, color: "#3C3E7A" }}>{f}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 9.5, color: C.brume, textAlign: "center", marginTop: 8 }}>selon les cursus du campus</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
