import { Tropipay } from "../api/TropipayAPI";
export interface PaymentMethod {
    slug: string;
    name: string;
    enabled: boolean;
    allowedCurrencies: string[];
}
export interface ServiceLimit {
    value: number | null;
    currency: string;
}
export interface ServiceLimits {
    min: ServiceLimit;
    max: ServiceLimit;
}
export interface Service {
    slug: string;
    enabled: boolean;
    allowed_currencies: string[];
    limits: ServiceLimits;
}
export interface TropiCard {
}
export interface Account {
    id: number;
    accountNumber: string;
    userId: string;
    alias: string;
    balance: number;
    pendingIn: number;
    pendingOut: number;
    state: number;
    paymentEntityId: number;
    currency: string;
    type: number;
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
    groupId: number | null;
    TropiCards: TropiCard[];
    services: Service[];
    paymentMethods: PaymentMethod[];
}
export default class Accounts {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * List all accounts of the authenticated user
     * @returns Array of Account objects
     */
    list(): Promise<Account[]>;
}
