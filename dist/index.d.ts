/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API. CommonJs and
 * ES6 modules are supported.
 * @author Yosleivy baez Acosta
 *
 */
import { Axios } from "axios";
import { PaymentLink, PaymentLinkPayload } from './interfaces/paymentlink';
declare type ServerMode = 'Development' | 'Production';
export declare class Tropipay {
    readonly client_id: string;
    readonly client_secret: string;
    protected request: Axios;
    protected access_token: string | undefined;
    protected refresh_token: string | undefined;
    protected server_mode: ServerMode;
    constructor(client_id: string, client_secret: string, server_mode?: ServerMode);
    login(): Promise<LoginResponse>;
    /**
     * Create a paymentLink with the specified options.
     * @param payload PaymentLinkPayload Object.
     * @returns Promise<PaymentLink> or throws an Exception.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    createPayLink(payload: PaymentLinkPayload): Promise<PaymentLink>;
    /**
     * Get all deposits in this account.
     * @returns A Promise of an Array of AccountDeposits or throws an Exception
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    getDepositAccounts(): Promise<AccountDeposits[] | Error>;
    /**
     * Get the list of all supported countries by Tropipay.
     * @returns Array of Countries Data
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/bfac21259e2ff-getting-users-countries-list
     */
    countries(): Promise<Country[]>;
    /**
     * Get the list of all detination countries supported by Tropipay.
     * obtaining the list of valid countries to send funds to. Useful
     * when adding new beneficiaries to some user.
     *
     * @returns Array of Country Objects
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/3cfe5504f0524-getting-list-of-beneficiary-countries
     */
    destinations(): Promise<Country[]>;
    /**
     * Get list of all the favorites accounts. This endpoint is not documented
     * in the official Tropipay documentation.
     * @returns
     */
    favorites(): Promise<any>;
    /**
     * List all account movements. You can optionaly specify
     * offset and limit params for pagination.
     * @returns
     */
    movements(offset?: number, limit?: number): Promise<any>;
    /**
     * Return profile data for this account.
     * @returns
     */
    profile(): Promise<any>;
    getRates(payload?: {
        currencyFrom: string;
    }): Promise<any>;
}
export {};
