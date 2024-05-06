import { Tropipay } from "../api/TropipayAPI";
import { PaymentLink } from "../interfaces";
import { MediationPaymentCardConfig } from "../interfaces";
import { handleExceptions } from "../utils/errors";

export default class MediationPaymentCard {
  private tropipay: Tropipay;
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * (ONLY FOR BUSINESS ACCOUNTS) Create a mediation paymentcard (an escrow payment link) with the specified options.
   * This allows a payment to be made to persons belonging or not to the TropiPay platform with the
   * particularity that the payment will be held in custody or retained until it is released with
   * the approval of the payer.
   * @param payload PaymentLinkPayload Object.
   * @returns Promise<PaymentLink> or throws an Exception.
   * @see https://tpp.stoplight.io/docs/tropipay-api-doc/12a128ff971e4-creating-a-mediation-payment-card
   */
  async create(payload: MediationPaymentCardConfig): Promise<PaymentLink> {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const paylink = await this.tropipay.request.post(
        "/api/v2/paymentcards/mediation",
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
}
