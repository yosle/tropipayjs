import { Tropipay } from "../api/TropipayAPI";
import { PaymentLink } from "../interfaces";
import { PaymentLinkPayload } from "../interfaces";
import { handleExceptions } from "../utils/errors";
export class PaymentCard {
  private tropipay: Tropipay;
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * Create a paymentLink with the specified options.
   * @param payload PaymentLinkPayload Object.
   * @returns Promise<PaymentLink> or throws an Exception.
   * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
   */
  async create(payload: PaymentLinkPayload): Promise<PaymentLink> {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const paylink = await this.tropipay.request.post(
        "/api/v2/paymentcards",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return paylink.data as PaymentLink;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
  /**
   * Shows a list of stored paymentcards created by user.
   * This list includes active and closed paylinks
   * @returns Array of paymentlinks
   */
  public async list() {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const paymentcards = await this.tropipay.request.get(
        `/api/v2/paymentcards`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return paymentcards.data;
    } catch (error) {
      throw new Error(`Could not retrieve PaymenCards list`);
    }
  }

  public async get(id: string) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const paymentcard = await this.tropipay.request.get(
        `/api/v2/paymentcards/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return paymentcard.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
}
