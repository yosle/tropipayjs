/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API.
 *
 * @author Yosleivy Baez Acosta
 *
 */
import { Axios } from "axios";
import { TropipayConfig, AccountBalance, Country, PaymentLink, MediationPaymentCardConfig, LoginResponse, RefundResponse } from "../interfaces";
type ServerMode = "Development" | "Production";
import TropipayHooks from "../hooks/TropipayHooks";
import PaymentCard from "../paymentcard/PaymentCard";
import MediationPaymentCard from "../mediationPaymentCard/MediationPaymentCard";
import DepositAccounts from "../depositAccount/depositAccounts";
export declare class Tropipay {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly scopes: String[];
    request: Axios;
    static accessToken: string | null;
    static refreshToken: string | null;
    static expiresIn: number | null;
    serverMode: ServerMode;
    hooks: TropipayHooks;
    paymentCards: PaymentCard;
    depositAccounts: DepositAccounts;
    mediationPaymentCard: MediationPaymentCard;
    /**
     * Initializes a new instance of the Tropipay class.
     *
     * @param {TropipayConfig} config - The configuration object.
     */
    constructor(config: TropipayConfig);
    login(): Promise<LoginResponse>;
    /**
     * Get the list of all supported countries by Tropipay.
     * @returns Array of Countries Data
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/bfac21259e2ff-getting-users-countries-list
     */
    countries(): Promise<Country[]>;
    /**
     * Get user balance
     * @returns balance Object { balance: number, pendingIn: number, pendingOut: number }
     */
    getBalance(): Promise<AccountBalance>;
    /**
     * Get the list of all detination countries supported by Tropipay.
     * Obtaining the list of valid countries to send funds to. Useful
     * when adding new beneficiaries to some user.
     *
     * @returns Array of Country Objects
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/3cfe5504f0524-getting-list-of-beneficiary-countries
     */
    destinations(): Promise<Country[]>;
    /**
     * Get list of all the favorites payment links.
     * @returns Array of account Object or throws an error
     */
    favorites(): Promise<any>;
    /**
     * List all account movements. You can optionaly specify
     * offset and limit params for pagination.
     * @returns
     */
    movements(offset?: number, limit?: number): Promise<any>;
    /**
     * Return profile data for current Tropipay account.
     * @returns account object
     */
    profile(): Promise<any>;
    /**
     * Obtain current Tropipay conversion rate. For example USD to EUR
     * targetCurrency must be 'EUR'
     * @param originCurrency Target currency code supported by Tropipay.
     * @param targetCurrency Must be 'EUR'? (not documented by Tropipay)
     * @returns Conversion rate (number)
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/85163f6f28b23-get-rate
     */
    rates(originCurrency: string, targetCurrency?: string): Promise<number | Error>;
    /**
     * (ONLY in Bussiness Accounts)
     * An escrow payment link. This allows a payment to be made to persons
     * belonging or not to the TropiPay platform with the particularity
     * that the payment will be held in custody or retained until it is
     * released with the approval of the payer.
     * @deprecated This method is no longer supported and may be removed in a future release.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/12a128ff971e4-creating-a-mediation-payment-card
     * @param config Payload with the payment details
     */
    createMediationPaymentCard(config: MediationPaymentCardConfig): Promise<PaymentLink>;
    /**
     * Refund a completed transaction.
     * Requires 2FA enabled and ALLOW_REFUND permission on the Tropipay account.
     *
     * In Development mode, `securityCode` defaults to `"123456"` when omitted.
     * In Production mode, you must first call `requestSecurityCode()` to receive
     * the 2FA code via SMS, then pass it as the `securityCode` parameter.
     *
     * @see https://doc.tropipay.com/docs/api-reference/movements#refund-a-transaction
     * @param orderCode Code of the order/transaction to refund (e.g. "ORD-123456")
     * @param amount Amount to refund in cents (e.g. 5000 = 50.00 USD/EUR)
     * @param securityCode 2FA confirmation code. Use "123456" in Development or
     * the code received via SMS in Production (obtained via requestSecurityCode()).
     */
    refundMovement(orderCode: string, amount: number, securityCode: string): Promise<RefundResponse>;
    /**
     * Request a 2FA security code to be sent via SMS for confirming sensitive
     * operations like refunds.
     *
     * In Production mode, you must call this method first to trigger an SMS with
     * the code, then use the received code when calling `refundMovement()`.
     * In Development mode this is not required as the default code "123456"
     * is used automatically.
     *
     * @see https://doc.tropipay.com/docs/api-reference/movements#refund-a-transaction
     * @returns The API response confirming the code was sent
     */
    requestSecurityCode(type?: "sms" | "email"): Promise<any>;
}
export declare class ClientSideUtils {
    constructor(tropipayInstance: Tropipay);
}
export declare const Scopes: {
    ALLOW_PAYMENT_IN: string;
    ALLOW_EXTERNAL_CHARGE: string;
    KYC3_FULL_ALLOW: string;
    ALLOW_PAYMENT_OUT: string;
    ALLOW_MARKET_PURCHASES: string;
    ALLOW_GET_BALANCE: string;
    ALLOW_GET_MOVEMENT_LIST: string;
    ALLOW_GET_CREDENTIAL: string;
    ALLOW_REFUND: string;
};
export {};
