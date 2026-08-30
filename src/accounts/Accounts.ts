import { Tropipay } from "../api/TropipayAPI";
import { API_BASE } from "../constants/TropipayConstants";
import { Account } from "../interfaces";
import { handleExceptions } from "../utils/errors";

/**
 * Multi-account support. A Tropipay user can hold several accounts
 * (one per currency). Use `list()` to discover the `accountId` values
 * accepted by `paymentCards.create()` and `transfers.payout()`.
 */
export default class Accounts {
  private tropipay: Tropipay;
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * List all the accounts of the current user with their id,
   * accountNumber, currency, balance and enabled payment methods.
   * @param type Optional comma-separated account types filter.
   * @returns Array of Account objects.
   */
  public async list(type?: string): Promise<Account[]> {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const accounts = await this.tropipay.request.get(`${API_BASE}/accounts`, {
        params: type ? { type } : undefined,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Tropipay.accessToken}`,
          Accept: "application/json",
        },
      });
      return accounts.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * Get the balance of every account of the user.
   * @returns Balances for all accounts.
   */
  public async allBalances() {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const balances = await this.tropipay.request.get(
        `${API_BASE}/accounts/allBalance`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return balances.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * Get the balance of one account by its account number
   * (note: accountNumber, not account id — get it from `list()`).
   * @param accountNumber The account number.
   */
  public async balance(accountNumber: string) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const balance = await this.tropipay.request.get(
        `${API_BASE}/accounts/balance/${accountNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return balance.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * List the movements of one account.
   * @param accountId The account id (from `list()`).
   * @param options Pagination: limit (max 50, default 20) and offset.
   */
  public async movements(
    accountId: number,
    options: { limit?: number; offset?: number } = {}
  ) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const movements = await this.tropipay.request.get(
        `${API_BASE}/accounts/${accountId}/movements`,
        {
          params: { limit: options.limit ?? 20, offset: options.offset ?? 0 },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return movements.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
}
