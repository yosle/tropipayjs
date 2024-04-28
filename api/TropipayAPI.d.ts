/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API.
 *
 * @author Yosleivy Baez Acosta
 *
 */
import { Axios } from "axios";
import { TropipayConfig, AccountBalance, Country, PaymentLink, mediationPaymentCardConfig, LoginResponse } from "../interfaces";
type ServerMode = "Development" | "Production";
import { TropipayHooks } from "../hooks/TropipayHooks";
import { PaymentCard } from "../paymentcard/PaymentCard";
import { DepositAccounts } from "../depositAccount/depositAccounts";
export declare class Tropipay {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly scopes: String[];
    request: Axios;
    static accessToken: string | null;
    static refreshToken: string | null;
    serverMode: ServerMode;
    hooks: TropipayHooks;
    paymentCards: PaymentCard;
    depositAccounts: DepositAccounts;
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
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/12a128ff971e4-creating-a-mediation-payment-card
     * @param config Payload with the payment details
     */
    createMediationPaymentCard(config: mediationPaymentCardConfig): Promise<PaymentLink>;
}
export declare class ClientSideUtils {
    constructor(tropipayInstance: Tropipay);
}
export {};
