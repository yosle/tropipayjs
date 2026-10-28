# Changelog

## 0.3.2 (2026-10-28)

### Security

- `follow-redirects` (pulled in by `axios`) refreshed to 1.16.2 in the
  lockfile, fixing two advisories for 1.16.0 that could leak the
  `Authorization` header on cross-origin redirects: array-form headers
  bypassing credential stripping (GHSA-q3jh-wrc6-jgq8) and unescaped
  `sensitiveHeaders` regex patterns (GHSA-8r9p-f939-6h3c). `axios` still
  declares `^1.16.0`, so fresh installs already resolve the patched release;
  projects whose lockfile pins 1.16.0 should run `npm update follow-redirects`
  or add an `overrides` entry (see `SECURITY.md`).

## 0.3.1 (2026-10-18)

### Security

- `axios` raised to `^1.20.0` (from `^1.18.1`), fixing the advisories
  published for 1.13–1.19: ReDoS when parsing malformed `data:` URLs
  (GHSA-c29m-xwm3-cm6r), ReDoS in `NO_PROXY` handling reachable through
  redirects (GHSA-mghh-pgcx-3jjj), prototype-pollution gadgets in the Node
  HTTP adapter and default instance that could redirect requests or leak the
  `Authorization` header (GHSA-m8m8-qj5v-23w3, GHSA-9fr6-4gfg-395g,
  GHSA-x97p-jq2g-jp4f, GHSA-j8rh-479h-cp32), and HTTP/2 and fetch adapter
  issues. Projects whose lockfile pins an older axios will now resolve the
  patched version.
- Test tooling moved to Jest 30 (`jest`, `babel-jest`, `@types/jest`;
  `ts-jest` 29.4.15) and the lockfile refreshed (`handlebars`, `browserslist`,
  `brace-expansion`, `baseline-browser-mapping`). An `overrides` entry pins
  `js-yaml` 4 under `@istanbuljs/load-nyc-config`, dropping `sprintf-js`, which
  has no patched release. None of these are shipped in the package; `npm audit`
  now reports 0 vulnerabilities.

## 0.3.0 (2026-08-30)

### Breaking: migration to Tropipay API v3

API v2 is deprecated; every SDK endpoint now targets `/api/v3`:

| SDK method | Old route | New route |
| --- | --- | --- |
| `login()` | `POST /api/v2/access/token` | `POST /api/v3/access/token` |
| `countries()` / `destinations()` | `GET /api/v2/countries[/destinations]` | `GET /api/v3/countries[/destinations]` |
| `getBalance()` | `GET /api/v2/users/balance` | `GET /api/v3/users/balance` (default account only) |
| `profile()` | `GET /api/users/profile` | `GET /api/v3/users/profile` |
| `favorites()` | `GET /api/v2/paymentcards/favorites` | `GET /api/v3/paymentcards/filters?favorite=true` |
| `movements()` | `GET /api/v2/movements` | `GET /api/v3/movements` (limit capped to 50) |
| `rates()` | `POST /api/v2/movements/get_rate` | `POST /api/v3/movements/get_rate` |
| `paymentCards.*` | `/api/v2/paymentcards` | `/api/v3/paymentcards` |
| `hooks.*` | `/api/v2/hooks` | `/api/v3/user/hooks` |
| `depositAccounts.*` | `/api/v2/deposit_accounts` | `/api/v3/deposit_accounts` |

### Added

- **`paymentMethods` is now typed** (`PaymentMethod[]`): `"TPP" | "EXT" |
  "CRYPTO" | "WIRE_TRANSFER" | "APPLE_PAY" | "GOOGLE_PAY" | "TPP_GIFTCARD" |
  "TROPICARD"`. CRYPTO is officially supported by the API.
- **`accountId` support (multi-account)** in `PaymentLinkPayload` and payouts.
- **New `accounts` module**: `list()` (discover account ids), `allBalances()`,
  `balance(accountNumber)`, `movements(accountId, {limit, offset})`.
- **New `transfers` module**: `simulate()`, `payout()`, `requestSecurityCode()`
  for external transfers with 2FA.
- `paymentCards.update()` (`PUT /api/v3/paymentcards`).
- `depositAccounts.validateAccountNumber()`.
- Crypto wallet beneficiaries: `beneficiaryType: 3`, `network`
  (`CryptoNetwork` union), wallet address in `accountNumber`.
- New payload fields on payment links: `expirationDate`, `payment3DS`
  (`"default" | "force" | "bypass"`), `strictPostalCodeCheck`,
  `strictAddressCheck`, `paymentcardType`; `currency` now accepts
  `USDC`/`USDT` besides `USD`/`EUR`.
- `Reasons` enum exported for typing `reasonId`.

### Fixed

- `Development` mode now targets the current sandbox,
  `https://sandbox.tropipay.me`, instead of `tropipay-dev.herokuapp.com`.
- `login()` now persists the token when refreshing via `refresh_token`
  (previously the refreshed token was returned but never stored, so the
  expiry interceptor kept working with stale values).
- `depositAccounts.update()` sent the HTTP headers as the request body and
  discarded the payload; it now sends the beneficiary data.
- `depositAccounts` methods now `throw` on error like the rest of the SDK
  instead of returning the error object.
- `ServerSideUtils.isBase64ImageSquare()` used the DOM `Image` API and could
  never work server-side; it now reads PNG/JPEG dimensions from the buffer.
- `MAX_IMAGE_SIZE_MB` raised from 1 to 2, matching the documented limit.

### Removed

- Mediation payment cards (deprecated by Tropipay): the `mediationPaymentCard`
  module (`tpp.mediationPaymentCard.create()`, `POST /paymentcards/mediation`),
  the `MediationPaymentCard` export and the `MediationPaymentCardConfig` type.
- `Tropipay.createMediationPaymentCard()` (deprecated since 0.1.x).
- `ClientSideUtils` (unimplemented stub).
- Dead code: orphan `src/interfaces/paymentlink` and `src/interfaces/mediation`
  trees, duplicated `UserHook` declarations, empty mocks, `globals.d.ts`.
- Build artifacts are no longer committed to the repository (`index.js`,
  `index.d.ts` and friends are generated by `npm run build` and shipped to
  npm via the `files` field).
