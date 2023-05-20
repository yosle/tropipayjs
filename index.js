'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API.
 *
 * @author Yosleivy Baez Acosta
 *
 */
class Tropipay {
    clientId;
    clientSecret;
    request;
    static accessToken;
    static refreshToken;
    serverMode;
    constructor(config) {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.serverMode = config.serverMode || 'Development';
        this.request = axios__default["default"].create({
            baseURL: this.serverMode === 'Production'
                ? 'https://www.tropipay.com'
                : 'https://tropipay-dev.herokuapp.com',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${Tropipay.accessToken}`,
            }
        });
    }
    async login() {
        try {
            const { data } = await this.request.post('/api/v2/access/token', {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
                scope: "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE KYC3_FULL_ALLOW ALLOW_PAYMENT_OUT ALLOW_MARKET_PURCHASES ALLOW_GET_BALANCE ALLOW_GET_MOVEMENT_LIST ALLOW_GET_CREDENTIAL"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }
            });
            Tropipay.accessToken = data.access_token;
            Tropipay.refreshToken = data.refresh_token;
            return data;
        }
        catch (error) {
            if (axios__default["default"].isAxiosError(error)) {
                throw new Error(`Could not obtain the access token from credentials  ${error}`);
            }
            throw new Error(`Could not obtain the access token from credentials  ${error}`);
        }
    }
    /**
     * Create a paymentLink with the specified options.
     * @param payload PaymentLinkPayload Object.
     * @returns Promise<PaymentLink> or throws an Exception.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    async createPaymentCard(payload) {
        if (!Tropipay.accessToken) {
            await this.login();
        }
        try {
            const paylink = await this.request.post('/api/v2/paymentcards', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: 'application/json'
                }
            });
            return paylink.data;
        }
        catch (error) {
            throw new Error(`Could not obtain the access token with the given credentials.`);
        }
    }
    /**
     * Get all deposits in this account.
     * @returns A Promise of an Array of AccountDeposits or throws an Exception
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    async getDepositAccounts() {
        if (!Tropipay.accessToken) {
            await this.login();
        }
        try {
            const deposits = await this.request.get('/api/v2/deposit_accounts', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: 'application/json'
                }
            });
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
            throw new Error(`TropipayJS Error - Could not retrieve the countries list`);
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
     * Get list of all the favorites payment links.
     * @returns Array of account Object or throws an error
     */
    async favorites() {
        if (!Tropipay.accessToken) {
            await this.login();
        }
        try {
            const favoritesList = await this.request.get('/api/v2/paymentcards/favorites', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: 'application/json'
                }
            });
            return favoritesList?.data?.rows;
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
        if (!Tropipay.accessToken)
            await this.login();
        try {
            const movements = await this.request.get('/api/v2/movements', {
                params: { limit: limit, offset: offset },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${Tropipay.accessToken}`
                }
            });
            return movements.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve movements list ${error}`);
        }
    }
    /**
     * Return profile data for this account.
     * @returns
     */
    async profile() {
        if (!Tropipay.accessToken)
            await this.login();
        try {
            const profile = await this.request.get('/api/users/profile');
            return profile.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve movements list ${error}`);
        }
    }
    /**
     * Obtain current Tropipay conversion rate. For example USD to EUR
     * targetCurrency must be 'EUR'
     * @param originCurrency Target currency code supported by Tropipay.
     * @param targetCurrency Must be 'EUR'? (not documented by Tropipay)
     * @returns Conversion rate (number)
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/85163f6f28b23-get-rate
     */
    async rates(originCurrency, targetCurrency = 'EUR') {
        if (!Tropipay.accessToken) {
            await this.login();
        }
        try {
            const rates = await this.request.post('/api/v2/movements/get_rate', {
                currencyFrom: originCurrency,
                currencyTo: targetCurrency
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                }
            });
            return rates.data.rate;
        }
        catch (error) {
            throw new Error(`Could not retrieve rates ${error}`);
        }
    }
    /**
     * (ONLY in Bussiness Accounts)
     * An escrow payment link. This allows a payment to be made to persons
     * belonging or not to the TropiPay platform with the particularity
     * that the payment will be held in custody or retained until it is
     * released with the approval of the payer.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/12a128ff971e4-creating-a-mediation-payment-card
     * @param config Payload with the payment details
     */
    async createMediationPaymentCard(config) {
        if (!Tropipay.accessToken)
            await this.login();
        try {
            const mediation = await this.request.post('/api/v2/paymentcards/mediation', config, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: 'application/json'
                }
            });
            return mediation.data;
        }
        catch (error) {
            throw new Error(`Could not generate mediation paymentCard ${error}`);
        }
    }
}

exports.Tropipay = Tropipay;
//# sourceMappingURL=index.js.map
