import { Axios } from 'axios';

type ServerMode$1 = "Development" | "Production";
declare const MAX_IMAGE_SIZE_MB = 1;

type AccountBalance = {
    balance: number;
    pendingIn: number;
    pendingOut: number;
};
interface TropipayConfig {
    clientId: string;
    clientSecret: string;
    scopes?: string[];
    serverMode?: ServerMode$1;
}
type TropipayCredentials = {
    clientId: string;
    clientSecret: string;
};
type HookEventType = "transaction_completed" | "transaction_charged" | "transaction_guarded" | "user_signup" | "user_kyc" | "payment_in_state_change" | "payment_out_state_change" | "beneficiary_added" | "beneficiary_updated" | "beneficiary_deleted" | "transaction_new" | "transaction_preauthorized" | "transaction_pendingin" | "transaction_processing" | "transaction_error" | "transaction_bloqued" | "transaction_guarded_send" | "transaction_guarded_mediation" | "user_after_update" | "user_after_create" | "userDetail_after_create" | "userDetail_after_update" | "tpv_callback_ok" | "fraud_state_on_change";
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
        countryId?: number;
        countryIso?: string;
        termsAndConditions: boolean;
    } | null;
    directPayment: boolean;
    paymentMethods?: string[];
    imageBase?: string;
    saveToken?: boolean;
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
interface MediationPaymentCardConfig {
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
     * Get the subscribed hook info by his event type.
     * If no event type is passed, it will return
     * all subscribed hooks or empty Array if none exist.
     * @param eventType or no params for retrieving all hooks
     * @returns All subscribed hooks or empty Array if none exist.
     */
    list(eventType?: HookEventType): Promise<UserHookSubscribed[]>;
    update(eventType: HookEventType, target: "web" | "email", value: string): Promise<any>;
    delete(eventType: HookEventType, target: string): Promise<any>;
    events(): Promise<any>;
}

declare class PaymentCard {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * Create a paymentLink with the specified options.
     * @param payload PaymentLinkPayload Object.
     * @returns Promise<PaymentLink> or throws an Exception.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    create(payload: PaymentLinkPayload): Promise<PaymentLink>;
    /**
     * Shows a list of stored paymentcards created by user.
     * This list includes active and closed paylinks
     * @returns Array of paymentlinks
     */
    list(): Promise<any>;
    /**
     * Retrieves a payment card with the specified ID.
     *
     * @param {string} id - The ID of the payment card to retrieve.
     * @return {Promise<any>} A Promise that resolves to the payment card data.
     * @throws {Error} If an error occurs while retrieving the payment card.
     */
    get(id: string): Promise<any>;
    /**
     * Deletes a payment card with the specified ID. Its a LOGIC delete
     * so this will delete the paymentcard from paymentcard list and
     * disable shortUrl but not paymentUrl
     * @param {string} id - The ID of the payment card to delete.
     * @return {Promise<any>} A Promise that resolves to the deleted payment card data.
     * @throws {Error} If an error occurs while deleting the payment card.
     */
    delete(id: string): Promise<any>;
}

declare class MediationPaymentCard {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * (ONLY FOR BUSINESS ACCOUNTS) Create a mediation paymentcard (an escrow payment link) with the specified options.
     * This allows a payment to be made to persons belonging or not to the TropiPay platform with the
     * particularity that the payment will be held in custody or retained until it is released with
     * the approval of the payer.
     * @param payload PaymentLinkPayload Object.
     * @returns Promise<PaymentLink> or throws an Exception.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/12a128ff971e4-creating-a-mediation-payment-card
     */
    create(payload: MediationPaymentCardConfig): Promise<PaymentLink>;
}

interface DepositAccountConfig {
    searchValue?: string;
    alias: string;
    userRelationTypeId: number;
    beneficiaryType: BeneficiaryType;
    searchBy?: number;
    accountNumber?: string;
    swift?: string;
    type: DepositAccountType;
    firstName?: string;
    lastName?: string;
    secondLastName?: string;
    countryDestinationId?: number;
    city?: string;
    postalCode?: number;
    address?: string;
    documentNumber?: string;
    phone?: string;
    province?: string;
    paymentType?: string;
    documentTypeId?: number;
    documentExpirationDate: string;
}
type INTERNAL = 1;
type EXTERNAL = 2;
type BeneficiaryType = INTERNAL | EXTERNAL;
type DepositAccountType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 | 11;

declare class DepositAccounts {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * List od all beneficiaries of this account
     * @returns Array of DepositAccounts
     */
    list(): Promise<any>;
    /**
     * Adds a new beneficiary to the user account.
     * @param payload
     * @returns
     */
    create(depositAccountObj: DepositAccountConfig): Promise<any>;
    /**
     * This returns details of a specific
     * Deposit Account (beneficiary) specified by its ID
     * @param id
     * @returns
     */
    get(id: string): Promise<any>;
    /**
     * Updates certain beneficiary data.
     * @param depositAccountObj
     * @returns
     */
    update(depositAccountObj: Partial<DepositAccountConfig>): Promise<any>;
    /**
     * (UNTESTED) Deletes the beneficiary indicated by id
     * @param id
     * @returns
     */
    delete(id: number): Promise<any>;
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
    readonly scopes: String[];
    request: Axios;
    static accessToken: string | null;
    static refreshToken: string | null;
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
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/12a128ff971e4-creating-a-mediation-payment-card
     * @param config Payload with the payment details
     */
    createMediationPaymentCard(config: MediationPaymentCardConfig): Promise<PaymentLink>;
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
    /**
     * Checks if the provided base64 string represents a square image.
     *
     * @param {string} base64String - The base64 string of the image
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the image is square
     */
    static isBase64ImageSquare(base64String: string): Promise<boolean>;
    /**
     * Takes a local file path and returns a base64 representation of the file content.
     *
     * @param {string} filepath - the path of the file to be converted to base64
     * @return {Promise<string>} a Promise that resolves to the base64 representation of the file content
     */
    static fileToBase64(filepath: string): Promise<string>;
    /**
     * Get the base64 representation of a remote file from the given URL.
     *
     * @param {string} url - the URL of the file
     * @return {Promise<string>} the base64 representation of the file
     */
    static getBase64FromFileUrl(url: string): Promise<string>;
    /**
     * Check if the base64 string represents a valid image and has a valid size
     *
     * @param {string} base64Image - the base64 image to be validated
     * @return {Promise<string>} the valid base64 image
     */
    static isValidImage(base64Image: string): boolean;
}

declare const SERVER_MODE: ServerMode$1;

export { AccountBalance, AccountDeposits, ClientSideUtils, Country, Deposit, HookEventType, HookTargetType, LoginError, LoginResponse, MAX_IMAGE_SIZE_MB, MediationPaymentCardConfig, PaymentLink, PaymentLinkPayload, SERVER_MODE, ServerMode$1 as ServerMode, ServerSideUtils, Tropipay, TropipayConfig, TropipayCredentials, UserHook, UserHookSubscribed };
