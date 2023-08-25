'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var crypto = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var crypto__namespace = /*#__PURE__*/_interopNamespace(crypto);

class TropipayHooks {
    tropipay;
    // ... hook-related functionality ...
    constructor(tropipayInstance) {
        this.tropipay = tropipayInstance;
    }
    /**
     * Subscribe a new hook
     * @param event String that represents the name of the event,
     * you must select from the list of available events, otherwise
     * it will not produce an error but it will not be executed.
     * For get full list of available events see endpoint
     * GET /api/v2/hook/events.
     * @param target String representing the type of event supported.
     * It is currently available: 'web' (allows to receive information in a url),
     * 'email' (allows to receive information in an email address).
     * @param value if the selected 'target' is email the value would be an
     *  email address, likewise if the selected 'target' is 'web' the expected
     *  value corresponds to a url that receives information through the
     * HTTP POST method.
     * @returns
     */
    async subscribe({ eventType, target, value, }) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const hooks = await this.tropipay.request.post(`/api/v2/hooks`, {
                event: eventType,
                target: target,
                value: value,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return hooks.data;
        }
        catch (error) {
            throw new Error(`Could not get subscribe new hook`);
        }
    }
    /**
     * Get the sucbcribed hook info by his event type.
     * If no event type is passed, it will return
     * all subscribed hooks or empty Array if none exist.
     * @param eventType or no params for retrieving all hooks
     * @returns All subscribed hooks or empty Array if none exist.
     */
    async list(eventType) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const hooks = await this.tropipay.request.get(`/api/v2/hooks/${eventType || ""}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return hooks.data;
        }
        catch (error) {
            throw new Error(`Could not get subscribed hooks`);
        }
    }
    async update(eventType, target, value) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const hooks = await this.tropipay.request.put(`/api/v2/hooks`, {
                event: eventType,
                target: target,
                value: value,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return hooks.data;
        }
        catch (error) {
            throw new Error(`Could not update subscribed hooks`);
        }
    }
    async delete(eventType, target) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const hooks = await this.tropipay.request.delete(`/api/v2/hooks/${eventType}/${target}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return hooks.data;
        }
        catch (error) {
            console.trace(error);
            throw new Error(`Could not delete subscribed hooks`);
        }
    }
    async events() {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const hooks = await this.tropipay.request.get(`/api/v2/hooks/events`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return hooks.data;
        }
        catch (error) {
            throw new Error(`Could not get events list for hooks ${error}`);
        }
    }
}

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
    hooks;
    constructor(config) {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.serverMode = config.serverMode || "Development";
        this.request = axios__default["default"].create({
            baseURL: this.serverMode === "Production"
                ? "https://www.tropipay.com"
                : "https://tropipay-dev.herokuapp.com",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${Tropipay.accessToken}`,
            },
        });
        this.hooks = new TropipayHooks(this);
    }
    async login() {
        try {
            const { data } = await this.request.post("/api/v2/access/token", {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
                scope: "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE KYC3_FULL_ALLOW ALLOW_PAYMENT_OUT ALLOW_MARKET_PURCHASES ALLOW_GET_BALANCE ALLOW_GET_MOVEMENT_LIST ALLOW_GET_CREDENTIAL",
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
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
     * Get all deposits in this account.
     * @returns A Promise of an Array of AccountDeposits or throws an Exception
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    async getDepositAccounts() {
        if (!Tropipay.accessToken) {
            await this.login();
        }
        try {
            const deposits = await this.request.get("/api/v2/deposit_accounts", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
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
            const countries = await this.request.get("/api/v2/countries");
            return countries.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve the countries list`);
        }
    }
    /**
     * Get user balance
     * @returns balance Object { balance: number, pendingIn: number, pendingOut: number }
     */
    async getBalance() {
        if (!Tropipay.accessToken) {
            await this.login();
        }
        try {
            const balance = await this.request.get("/api/v2/users/balance", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return balance.data;
        }
        catch (error) {
            throw new Error(`TropipayJS Error - Could not retrieve the user's balance`);
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
            const countries = await this.request.get("/api/v2/countries/destinations");
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
            const favoritesList = await this.request.get("/api/v2/paymentcards/favorites", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
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
            const movements = await this.request.get("/api/v2/movements", {
                params: { limit: limit, offset: offset },
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                },
            });
            return movements.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve movements list ${error}`);
        }
    }
    /**
     * Return profile data for current Tropipay account.
     * @returns account object
     */
    async profile() {
        if (!Tropipay.accessToken)
            await this.login();
        try {
            const profile = await this.request.get("/api/users/profile");
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
    async rates(originCurrency, targetCurrency = "EUR") {
        if (!Tropipay.accessToken) {
            await this.login();
        }
        try {
            const rates = await this.request.post("/api/v2/movements/get_rate", {
                currencyFrom: originCurrency,
                currencyTo: targetCurrency,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                },
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
            const mediation = await this.request.post("/api/v2/paymentcards/mediation", config, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return mediation.data;
        }
        catch (error) {
            throw new Error(`Could not create mediation payment card`);
        }
    }
}
class ClientSideUtils {
    constructor(tropipayInstance) { }
}

class ServerSideUtils {
    tropipay;
    constructor(tropipayInstance) {
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
    static verifySignature(credentials, originalCurrencyAmount, bankOrderCode, signature) {
        const localSignature = crypto__namespace
            .createHash("sha256")
            .update(bankOrderCode +
            credentials.clientId +
            crypto__namespace
                .createHash("sha1")
                .update(credentials.clientSecret)
                .digest("hex") +
            originalCurrencyAmount)
            .digest("hex");
        return localSignature === signature;
    }
}

class PaymentCard {
    tropipay;
    constructor(tropipayInstance) {
        this.tropipay = tropipayInstance;
    }
    /**
     * Create a paymentLink with the specified options.
     * @param payload PaymentLinkPayload Object.
     * @returns Promise<PaymentLink> or throws an Exception.
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    async create(payload) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const paylink = await this.tropipay.request.post("/api/v2/paymentcards", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return paylink.data;
        }
        catch (error) {
            throw new Error(`TropipayJS - Error creating the Payment Card.`);
        }
    }
    /**
     * Shows a list of stored paymentcards created by user.
     * This list includes active and closed paylinks
     * @returns Array of paymentlinks
     */
    async list() {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const paymentcards = await this.tropipay.request.get(`/api/v2/paymentcards`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return paymentcards.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve PaymenCards list`);
        }
    }
    async get(id) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const paymentcard = await this.tropipay.request.get(`/api/v2/paymentcards/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return paymentcard.data;
        }
        catch (error) {
            throw new Error(`Could not retrieve PaymenCards`);
        }
    }
}

const SERVER_MODE = "Development"; // Move the constant here

/**
 * TropipayJS is a powerful TypeScript/JavaScript library designed to provide seamless interaction
 * with the Tropipay API. It simplifies the process of integrating Tropipay's functionality into
 * your applications.
 *
 * Developed by Yosleivy Baez Acosta
 * GitHub: https://github.com/yosle/tropipayjs
 *
 * @version 0.1.11
 * @license MIT
 */
if (typeof window !== "undefined") {
    console.warn("DANGER This library should not be used client side, your credentials could be exposed");
}

exports.ClientSideUtils = ClientSideUtils;
exports.PaymentCard = PaymentCard;
exports.SERVER_MODE = SERVER_MODE;
exports.ServerSideUtils = ServerSideUtils;
exports.Tropipay = Tropipay;
exports.TropipayHooks = TropipayHooks;
//# sourceMappingURL=index.js.map
