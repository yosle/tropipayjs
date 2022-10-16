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
