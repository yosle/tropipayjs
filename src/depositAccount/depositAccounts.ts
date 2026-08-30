import { Tropipay } from "../api/TropipayAPI";
import { API_BASE } from "../constants/TropipayConstants";
import { DepositAccountConfig } from "../interfaces/depositaccounts";
import { handleExceptions } from "../utils/errors";
export default class DepositAccounts {
  private tropipay: Tropipay;
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * List od all beneficiaries of this account
   * @returns Array of DepositAccounts
   */
  public async list() {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.get(
        `${API_BASE}/deposit_accounts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return deposit.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
  /**
   * Adds a new beneficiary to the user account.
   * For crypto wallet beneficiaries use `beneficiaryType: 3`, put the
   * wallet address in `accountNumber` and set the `network`.
   * @param payload
   * @returns
   */
  public async create(depositAccountObj: DepositAccountConfig) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.post(
        `${API_BASE}/deposit_accounts`,
        depositAccountObj,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return deposit.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
  /**
   * This returns details of a specific
   * Deposit Account (beneficiary) specified by its ID
   * @param id
   * @returns
   */
  public async get(id: string) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.get(
        `${API_BASE}/deposit_accounts/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return deposit.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * Updates certain beneficiary data.
   * @param depositAccountObj Object with the beneficiary id and the fields to update.
   * @returns
   */
  public async update(depositAccountObj: Partial<DepositAccountConfig>) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.put(
        `${API_BASE}/deposit_accounts`,
        depositAccountObj,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return deposit.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * Deletes the beneficiary indicated by id
   * @param id
   * @returns
   */
  public async delete(id: number) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.delete(
        `${API_BASE}/deposit_accounts/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return deposit.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }

  /**
   * Validates a beneficiary account number (bank account, card or
   * crypto wallet address) before creating it.
   * @param payload Account number data to validate (e.g. { accountNumber, paymentType, network, currency })
   * @returns
   */
  public async validateAccountNumber(payload: Record<string, unknown>) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const validation = await this.tropipay.request.post(
        `${API_BASE}/deposit_accounts/validate_account_number`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return validation.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
}
