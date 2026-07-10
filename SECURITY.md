# Supply Chain Security Plan

## 1. Lockfile Integrity
- Always commit `package-lock.json` — it pins exact sub-dependency versions
- Verify integrity: `npm audit signatures` after install (requires npm 9+)

## 2. Automated Scanning
```yaml
# CI steps
- run: npm audit --audit-level=high    # fail on high/critical known CVEs
- run: npx socket-cli scan             # detect protestware, typo-squatting, obfuscation
```
- [Socket.dev](https://socket.dev) — free tier detects behavioral risks (not just CVEs)
- [Snyk](https://snyk.io) — broader CVE coverage, integrates with GitHub

## 3. Dependency Updates
- Enable **Dependabot** or **Renovate** — auto-create PRs for security patches
- Review every new dependency before adding: check downloads, maintenance, publisher

## 4. Overrides for Transitive Dependencies
```json
{
  "overrides": {
    "axios": "1.18.1",
    "semver": "^7.6.0"
  }
}
```
Use `overrides` to force-patch transitive deps when upstream is slow to release.

## 5. Minimal Surface Area
- Fewer dependencies = fewer attack vectors
- Regularly audit with `npm ls --depth=0` and remove unused packages

## 6. SBOM Generation
```bash
npm sbom --sbom-format cyclonedx > sbom.json
```
Generate a Software Bill of Materials for compliance and tracking.

## 7. Package Provenance
- Prefer packages with [provenance attestations](https://docs.npmjs.com/generating-provenance-statements) (npm publish --provenance)
- Check publisher reputation and maintainer count before adding
