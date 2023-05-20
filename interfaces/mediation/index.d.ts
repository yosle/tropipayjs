/**
 *
 */
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
