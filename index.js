'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var crypto = require('crypto');
var fs = require('fs/promises');

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
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

function handleExceptions(error) {
    if (error instanceof axios.AxiosError) {
        if (error.response) {
            const axiosResponse = error.response;
            const errorMessage = axiosResponse.data?.error?.message || "An error occurred";
            switch (axiosResponse.status) {
                case 401:
                    return new TropipayJSException(errorMessage, axiosResponse.status, axiosResponse.data.error);
                case 403:
                    return new TropipayJSException(errorMessage, axiosResponse.status, axiosResponse.data.error);
                case 404:
                    return new TropipayJSException(errorMessage, axiosResponse.status, axiosResponse.data.error);
                // case 429:
                //   return new TooManyRequestsException(errorMessage);
                default:
                    return new TropipayJSException(errorMessage, axiosResponse.status, axiosResponse.data.error);
            }
        }
        else if (error.request) {
            // Axios request was made but no response received (e.g., network error)
            return new TropipayJSException("Request failed: No response received", 500, null);
        }
        else {
            // Something else went wrong
            return new TropipayJSException("An error occurred", 500, null);
        }
    }
    else {
        return new TropipayJSException(`jsbfvbsfvbf`, 500, null);
    }
}
class TropipayJSException extends Error {
    code; // Status code
    error;
    message;
    constructor(message, code, data) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, TropipayJSException.prototype);
        this.code = code;
        this.error = data;
        this.message = message;
    }
}

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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
        }
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
        }
    }
}

class DepositAccounts {
    tropipay;
    constructor(tropipayInstance) {
        this.tropipay = tropipayInstance;
    }
    /**
     * List od all beneficiaries of this account
     * @returns Array of DepositAccounts
     */
    async list() {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const deposit = await this.tropipay.request.get(`/api/v2/deposit_accounts`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return deposit.data;
        }
        catch (error) {
            return handleExceptions(error);
        }
    }
    /**
     * Adds a new beneficiary to the user account.
     * @param payload
     * @returns
     */
    async create(depositAccountObj) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const deposit = await this.tropipay.request.post("/api/v2/deposit_accounts", depositAccountObj, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return deposit.data;
        }
        catch (error) {
            return handleExceptions(error);
        }
    }
    /**
     * This returns details of a specific
     * Deposit Account (beneficiary) specified by its ID
     * @param id
     * @returns
     */
    async get(id) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const deposit = await this.tropipay.request.get(`/api/v2/deposit_accounts/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return deposit.data;
        }
        catch (error) {
            return handleExceptions(error);
        }
    }
    /**
     * Updates certain beneficiary data.
     * @param depositAccountObj
     * @returns
     */
    async update(depositAccountObj) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const deposit = await this.tropipay.request.put(`/api/v2/deposit_accounts/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return deposit.data;
        }
        catch (error) {
            return handleExceptions(error);
        }
    }
    /**
     * (UNTESTED) Deletes the beneficiary indicated by id
     * @param id
     * @returns
     */
    async delete(id) {
        if (!Tropipay.accessToken) {
            await this.tropipay.login();
        }
        try {
            const deposit = await this.tropipay.request.delete(`/api/v2/deposit_accounts/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Tropipay.accessToken}`,
                    Accept: "application/json",
                },
            });
            return deposit.data;
        }
        catch (error) {
            return handleExceptions(error);
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
    paymentCards;
    depositAccounts;
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
        this.paymentCards = new PaymentCard(this);
        this.depositAccounts = new DepositAccounts(this);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
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
            throw handleExceptions(error);
        }
    }
}
class ClientSideUtils {
    constructor(tropipayInstance) {
        throw Error(`Not implemented yet`);
    }
}

const MAX_IMAGE_SIZE_MB = 1;

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
            credentials.clientSecret +
            originalCurrencyAmount)
            .digest("hex");
        return localSignature === signature;
    }
    /**
     * Checks if the provided base64 string represents a square image.
     *
     * @param {string} base64String - The base64 string of the image
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the image is square
     */
    static async isBase64ImageSquare(base64String) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // Check if the image has a 1:1 aspect ratio
                const isSquare = img.width === img.height;
                resolve(isSquare);
            };
            img.onerror = (error) => {
                reject(error);
            };
            img.src = base64String;
        });
    }
    /**
     * Takes a local file path and returns a base64 representation of the file content.
     *
     * @param {string} filepath - the path of the file to be converted to base64
     * @return {Promise<string>} a Promise that resolves to the base64 representation of the file content
     */
    static async fileToBase64(filepath) {
        const contents = await fs__default["default"].readFile(filepath);
        let base64content = contents.toString("base64");
        const ext = filepath.split(".").pop();
        return `data:image/${ext};base64,` + base64content;
    }
    /**
     * Get the base64 representation of a remote file from the given URL.
     *
     * @param {string} url - the URL of the file
     * @return {Promise<string>} the base64 representation of the file
     */
    static async getBase64FromFileUrl(url) {
        const response = await axios__default["default"].get(url, {
            responseType: "arraybuffer",
            maxRedirects: 5,
        });
        return Buffer.from(response.data, "binary").toString("base64");
    }
    /**
     * Check if the base64 string represents a valid image and has a valid size
     *
     * @param {string} base64Image - the base64 image to be validated
     * @return {Promise<string>} the valid base64 image
     */
    static isValidImage(base64Image) {
        // Check if the base64 string represents a valid image and has a valid size
        try {
            const isBase64Image = base64Image.startsWith("data:image/");
            if (!isBase64Image) {
                console.error("Not a valid base64 image");
                throw new Error("Not a valid base64 image");
            }
            // TODO: use constants intead of magic numbers here
            const isSizeLessThan2MB = base64Image.length * 0.75 <= MAX_IMAGE_SIZE_MB * 1024 * 1024;
            if (!isSizeLessThan2MB) {
                console.error(`The image should be less than 2mb`);
                throw new Error(`The image should be less than 2mb`);
            }
            // all is fine
            return true;
        }
        catch (error) {
            console.error("Error checking base64 image:", error);
            throw new Error(`Error checking base64 image`);
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
    const err_msg = `⚠️ **Warning:** The Tropipay SDK should only be instantiated server-side for security reasons. Using it client-side may lead to unexpected behavior and security vulnerabilities. YOUR CREDENTIALS COULD BE EXPOSED. Check https://yosle.github.io/tropipayjs-docs/guides/installation/ for more details.`;
    console.error(err_msg);
    throw new Error(err_msg);
}

exports.ClientSideUtils = ClientSideUtils;
exports.DepositAccounts = DepositAccounts;
exports.MAX_IMAGE_SIZE_MB = MAX_IMAGE_SIZE_MB;
exports.PaymentCard = PaymentCard;
exports.SERVER_MODE = SERVER_MODE;
exports.ServerSideUtils = ServerSideUtils;
exports.Tropipay = Tropipay;
exports.TropipayHooks = TropipayHooks;
//# sourceMappingURL=index.js.map
