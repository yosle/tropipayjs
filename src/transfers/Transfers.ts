import { Tropipay } from "../api/TropipayAPI";
import { API_BASE } from "../constants/TropipayConstants";
import { PayoutPayload, PayoutSimulatePayload } from "../interfaces";
import { handleExceptions } from "../utils/errors";

/**
 * Money transfers (payouts) to beneficiaries. Requires 2FA and the
 * ALLOW_EXTERNAL_TRANSFER permission on the Tropipay account.
 *
 * Typical flow:
 * 1. `simulate(payload)` to preview amounts and fees.
 * 2. `requestSecurityCode()` to receive the 2FA code (SMS/email).
 * 3. `payout({ ...payload, securityCode })` to execute the transfer.
 */
export default class Transfers {
  private tropipay: Tropipay;
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * Simulate a payout without executing it: returns the resulting
   * amounts, rates and fees for the given payload.
   * Note the payload shape differs from `payout()`: it uses
   * `currencyToPay`/`currencyToGet`, `amountToPay`/`amountToGet` and
   * requires `accountId`.
   * @param payload Simulation data (no securityCode needed).
   */
  public async simulate(payload: PayoutSimulatePayload) {
    try {
      const simulation = await this.tropipay.request.post(
        `${API_BASE}/booking/payout/simulate`,
        payload
      );
      return simulation.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * Execute a payout (external transfer) to a beneficiary.
   * Requires the 2FA `securityCode` in the payload (use
   * `requestSecurityCode()` first; in Development mode "123456" works).
   * Supports multi-account via the optional `accountId` field.
   * @param payload Payout data including securityCode.
   */
  public async payout(payload: PayoutPayload) {
    try {
      const booking = await this.tropipay.request.post(
        `${API_BASE}/booking/payout`,
        payload
      );
      return booking.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * Request the 2FA security code needed to confirm a payout.
   * The code is delivered by SMS or email depending on the user's
   * 2FA settings.
   */
  public async requestSecurityCode() {
    try {
      const response = await this.tropipay.request.post(
        `${API_BASE}/booking/sendSecurityCode`,
        {}
      );
      return response.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
}
