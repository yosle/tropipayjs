/**
 * Smoke test for the v3 migration of tropipayjs.
 *
 * Runs against the real Tropipay API using the BUILT bundle (index.js),
 * so run `npm run build` first (npm run smoke does it for you).
 *
 * Usage (PowerShell):
 *   $env:TROPIPAY_CLIENT_ID = "..."; $env:TROPIPAY_CLIENT_SECRET = "..."
 *   npm run smoke
 *
 * Usage (bash):
 *   TROPIPAY_CLIENT_ID=... TROPIPAY_CLIENT_SECRET=... npm run smoke
 *
 * Optional env vars:
 *   TROPIPAY_SERVER_MODE  "Development" (default, tropipay-dev.herokuapp.com)
 *                         or "Production" (www.tropipay.com)
 *   TROPIPAY_CUSTOM_URL   override the base URL entirely
 *   SMOKE_ALLOW_WRITE     set to "1" to run write steps (create/update/delete
 *                         a test paylink) in Production. In Development the
 *                         write steps always run. No step ever moves money:
 *                         payouts are only simulated, never executed.
 */

/* eslint-disable no-console */
const { Tropipay } = require("../index.js");

const clientId = process.env.TROPIPAY_CLIENT_ID;
const clientSecret = process.env.TROPIPAY_CLIENT_SECRET;
const serverMode = process.env.TROPIPAY_SERVER_MODE || "Development";
const customTropipayUrl = process.env.TROPIPAY_CUSTOM_URL || undefined;

if (!clientId || !clientSecret) {
  console.error(
    "\n✖ Missing credentials. Set TROPIPAY_CLIENT_ID and TROPIPAY_CLIENT_SECRET env vars.\n" +
      "  Get them at App Menu -> Applications and credentials (use the dev\n" +
      "  environment https://tropipay-dev.herokuapp.com for Development mode).\n"
  );
  process.exit(2);
}

const allowWrite =
  serverMode !== "Production" || process.env.SMOKE_ALLOW_WRITE === "1";

const results = [];

async function step(name, { critical = false, skip = false } = {}, fn) {
  if (skip) {
    results.push({ name, status: "SKIP" });
    console.log(`- SKIP  ${name}`);
    return undefined;
  }
  try {
    const value = await fn();
    results.push({ name, status: "PASS" });
    console.log(`✔ PASS  ${name}`);
    return value;
  } catch (error) {
    const detail =
      (error && (error.error?.message || error.message)) || String(error);
    const code = error && error.code ? ` [HTTP ${error.code}]` : "";
    results.push({ name, status: "FAIL", detail: `${detail}${code}`, critical });
    console.error(`✖ FAIL  ${name}${code}: ${detail}`);
    return undefined;
  }
}

