import { AxiosError } from "axios";
import { Tropipay } from "../api/TropipayAPI";
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
        `/api/v2/deposit_accounts`,
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
      return handleExceptions(error as unknown as any);
    }
  }
  /**
   * Adds a new beneficiary to the user account.
   * @param payload
   * @returns
   */
  public async create(depositAccountObj: DepositAccountConfig) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.post(
        "/api/v2/deposit_accounts",
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
      return handleExceptions(error as unknown as any);
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
        `/api/v2/deposit_accounts/${id}`,
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
      return handleExceptions(error as unknown as any);
    }
  }

  /**
   * Updates certain beneficiary data.
   * @param depositAccountObj
   * @returns
   */
  public async update(depositAccountObj: Partial<DepositAccountConfig>) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.put(
        `/api/v2/deposit_accounts/`,
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
      return handleExceptions(error as unknown as any);
    }
  }

  /**
   * (UNTESTED) Deletes the beneficiary indicated by id
   * @param id
   * @returns
   */
  public async delete(id: number) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const deposit = await this.tropipay.request.delete(
        `/api/v2/deposit_accounts/${id}`,
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
      return handleExceptions(error as unknown as any);
    }
  }
}
