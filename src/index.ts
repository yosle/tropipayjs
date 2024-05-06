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

if (typeof window !== "undefined") {
  const err_msg = `⚠️ **Warning:** The Tropipay SDK should only be instantiated server-side for security reasons. Using it client-side may lead to unexpected behavior and security vulnerabilities. YOUR CREDENTIALS COULD BE EXPOSED. Check https://yosle.github.io/tropipayjs-docs/guides/installation/ for more details.`;
  console.error(err_msg);
  throw new Error(err_msg);
}

export { Tropipay } from "./api/TropipayAPI";
export { ClientSideUtils } from "./api/TropipayAPI";
export { ServerSideUtils } from "./utils/TropipayUtils";
export * from "./hooks/TropipayHooks";
export * from "./paymentcard/PaymentCard";
export * from "./mediationPaymentCard/MediationPaymentCard";
export * from "./depositAccount/depositAccounts";
export * from "./interfaces/index";
export { SERVER_MODE } from "./config/TropipayConfig";
export * from "./constants/TropipayConstants";
