import { Tropipay } from "../api/TropipayAPI";
import { PaymentLink } from "../interfaces";
import { MediationPaymentCardConfig } from "../interfaces";
export default class MediationPaymentCard {
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
