import { ServerMode } from "../constants/TropipayConstants";
export type AccountBalance = {
    balance: number;
    pendingIn: number;
    pendingOut: number;
};
export interface TropipayConfig {
    clientId: string;
    clientSecret: string;
    scopes?: string[];
    serverMode?: ServerMode;
    customTropipayUrl?: string;
}
export type TropipayCredentials = {
    clientId: string;
    clientSecret: string;
};
export type HookEventType = "transaction_completed" | "transaction_charged" | "transaction_guarded" | "user_signup" | "user_kyc" | "payment_in_state_change" | "payment_out_state_change" | "beneficiary_added" | "beneficiary_updated" | "beneficiary_deleted" | "transaction_new" | "transaction_preauthorized" | "transaction_pendingin" | "transaction_processing" | "transaction_error" | "transaction_bloqued" | "transaction_guarded_send" | "transaction_guarded_mediation" | "user_after_update" | "user_after_create" | "userDetail_after_create" | "userDetail_after_update" | "tpv_callback_ok" | "fraud_state_on_change";
export type HookTargetType = "web" | "email";
export interface UserHook {
    event: HookEventType;
    target: string;
    value: string;
}
export interface UserHookSubscribed extends UserHook {
    createdAt: string;
    updatedAt: string;
}
export interface UserHook {
    event: HookEventType;
    target: string;
    value: string;
}
export interface UserHookSubscribed extends UserHook {
    createdAt: string;
    updatedAt: string;
}
/**
 * Interface for creating payment links/cards
 * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
 */
export interface PaymentLinkPayload {
    /** Account ID where the funds will be received if compatible */
    accountId?: number;
    /** Reference code for the payment, preferred to be unique */
    reference: string;
    /** Short description of the payment */
    concept: string;
    /** Whether to mark this payment link as favorite */
    favorite: boolean;
    /** Amount to charge in the specified currency */
    amount: number;
    /** Currency code (EUR, USD, etc.) */
    currency: string;
    /** Detailed description of the payment */
    description: string;
    /** If true, the payment link can only be used once */
    singleUse: boolean;
    /** Reason ID for the payment */
    reasonId: number;
    /** Number of days until the payment link expires */
    expirationDays: number;
    /** Language code for the payment page (en, es, etc.) */
    lang: string;
    /** URL to redirect after successful payment */
    urlSuccess: string;
    /** URL to redirect after failed payment */
    urlFailed: string;
    /** Webhook URL for payment notifications */
    urlNotification: string;
    /** Date when the service will be provided (ISO format) */
    serviceDate: string;
    /** Client information for the payment */
    client?: {
        /** Client's first name */
        name?: string;
        /** Client's last name */
        lastName?: string;
        /** Client's address */
        address?: string;
        /** Client's phone number */
        phone?: string;
        /** Client's email address */
        email?: string;
        /** Client's country ID */
        countryId?: number;
        /** Client's country ISO code */
        countryIso?: string;
        /** Client's city */
        city: string;
        /** Client's postal code */
        postCode: string;
        /** Whether client accepted terms and conditions */
        termsAndConditions: boolean;
    } | null;
    /** @deprecated If true, redirects directly to payment page */
    directPayment: boolean;
    /** List of allowed payment methods */
    paymentMethods?: string[];
    /** Base64 encoded image for the payment page */
    imageBase?: string;
    /** Whether to save the payment token for future use */
    saveToken?: boolean;
}
export interface PaymentLink extends PaymentLinkPayload {
    expirationDate: string;
    hasClient: boolean;
    updatedAt: string;
    createdAt: string;
    qrImage: string;
    shortUrl: string;
    paymentUrl: string;
}
export interface MediationPaymentCardConfig {
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
export type LoginResponse = {
    access_token: string;
    refresh_token: string;
    token_type: "Bearer";
    expires_in: number;
    scope: string;
};
export type LoginError = {
    error: string;
};
export type Country = {
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
export type Deposit = {
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
export type AccountDeposits = {
    count: number;
    rows: Deposit[];
};
