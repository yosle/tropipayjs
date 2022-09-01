"use strict";
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
    constructor(c_id, c_secret, env = 'development') {
        this.client_id = c_id;
        this.client_secret = c_secret;
        this.enviroment = env;
        this.request = axios_1.default.create({
            baseURL: this.enviroment === 'production'
                ? 'https://www.tropipay.com'
                : 'https://tropipay-dev.herokuapp.com',
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.request.post('/api/v2/access/token', {
                    client_id: this.client_id,
                    client_secret: this.client_secret,
                    grant_type: "client_credentials",
                    scope: "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE"
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    }
                });
                this.access_token = data.access_token;
                this.refresh_token = data.refresh_token;
                return data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    // 👇️ error: AxiosError<any, any>
                    throw new Error("Conection error: " + error.message);
                }
            }
        });
    }
    createPayLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.access_token == undefined) {
                yield this.login();
            }
            try {
                const paylink = yield this.request.post('/api/v2/paymentcards', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.access_token}`,
                        Accept: 'application/json'
                    }
                });
                return paylink.data;
            }
            catch (error) {
                throw new Error(`Error`);
            }
        });
    }
}
exports.default = Tropipay;
