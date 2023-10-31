import * as crypto from "crypto";
import { Tropipay } from "../api/TropipayAPI";
import { AxiosError, AxiosResponse } from "axios";


export class ServerSideUtils {
  private tropipay: Tropipay;
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * Verify Topipay's signature on webhooks.
   * @param credentials Credential object or Tropipay instance
   * @param {String} originalCurrencyAmount
   * @param bankOrderCode
   * @param signature
   * @returns {Boolean}
   */
  public static verifySignature(
    credentials:
      | {
          clientId: string;
          clientSecret: string;
        }
      | Tropipay,
    originalCurrencyAmount: string,
    bankOrderCode: string,
    signature: string
  ): boolean {
    const localSignature = crypto
      .createHash("sha256")
      .update(
        bankOrderCode +
          credentials.clientId +
          crypto
            .createHash("sha1")
            .update(credentials.clientSecret)
            .digest("hex") +
          originalCurrencyAmount
      )
      .digest("hex");
    return localSignature === signature;
  }
}
