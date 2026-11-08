import type { ReactNode } from "react";

const SITE = "https://security.bonk-os.app";
const FINGERPRINT = "A782 AC57 321A 862C 2ED8 F0FB 34F1 5332 E2A0 7A30";
const ADVISORY = "https://github.com/FantasmaGlad/Bonk/security/advisories/new";
const POLICY = "https://github.com/FantasmaGlad/Bonk/blob/main/SECURITY.md";
const MAIL = "security@bonk-os.app";

type Text = {
  lang: "en" | "fr";
  path: string;
  title: string;
  description: string;
  lead: string;
  key: string;
  labels: [string, string, string, string, string];
  report: string;
  steps: [string, string, ReactNode];
  file: string;
  policy: string;
  history: string;
  events: [string, string][];
  other: { href: string; lang: string; label: string };
};

const EN: Text = {
  lang: "en",
  path: "/",
  title: "Bonk security",
  description:
    "Report a Bonk vulnerability privately: OpenPGP key, fingerprint and signed security.txt.",
  lead: "Report vulnerabilities in Bonk, its website or its signed package repositories privately. Encrypt the report with the key below.",
  key: "Key",
  labels: ["Identity", "Fingerprint", "Algorithms", "Expires", "Files"],
  report: "Report",
  steps: [
    "1. Fetch the key and check its fingerprint against the one above:",
    "2. Encrypt the report. Attach your own public key to get an encrypted reply:",
    <>
      3. Send the encrypted file to <a href={`mailto:${MAIL}`}>{MAIL}</a>, or open a{" "}
      <a href={ADVISORY}>private GitHub report</a>.
    </>,
  ],
  file: "report.txt",
  policy: "Full policy:",
  history: "History",
  events: [
    ["2026-11-01", "This site published."],
    ["2026-10-31", "Current key put into service."],
  ],
  other: { href: "/fr/", lang: "fr", label: "Français" },
};

const FR: Text = {
  lang: "fr",
  path: "/fr/",
  title: "Sécurité de Bonk",
  description:
    "Signaler en privé une faille de Bonk : clé OpenPGP, empreinte et security.txt signé.",
  lead: "Signalez en privé les failles de Bonk, de son site ou de ses dépôts de paquets signés. Chiffrez le rapport avec la clé ci-dessous.",
  key: "Clé",
  labels: ["Identité", "Empreinte", "Algorithmes", "Expiration", "Fichiers"],
  report: "Signaler",
  steps: [
    "1. Récupérez la clé et comparez son empreinte avec celle ci-dessus :",
    "2. Chiffrez le rapport. Joignez votre propre clé publique pour recevoir une réponse chiffrée :",
    <>
      3. Envoyez le fichier chiffré à <a href={`mailto:${MAIL}`}>{MAIL}</a>, ou ouvrez un{" "}
      <a href={ADVISORY}>signalement privé sur GitHub</a>.
    </>,
  ],
  file: "rapport.txt",
  policy: "Politique complète :",
  history: "Historique",
  events: [
    ["2026-11-01", "Publication de ce site."],
    ["2026-10-31", "Mise en service de la clé actuelle."],
  ],
  other: { href: "/", lang: "en", label: "English" },
};

function Page({ text }: { text: Text }) {
  const [identity, fingerprint, algorithms, expires, files] = text.labels;
  return (
    <html lang={text.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{text.title}</title>
        <meta name="description" content={text.description} />
        <link rel="canonical" href={`${SITE}${text.path}`} />
        <link rel="alternate" hrefLang="en" href={`${SITE}/`} />
        <link rel="alternate" hrefLang="fr" href={`${SITE}/fr/`} />
        <link rel="icon" href="/logo.png" />
        <link rel="stylesheet" href="/site.css" />
        <script src="/copy.js" defer />
      </head>
      <body>
        <main>
          <header>
            <h1>{text.title}</h1>
            <p className="lead">{text.lead}</p>
          </header>
          <section>
            <h2>{text.key}</h2>
            <dl>
              <dt>{identity}</dt>
              <dd>{`Bonk Security <${MAIL}>`}</dd>
              <dt>{fingerprint}</dt>
              <dd>
                <code>{FINGERPRINT}</code>
              </dd>
              <dt>{algorithms}</dt>
              <dd>Ed25519, Curve25519</dd>
              <dt>{expires}</dt>
              <dd>2028-10-30</dd>
              <dt>{files}</dt>
              <dd>
                <a href="/security.asc">security.asc</a> ·{" "}
                <a href="/.well-known/security.txt">security.txt</a>
              </dd>
            </dl>
          </section>
          <section>
            <h2>{text.report}</h2>
            <p>{text.steps[0]}</p>
            <pre>
              <code>{`gpg --locate-keys ${MAIL}\ngpg --fingerprint ${MAIL}`}</code>
            </pre>
            <p>{text.steps[1]}</p>
            <pre>
              <code>{`gpg --armor --encrypt --recipient ${MAIL} ${text.file}`}</code>
            </pre>
            <p>{text.steps[2]}</p>
            <p>
              {text.policy} <a href={POLICY}>SECURITY.md</a>.
            </p>
          </section>
          <section>
            <h2>{text.history}</h2>
            <ul>
              {text.events.map(([date, event]) => (
                <li key={date}>{`${date}${text.lang === "fr" ? " : " : ": "}${event}`}</li>
              ))}
            </ul>
          </section>
        </main>
        <footer>
          <p>
            <a href="https://bonk-os.app">bonk-os.app</a> ·{" "}
            <a href="https://packages.bonk-os.app">packages</a> ·{" "}
            <a href="https://github.com/FantasmaGlad/Bonk">GitHub</a> ·{" "}
            <a href={text.other.href} lang={text.other.lang} hrefLang={text.other.lang}>
              {text.other.label}
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}

export const PAGES = [
  { path: "index.html", page: <Page text={EN} /> },
  { path: "fr/index.html", page: <Page text={FR} /> },
];
