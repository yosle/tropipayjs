import { Axios } from 'axios';

type ServerMode$1 = "Development" | "Production";

type AccountBalance = {
    balance: number;
    pendingIn: number;
    pendingOut: number;
};
interface TropipayConfig {
    clientId: string;
    clientSecret: string;
    serverMode?: ServerMode$1;
}
type TropipayCredentials = {
    clientId: string;
    clientSecret: string;
};
type HookEventType = "transaction_completed" | "transaction_charged" | "transaction_guarded";
type HookTargetType = "web" | "email";
interface UserHook {
    event: HookEventType;
    target: string;
    value: string;
}
interface UserHook {
    event: HookEventType;
    target: string;
    value: string;
}
interface UserHookSubscribed extends UserHook {
    createdAt: string;
    updatedAt: string;
}
interface UserHookSubscribed extends UserHook {
    createdAt: string;
    updatedAt: string;
}
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
type LoginResponse = {
    access_token: string;
    refresh_token: string;
    token_type: "Bearer";
    expires_in: number;
    scope: string;
};
type LoginError = {
    error: string;
};
type Country = {
    id: number;
    name: string;
    sepaZone: boolean;
    state: number;
    slug: string;
    slugn: number;
    callingCode: number;
    isDestination: boolean;
    isRisky: boolean;
    currentCurrency: string | null;
    createdAt: string;
    updatedAt: string;
    isFavorite: boolean;
    position: any;
};
type Deposit = {
    id: number;
    accountNumber: string;
    alias: string;
    swift: string;
    type: number;
    country: number | null;
    firstName: string;
    default: null;
    state: number;
    userId: string;
    countryDestinationId: number;
    lastName: string;
    documentNumber: number;
    userRelationTypeId: number;
    city: string;
    postalCode: string;
    address: string;
    phone: string;
    checked: boolean;
    province: string;
    beneficiaryType: number;
    relatedUserId: null | string;
    currency: string;
    correspondent?: any;
    location: any;
    office: any;
    officeValue: any;
    paymentType: number;
    paymentEntityBeneficiaryId: number;
    paymentEntityAccountId: number;
    verified: any;
    paymentEntityInfo: any;
    documentTypeId: any;
    documentExpirationDate: Date;
    createdAt: Date;
    updatedAt: Date;
    countryDestination: Country;
};
type AccountDeposits = {
    count: number;
    rows: Deposit[];
};

declare class TropipayHooks {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * Subscribe a new hook
     * @param event String that represents the name of the event,
     * you must select from the list of available events, otherwise
     * it will not produce an error but it will not be executed.
     * For get full list of available events see endpoint
     * GET /api/v2/hook/events.
     * @param target String representing the type of event supported.
     * It is currently available: 'web' (allows to receive information in a url),
     * 'email' (allows to receive information in an email address).
     * @param value if the selected 'target' is email the value would be an
     *  email address, likewise if the selected 'target' is 'web' the expected
     *  value corresponds to a url that receives information through the
     * HTTP POST method.
     * @returns
     */
    subscribe({ eventType, target, value, }: {
        eventType: HookEventType;
        target: "email" | "web";
        value: string;
    }): Promise<any>;
    /**
     * Get the sucbcribed hook info by his event type.
     * If no event type is passed, it will return
     * all subscribed hooks or empty Array if none exist.
     * @param eventType or no params for retrieving all hooks
     * @returns All subscribed hooks or empty Array if none exist.
     */
    list(eventType?: HookEventType): Promise<UserHookSubscribed[]>;
    update(eventType: string, target: "web" | "email", value: string): Promise<any>;
    delete(eventType: HookEventType, target: string): Promise<any>;
    events(): Promise<any>;
}

/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API.
 *
 * @author Yosleivy Baez Acosta
 *
 */

type ServerMode = "Development" | "Production";

declare class Tropipay {
    readonly clientId: string;
    readonly clientSecret: string;
    request: Axios;
    static accessToken: string | undefined;
    static refreshToken: string | undefined;
    serverMode: ServerMode;
    hooks: TropipayHooks;
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

declare const SERVER_MODE: ServerMode$1;

export { AccountBalance, AccountDeposits, ClientSideUtils, Country, Deposit, HookEventType, HookTargetType, LoginError, LoginResponse, PaymentLink, PaymentLinkPayload, SERVER_MODE, ServerMode$1 as ServerMode, ServerSideUtils, Tropipay, TropipayConfig, TropipayCredentials, TropipayHooks, UserHook, UserHookSubscribed, mediationPaymentCardConfig };
