# bonk-security

Source of <https://security.bonk-os.app>, the security disclosure site of [Bonk](https://github.com/FantasmaGlad/Bonk): OpenPGP key and signed `/.well-known/security.txt` (RFC 9116).

## Commands

```bash
cd web
pnpm install
pnpm lint && pnpm test
pnpm build
```

Local preview: `python3 -m http.server 5176 --directory web/dist`.

## Key

- https://security.bonk-os.app/security.asc (Ed25519)
- Fingerprint: `A782 AC57 321A 862C 2ED8 F0FB 34F1 5332 E2A0 7A30`
- The `site` workflow checks the fingerprint and the `security.txt` signature on every pull request.

---

View-only license ([LICENSE](LICENSE)) · Security policy: [SECURITY.md](SECURITY.md)
