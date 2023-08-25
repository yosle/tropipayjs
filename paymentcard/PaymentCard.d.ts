import { Tropipay } from "../api/TropipayAPI";
import { PaymentLink } from "../interfaces";
import { PaymentLinkPayload } from "../interfaces";
export declare class PaymentCard {
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
    get(id: string): Promise<any>;
}
