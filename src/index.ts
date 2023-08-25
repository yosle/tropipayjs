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
    "DANGER This library should not be used client side, your credentials could be exposed"
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