async function main() {
  console.log(`\nTropipayJS v3 smoke test`);
  console.log(`  serverMode : ${serverMode}`);
  console.log(`  baseURL    : ${customTropipayUrl || "(default for mode)"}`);
  console.log(`  write steps: ${allowWrite ? "enabled" : "disabled (set SMOKE_ALLOW_WRITE=1)"}\n`);

  const tpp = new Tropipay({
    clientId,
    clientSecret,
    serverMode,
    customTropipayUrl,
  });

  // --- Core: auth ---------------------------------------------------------
  const login = await step("login (POST /api/v3/access/token)", { critical: true }, async () => {
    const data = await tpp.login();
    if (!data?.access_token) throw new Error("no access_token in response");
    return data;
  });
  if (!login) return finish(); // nothing else can work without a token

  // --- Read-only endpoints ------------------------------------------------
  await step("profile (GET /api/v3/users/profile)", {}, async () => {
    const profile = await tpp.profile();
    if (!profile) throw new Error("empty profile");
    console.log(`        user: ${profile.email || profile.id || "(no email field)"}`);
  });

  const accounts = await step("accounts.list (GET /api/v3/accounts)", { critical: true }, async () => {
    const list = await tpp.accounts.list();
    const rows = Array.isArray(list) ? list : list?.rows;
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("no accounts returned");
    }
    for (const a of rows) {
      console.log(
        `        accountId=${a.id} ${a.currency} balance=${a.balance} state=${a.state}`
      );
    }
    return rows;
  });
  // Pick an ACTIVE (state=1) EUR account for the write steps — the backend
  // rejects paylinks on inactive accounts with ACCOUNT_NOT_FOUND.
  const activeAccount =
    accounts?.find((a) => a.state === 1 && a.currency === "EUR") ||
    accounts?.find((a) => a.state === 1) ||
    accounts?.[0];
  const accountId = activeAccount?.id;

  await step("getBalance (GET /api/v3/users/balance)", {}, async () => {
    const balance = await tpp.getBalance();
    console.log(`        balance=${JSON.stringify(balance)}`);
  });

  await step("accounts.allBalances (GET /api/v3/accounts/allBalance)", {}, () =>
    tpp.accounts.allBalances()
  );

  await step("countries (GET /api/v3/countries)", {}, async () => {
    const countries = await tpp.countries();
    if (!Array.isArray(countries) || countries.length === 0)
      throw new Error("empty countries list");
  });

  await step("destinations (GET /api/v3/countries/destinations)", {}, async () => {
    const destinations = await tpp.destinations();
    if (!Array.isArray(destinations) || destinations.length === 0)
      throw new Error("empty destinations list");
  });

  await step("rates USD->EUR (POST /api/v3/movements/get_rate)", {}, async () => {
    const rate = await tpp.rates("USD", "EUR");
    // the API returns the rate as a numeric string
    if (Number.isNaN(Number(rate))) throw new Error(`unexpected rate: ${rate}`);
    console.log(`        rate=${rate}`);
  });

  await step("movements (GET /api/v3/movements)", {}, () => tpp.movements(0, 5));

  await step(
    "accounts.movements (GET /api/v3/accounts/:id/movements)",
    { skip: !accountId },
    () => tpp.accounts.movements(accountId, { limit: 5 })
  );

  await step("favorites (GET /api/v3/paymentcards/filters?favorite=true)", {}, () =>
    tpp.favorites()
  );

  await step("hooks.events (GET /api/v3/user/hooks/events)", {}, () => tpp.hooks.events());
  await step("hooks.list (GET /api/v3/user/hooks)", {}, () => tpp.hooks.list());

  await step("depositAccounts.list (GET /api/v3/deposit_accounts)", {}, () =>
    tpp.depositAccounts.list()
  );

  await step("paymentCards.list (GET /api/v3/paymentcards)", {}, () =>
    tpp.paymentCards.list()
  );

  // --- Write steps: create -> get -> update -> delete a test paylink ------
  let createdId;
  const created = await step(
    "paymentCards.create with accountId + CRYPTO (POST /api/v3/paymentcards)",
    { critical: true, skip: !allowWrite },
    async () => {
      const paylink = await tpp.paymentCards.create({
        reference: `smoke-${Date.now()}`,
        concept: "SDK v3 smoke test",
        description: "Temporary paylink created by tropipayjs smoke test",
        favorite: false,
        amount: 150,
        currency: "EUR",
        singleUse: false,
        reasonId: 4,
        expirationDays: 1,
        lang: "es",
        urlSuccess: "https://example.com/success",
        urlFailed: "https://example.com/failed",
        urlNotification: "https://example.com/notify",
        serviceDate: "",
        client: null,
        directPayment: false,
        paymentMethods: ["EXT", "TPP", "CRYPTO"],
        ...(accountId ? { accountId } : {}),
      });
      if (!paylink?.id) throw new Error("no id in created paylink");
      createdId = paylink.id;
      console.log(`        id=${paylink.id}`);
      console.log(`        shortUrl=${paylink.shortUrl}`);
      // What survived the server-side intersection with the account's
      // active methods — tells you whether CRYPTO is enabled on the account.
      console.log(
        `        effective paymentMethods=${JSON.stringify(paylink.paymentMethods ?? "(not returned)")}`
      );
      return paylink;
    }
  );

  await step(
    "paymentCards.get (GET /api/v3/paymentcards/:id)",
    { skip: !createdId },
    () => tpp.paymentCards.get(createdId)
  );

  await step(
    "paymentCards.update favorite=true (PUT /api/v3/paymentcards)",
    { skip: !createdId },
    () => tpp.paymentCards.update({ cardId: createdId, favorite: true })
  );

  await step(
    "paymentCards.delete cleanup (DELETE /api/v3/paymentcards)",
    { skip: !createdId },
    () => tpp.paymentCards.delete(createdId)
  );

  // --- Transfers: simulation only (never executes a payout) ---------------
  await step(
    "transfers.simulate (POST /api/v3/booking/payout/simulate)",
    { skip: !allowWrite },
    async () => {
      const deposits = await tpp.depositAccounts.list();
      const rows = Array.isArray(deposits) ? deposits : deposits?.rows;
      const beneficiary = rows?.[0];
      if (!beneficiary) {
        console.log("        (no beneficiaries on the account, nothing to simulate)");
        return;
      }
      // the simulate endpoint uses its own shape: accountId (required),
      // currencyToPay/currencyToGet and amountToPay/amountToGet.
      const simulation = await tpp.transfers.simulate({
        accountId,
        currencyToPay: activeAccount?.currency || "EUR",
        amountToPay: 1000, // the API enforces a minimum (800 cents in sandbox)
        depositaccountId: beneficiary.id,
      });
      console.log(`        simulation=${JSON.stringify(simulation).slice(0, 200)}`);
    }
  );

  return finish(created);
}

function finish() {
  const pass = results.filter((r) => r.status === "PASS").length;
  const fail = results.filter((r) => r.status === "FAIL");
  const skip = results.filter((r) => r.status === "SKIP").length;

  console.log(`\n──────────────────────────────────────────`);
  console.log(`  ${pass} passed, ${fail.length} failed, ${skip} skipped`);
  if (fail.length) {
    console.log(`\n  Failures:`);
    for (const f of fail) console.log(`   - ${f.name}: ${f.detail}`);
  }
  console.log(`──────────────────────────────────────────\n`);

  const criticalFailed = fail.some((f) => f.critical);
  process.exit(criticalFailed ? 1 : 0);
}

main().catch((error) => {
  console.error("\nUnexpected error running smoke test:", error);
  process.exit(1);
});
