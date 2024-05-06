import { Tropipay } from "../api/TropipayAPI";
import { DepositAccountConfig } from "../interfaces/depositaccounts";
export default class DepositAccounts {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    /**
     * List od all beneficiaries of this account
     * @returns Array of DepositAccounts
     */
    list(): Promise<any>;
    /**
     * Adds a new beneficiary to the user account.
     * @param payload
     * @returns
     */
    create(depositAccountObj: DepositAccountConfig): Promise<any>;
    /**
     * This returns details of a specific
     * Deposit Account (beneficiary) specified by its ID
     * @param id
     * @returns
     */
    get(id: string): Promise<any>;
    /**
     * Updates certain beneficiary data.
     * @param depositAccountObj
     * @returns
     */
    update(depositAccountObj: Partial<DepositAccountConfig>): Promise<any>;
    /**
     * (UNTESTED) Deletes the beneficiary indicated by id
     * @param id
     * @returns
     */
    delete(id: number): Promise<any>;
}
