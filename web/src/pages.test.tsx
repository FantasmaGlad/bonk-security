import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { PAGES } from "./pages";

it("donne les deux langues, la clé et les commandes", () => {
  const html = PAGES.map(({ page }) => renderToStaticMarkup(page));
  expect(PAGES.map(({ path }) => path)).toEqual(["index.html", "fr/index.html"]);
  for (const page of html) {
    expect(page).toContain("A782 AC57 321A 862C 2ED8 F0FB 34F1 5332 E2A0 7A30");
    expect(page).toContain("security/advisories/new");
    expect(page).toContain("gpg --locate-keys security@bonk-os.app");
    expect(page).toContain('href="/site.css"');
    expect(page).not.toContain("<style");
  }
  expect(html[1]).toContain('lang="fr"');
});

it("ne charge que le bouton copier, facultatif", () => {
  for (const { page } of PAGES) {
    const scripts = renderToStaticMarkup(page).match(/<script[^>]*>/g) ?? [];
    expect(scripts).toEqual(['<script src="/copy.js" defer="">']);
  }
});
