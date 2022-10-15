/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API. CommonJs and
 * ES6 modules are supported.
 * @author Yosleivy Baez Acosta
 *
 */
import axios from "axios";
export class Tropipay {
    clientId;
    clientSecret;
    request;
    accessToken;
    refreshToken;
    serverMode;
    constructor(client_id, client_secret, server_mode = 'Development') {
        this.clientId = client_id;
        this.clientSecret = client_secret;
        this.serverMode = server_mode;
        this.request = axios.create({
            baseURL: this.serverMode === 'Production'
                ? 'https://www.tropipay.com'
                : 'https://tropipay-dev.herokuapp.com',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${this.accessToken}`,
            }
        });
    }
    async login() {
        try {
            const { data } = await this.request.post('/api/v2/access/token', {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
                scope: "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE KYC3_FULL_ALLOW ALLOW_PAYMENT_OUT ALLOW_MARKET_PURCHASES ALLOW_GET_BALANCE ALLOW_GET_MOVEMENT_LIST ALLOW_GET_CREDENTIAL "
            }, {
            // headers: {
            //     'Content-Type': 'application/json',
            //     Accept: 'application/json',
            // }
            });
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            return data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                // 👇️ error: AxiosError<any, any>
                throw new Error("Conection error: " + error.message);
            }
            throw new Error("Could not obtain the access token from credentials ");
        }
    }
    /**
     * Create a paymentLink with the specified options.
     * @param payload PaymentLinkPayload Object.
     * @returns Promise<PaymentLink> or throws an Exception.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    async createPayLink(payload) {
        if (!this.accessToken) {
            await this.login();
        }
        try {
            const paylink = await this.request.post('/api/v2/paymentcards', payload, {
                headers: {
                    // 'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.accessToken}`,
                    // Accept: 'application/json'
                }
            });
            return paylink.data;
        }
        catch (error) {
            throw new Error(`Could not obtain the access tokemn with the given credentials.`);
        }
    }
    /**
     * Get all deposits in this account.
     * @returns A Promise of an Array of AccountDeposits or throws an Exception
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    async getDepositAccounts() {
        if (!this.accessToken) {
            await this.login();
        }
        try {
            const deposits = await this.request.get('/api/v2/deposit_accounts', {});
            return deposits.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve the account deposits ${error}`);
        }
    }
    /**
     * Get the list of all supported countries by Tropipay.
     * @returns Array of Countries Data
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/bfac21259e2ff-getting-users-countries-list
     */
    async countries() {
        try {
            const countries = await this.request.get('/api/v2/countries');
            return countries.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve the countries list`);
        }
    }
    /**
     * Get the list of all detination countries supported by Tropipay.
     * Obtaining the list of valid countries to send funds to. Useful
     * when adding new beneficiaries to some user.
     *
     * @returns Array of Country Objects
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/3cfe5504f0524-getting-list-of-beneficiary-countries
     */
    async destinations() {
        try {
            const countries = await this.request.get('/api/v2/countries/destinations');
            return countries.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve the destination countries list`);
        }
    }
    /**
     * Get list of all the favorites accounts. This endpoint is not documented
     * in the official Tropipay documentation.
     * @returns
     */
    async favorites() {
        if (!this.accessToken) {
            await this.login();
        }
        try {
            const favoritesList = await this.request.get('/api/v2/paymentcards/favorites');
            console.log(favoritesList);
            return favoritesList.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve favorites list ${error}`);
        }
    }
    /**
     * List all account movements. You can optionaly specify
     * offset and limit params for pagination.
     * @returns
     */
    async movements(offset = 0, limit = 10) {
        if (!this.accessToken) {
            await this.login();
        }
        try {
            const movements = await this.request.get('/api/v2/movements', { params: { limit: limit, offset: offset },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.accessToken}`,
                } });
            return movements.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve movements list`);
        }
    }
    /**
     * Return profile data for this account.
     * @returns
     */
    async profile() {
        if (!this.accessToken) {
            await this.login();
        }
        try {
            const profile = await this.request.get('/api/users/profile');
            return profile.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve movements list ${error}`);
        }
    }
    async getRates(payload = { currencyFrom: "EUR" }) {
        console.log(payload);
        if (!this.accessToken) {
            await this.login();
        }
        try {
            const rates = await this.request.post('/api/v2/movements/get_rate', { payload,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.accessToken}`,
                } });
            return rates.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve rates ${error}`);
        }
    }
}
//# sourceMappingURL=index.js.map