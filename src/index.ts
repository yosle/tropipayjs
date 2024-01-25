/**
 * TropipayJS is a powerful TypeScript/JavaScript library designed to provide seamless interaction
 * with the Tropipay API. It simplifies the process of integrating Tropipay's functionality into
 * your applications.
 *
 * Developed by Yosleivy Baez Acosta
 * GitHub: https://github.com/yosle/tropipayjs
 *
 * @version 0.1.11
 * @license MIT
 */

import { DepositAccounts } from "./depositAccount/depositAccounts";

if (typeof window !== "undefined") {
  console.warn(
    `⚠️ **Warning:** The Tropipay SDK should only be instantiated server-side for security reasons. 
    Using it client-side may lead to unexpected behavior and security vulnerabilities. YOUR CREDENTIALS COULD BE EXPOSED. Check 
    https://yosle.github.io/tropipayjs-docs/guides/installation/ for more details.`
  );
}

export { Tropipay } from "./api/TropipayAPI";
export { ClientSideUtils } from "./api/TropipayAPI";
export { ServerSideUtils } from "./utils/TropipayUtils";
export { TropipayHooks } from "./hooks/TropipayHooks";
export { PaymentCard } from "./paymentcard/PaymentCard";
export { DepositAccounts } from "./depositAccount/depositAccounts";
export * from "./interfaces/index";
export { SERVER_MODE } from "./config/TropipayConfig";
export * from "./constants/TropipayConstants";
