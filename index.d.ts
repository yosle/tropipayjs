/**
 * Tropipayjs is a wrapper for the Tropipay API. It was made in
 * typescript but you can use Javascript.
 * @author Yosleivy baez Acosta
 *
 */
import { Axios } from "axios";
import { PaymentLink, PaymentLinkPayload } from './interfaces/paymentlink';
declare type ServerMode = 'Development' | 'Production';
declare class Tropipay {
    readonly client_id: string;
    readonly client_secret: string;
    request: Axios;
    access_token: string | undefined;
    refresh_token: string | undefined;
    server_mode: ServerMode;
    constructor(client_id: string, client_secret: string, server_mode?: ServerMode);
    login(): Promise<LoginResponse>;
    /**
     * Create a paymentLink width the specifued payload
     * @param payload Object of PaymentLinkPayload type with paylink payload
     * @returns Promise<PaymentLink> or Error
     * @see {https} ://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    createPayLink(payload: PaymentLinkPayload): Promise<PaymentLink>;
    /**
     * Get all deposits in this account.
     * @returns  Promise of AccountDeposits Object or Error
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    getDepositAccounts(): Promise<AccountDeposits[] | Error>;
    /**
     * Get the list of all supported countries.
     * @returns
     * @see
     */
    countries(): Promise<Country[] | Error>;
    /**
     *
     * @returns
     * @see
     */
    favorites(): Promise<any>;
    /**
     * List all movements in current account. You can optionaly specify
     *  offset and limit params for pagination.
     * @returns
     */
    movements(offset?: number, limit?: number): Promise<any>;
    /**
     * Return user profile
     * @returns
     */
    profile(): Promise<any>;
    getRates(payload?: {
        currencyFrom: string;
    }): Promise<any>;
}
export default Tropipay;
