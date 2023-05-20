
/**
 * 
 */
export interface mediationPaymentCardConfig {
    amount: number //5000,
    currency: "EUR" | "USD",
    concept: string //Celular,
    description: string,
    reference: string, //458424548,
    singleUse: boolean,
    lang: string// es,
    productUrl?: string,
    buyer: null | any //null,
    seller: {
        sellerId?: number,
        type?: number,
        email?: string
    },
    feePercent?: number,//in cents
    feeFixed?: number,
    sendMail: boolean
}