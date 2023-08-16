import { Tropipay } from "../api/TropipayAPI";
export declare class ServerSideUtils {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * Verify Topipay's signature on webhooks.
     * @param credentials Credential object or Tropipay instance
     * @param {String} originalCurrencyAmount
     * @param bankOrderCode
     * @param signature
     * @returns {Boolean}
     */
    static verifySignature(credentials: {
        clientId: string;
        clientSecret: string;
    } | Tropipay, originalCurrencyAmount: string, bankOrderCode: string, signature: string): boolean;
}
