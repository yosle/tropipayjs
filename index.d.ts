import { Axios } from 'axios';

interface PaymentLinkPayload {
    reference: string;
    concept: string;
    favorite: boolean;
    amount: number;
    currency: string;
    description: string;
    singleUse: boolean;
    reasonId: number;
    expirationDays: number;
    lang: string;
    urlSuccess: string;
    urlFailed: string;
    urlNotification: string;
    serviceDate: string;
    client: {
        name: string;
        lastName: string;
        address: string;
        phone: string;
        email: string;
        countryId: number;
        termsAndConditions: boolean;
    };
    directPayment: boolean;
    paymentMethods?: string[];
}
interface PaymentLink extends PaymentLinkPayload {
    expirationDate: string;
    hasClient: boolean;
    updatedAt: string;
    createdAt: string;
    qrImage: string;
    shortUrl: string;
    paymentUrl: string;
}

/**
 *
 */
interface mediationPaymentCardConfig {
    amount: number;
    currency: "EUR" | "USD";
    concept: string;
    description: string;
    reference: string;
    singleUse: boolean;
    lang: string;
    productUrl?: string;
    buyer: null | any;
    seller: {
        sellerId?: number;
        type?: number;
        email?: string;
    };
    feePercent?: number;
    feeFixed?: number;
    sendMail: boolean;
}

/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API.
 *
 * @author Yosleivy Baez Acosta
 *
 */

type ServerMode = "Development" | "Production";
interface TropipayConfig {
    clientId: string;
    clientSecret: string;
    serverMode?: ServerMode;
}
type AccountBalance = {
    balance: number;
    pendingIn: number;
    pendingOut: number;
};
type HookEventType = "transaction_completed" | "transaction_charged" | "transaction_guarded";
interface UserHook {
    event: HookEventType;
    target: string;
    value: string;
}
interface UserHookSubscribed extends UserHook {
    createdAt: string;
    updatedAt: string;
}
declare class Tropipay {
    readonly clientId: string;
    readonly clientSecret: string;
    protected request: Axios;
    protected static accessToken: string | undefined;
    protected static refreshToken: string | undefined;
    protected serverMode: ServerMode;
    constructor(config: TropipayConfig);
    login(): Promise<LoginResponse>;
    /**
     * Create a paymentLink with the specified options.
     * @param payload PaymentLinkPayload Object.
     * @returns Promise<PaymentLink> or throws an Exception.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    createPaymentCard(payload: PaymentLinkPayload): Promise<PaymentLink>;
    /**
     * Get all deposits in this account.
     * @returns A Promise of an Array of AccountDeposits or throws an Exception
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    getDepositAccounts(): Promise<AccountDeposits[] | Error>;
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
     * Return profile data for this account.
     * @returns
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
    subscribeHook(eventType: HookEventType, target: string, value: string): Promise<void>;
    /**
     * Get hook the sucbcribed hook info by his eventType.
     * If no eventType is passed it will return
     * all subscribed hooks or empty Array if none hooks exist.
     * @param eventType or no params for retrieving all hooks
     * @returns
     */
    getSubscribedHook(eventType?: HookEventType): Promise<UserHookSubscribed[]>;
    updateSubscribedHook(eventType?: string): Promise<void>;
    deleteSubscribedHook(eventType?: string): Promise<void>;
}
declare class ClientSideUtils {
    constructor(tropipayInstance: Tropipay);
}
declare class ServerSideUtils {
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

export { ClientSideUtils, ServerSideUtils, Tropipay };
