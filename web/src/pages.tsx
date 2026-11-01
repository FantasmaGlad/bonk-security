import type { ReactNode } from "react";

const FINGERPRINT = "A782 AC57 321A 862C 2ED8 F0FB 34F1 5332 E2A0 7A30";
const ADVISORY = "https://github.com/FantasmaGlad/Bonk/security/advisories/new";
const POLICY = "https://github.com/FantasmaGlad/Bonk/blob/main/SECURITY.md";
const MAIL = "security@bonk-os.app";

type Text = {
  lang: "en" | "fr";
  title: string;
  description: string;
  other: { href: string; lang: string; label: string };
  intro: string;
  report: string;
  github: ReactNode;
  mail: string;
  key: string;
  identity: string;
  fingerprint: string;
  expires: string;
  download: ReactNode;
  expect: string;
  delays: string;
  policy: string;
  policyLink: string;
};

const EN: Text = {
  lang: "en",
  title: "Bonk Security",
  description: "How to report a vulnerability in Bonk.",
  other: { href: "/fr/", lang: "fr", label: "Français" },
  intro:
    "Bonk writes to entire disks: a flaw can destroy data. Please report vulnerabilities privately, never in a public issue.",
  report: "Report",
  github: (
    <>
      <a href={ADVISORY}>GitHub private report</a>: only the maintainer can see it.
    </>
  ),
  mail: ": encrypt any exploitable detail with the key below.",
  key: "OpenPGP key",
  identity: "Identity",
  fingerprint: "Fingerprint",
  expires: "Expires",
  download: (
    <>
      Or download <a href="/security.asc">the key</a>. Compare the fingerprint.
    </>
  ),
  expect: "What to expect",
  delays:
    "Acknowledgment within 7 days, first assessment within 30 days, coordinated disclosure with the fix, at most 90 days after the report unless agreed otherwise. These are objectives, not contractual commitments.",
  policy: "Policy",
  policyLink: "Full policy",
};

const FR: Text = {
  lang: "fr",
  title: "Sécurité de Bonk",
  description: "Comment signaler une vulnérabilité dans Bonk.",
  other: { href: "/", lang: "en", label: "English" },
  intro:
    "Bonk écrit sur des disques entiers : une faille peut détruire des données. Signalez les vulnérabilités en privé, jamais dans une issue publique.",
  report: "Signaler",
  github: (
    <>
      <a href={ADVISORY}>Signalement privé GitHub</a> : seul le mainteneur le voit.
    </>
  ),
  mail: " : chiffrez tout détail exploitable avec la clé ci-dessous.",
  key: "Clé OpenPGP",
  identity: "Identité",
  fingerprint: "Empreinte",
  expires: "Expiration",
  download: (
    <>
      Ou téléchargez <a href="/security.asc">la clé</a>. Comparez l'empreinte.
    </>
  ),
  expect: "Ce que vous pouvez attendre",
  delays:
    "Accusé de réception sous 7 jours, première évaluation sous 30 jours, divulgation coordonnée avec le correctif, au plus tard 90 jours après le signalement sauf accord contraire. Ce sont des objectifs, pas des engagements contractuels.",
  policy: "Politique",
  policyLink: "Politique complète",
};

function Page({ text }: { text: Text }) {
  return (
    <html lang={text.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{text.title}</title>
        <meta name="description" content={text.description} />
        <link rel="stylesheet" href="/style.css" />
        <link
          rel="alternate"
          hrefLang={text.other.lang}
          href={`https://security.bonk-os.app${text.other.href}`}
        />
      </head>
      <body>
        <p>
          <a href={text.other.href} lang={text.other.lang}>
            {text.other.label}
          </a>
        </p>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
        <h2>{text.report}</h2>
        <ul>
          <li>{text.github}</li>
          <li>
            <a href={`mailto:${MAIL}`}>{MAIL}</a>
            {text.mail}
          </li>
        </ul>
        <h2>{text.key}</h2>
        <table>
          <tbody>
            <tr>
              <th>{text.identity}</th>
              <td>{`Bonk Security <${MAIL}>`}</td>
            </tr>
            <tr>
              <th>{text.fingerprint}</th>
              <td>
                <code>{FINGERPRINT}</code>
              </td>
            </tr>
            <tr>
              <th>{text.expires}</th>
              <td>2028-10-30</td>
            </tr>
          </tbody>
        </table>
        <p>
          <code>gpg --locate-keys {MAIL}</code>
        </p>
        <p>{text.download}</p>
        <h2>{text.expect}</h2>
        <p>{text.delays}</p>
        <h2>{text.policy}</h2>
        <p>
          <a href={POLICY}>{text.policyLink}</a>
        </p>
      </body>
    </html>
  );
}

export const PAGES = [
  { path: "index.html", page: <Page text={EN} /> },
  { path: "fr/index.html", page: <Page text={FR} /> },
];
