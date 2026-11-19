import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { readKey } from "./key";

const KEY = readKey(readFileSync("public/security.asc", "utf8"));

it("lit la clé publiée comme gpg --show-keys", () => {
  expect(KEY).toEqual({
    fingerprint: "A782 AC57 321A 862C 2ED8 F0FB 34F1 5332 E2A0 7A30",
    identity: "Bonk Security <security@bonk-os.app>",
    algorithms: ["Ed25519", "Curve25519"],
    expires: "2028-10-30",
  });
});

it("security.txt nomme cette clé et expire avant elle", () => {
  const text = readFileSync("public/.well-known/security.txt", "utf8");
  const compact = KEY.fingerprint.replaceAll(" ", "").toLowerCase();
  expect(text).toContain(`openpgp4fpr:${compact}`);
  const expires = text.match(/^Expires: (\d{4}-\d{2}-\d{2})/m)?.[1] ?? "";
  expect(expires <= KEY.expires).toBe(true);
});

it("une clé sans date d'expiration est refusée", () => {
  expect(() => readKey("-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n=AAAA\n")).toThrow();
});
