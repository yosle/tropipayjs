import { Tropipay } from "../api/TropipayAPI";
import { PaymentLink } from "../interfaces";
import { PaymentLinkPayload } from "../interfaces";
export default class PaymentCard {
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
