import { ServerMode } from "../constants/TropipayConstants";
export type AccountBalance = {
    balance: number;
    pendingIn: number;
    pendingOut: number;
};
export interface TropipayConfig {
    clientId: string;
    clientSecret: string;
    serverMode?: ServerMode;
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
export interface PaymentLinkPayload {
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
export interface PaymentLink extends PaymentLinkPayload {
    expirationDate: string;
    hasClient: boolean;
    updatedAt: string;
    createdAt: string;
    qrImage: string;
    shortUrl: string;
    paymentUrl: string;
}
export interface mediationPaymentCardConfig {
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
