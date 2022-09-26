"use strict";
/**
 * Tropipayjs is a wrapper for the Tropipay API. It was made in
 * typescript but you can use Javascript.
 * @author Yosleivy baez Acosta
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Tropipay {
    constructor(client_id, client_secret, server_mode = 'Development') {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.server_mode = server_mode;
        this.request = axios_1.default.create({
            baseURL: this.server_mode === 'Production'
                ? 'https://www.tropipay.com'
                : 'https://tropipay-dev.herokuapp.com',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${this.access_token}`,
            }
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.request.post('/api/v2/access/token', {
                    client_id: this.client_id,
                    client_secret: this.client_secret,
                    grant_type: "client_credentials",
                    scope: "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE KYC3_FULL_ALLOW ALLOW_PAYMENT_OUT ALLOW_MARKET_PURCHASES ALLOW_GET_BALANCE ALLOW_GET_MOVEMENT_LIST ALLOW_GET_CREDENTIAL "
                }, {
                // headers: {
                //     'Content-Type': 'application/json',
                //     Accept: 'application/json',
                // }
                });
                this.access_token = data.access_token;
                this.refresh_token = data.refresh_token;
                return data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    // 👇️ error: AxiosError<any, any>
                    throw new Error("Conection error: " + error.message);
                }
                throw new Error("Could not obtain the access token from credentials ");
            }
        });
    }
    /**
     * Create a paymentLink width the specifued payload
     * @param payload Object of PaymentLinkPayload type with paylink payload
     * @returns Promise<PaymentLink> or Error
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6ODgyNTM3OQ-create-a-new-pay-link-charge
     */
    createPayLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access_token) {
                yield this.login();
            }
            try {
                const paylink = yield this.request.post('/api/v2/paymentcards', payload, {
                    headers: {
                        // 'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.access_token}`,
                        // Accept: 'application/json'
                    }
                });
                return paylink.data;
            }
            catch (error) {
                throw new Error(`Error tryng to get the access token`);
            }
        });
    }
    /**
     * Get all deposits in this account.
     * @returns A Promise of an Array of AccountDeposits or throws an Exception
     * @see https://tpp.stoplight.io/docs/tropipay-api-doc/b3A6OTgyOTQ1Mg-get-deposit-accounts-list
     */
    getDepositAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access_token) {
                yield this.login();
            }
            try {
                const deposits = yield this.request.get('/api/v2/deposit_accounts', {});
                return deposits.data;
            }
            catch (error) {
                throw new Error(`Could not retrieve the account deposits ${error}`);
            }
        });
    }
    /**
     * Get the list of all supported countries by Tropipay.
     * @returns Array of Countries
     * @see
     */
    countries() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access_token) {
                yield this.login();
            }
            try {
                const countries = yield this.request.get('/api/countries');
                return countries.data;
            }
            catch (error) {
                throw new Error(`Could not retrieve the countries list`);
            }
        });
    }
    /**
     * Get list of all the favorites accounts.
     * @returns
     * @see
     */
    favorites() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access_token) {
                yield this.login();
            }
            try {
                const favorites = yield this.request.get('/api/v2/paymentcards/favorites');
                return favorites.data;
            }
            catch (error) {
                throw new Error(`Could not retrieve favorites list`);
            }
        });
    }
    /**
     * List all movements in current account. You can optionaly specify
     *  offset and limit params for pagination.
     * @returns
     */
    movements(offset = 0, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access_token) {
                yield this.login();
            }
            try {
                const movements = yield this.request.get('/api/v2/movements', { params: { limit: limit, offset: offset },
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.access_token}`,
                    } });
                return movements.data;
            }
            catch (error) {
                throw new Error(`Could not retrieve movements list`);
            }
        });
    }
    /**
     * Return profile data for this account.
     * @returns
     */
    profile() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access_token) {
                yield this.login();
            }
            try {
                const profile = yield this.request.get('/api/users/profile');
                return profile.data;
            }
            catch (error) {
                throw new Error(`Could not retrieve movements list ${error}`);
            }
        });
    }
    getRates(payload = { currencyFrom: "EUR" }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(payload);
            if (!this.access_token) {
                yield this.login();
            }
            try {
                const rates = yield this.request.post('/api/v2/movements/get_rate', { payload,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.access_token}`,
                    } });
                return rates.data;
            }
            catch (error) {
                throw new Error(`Could not retrieve rates ${error}`);
            }
        });
    }
}
exports.default = Tropipay;
