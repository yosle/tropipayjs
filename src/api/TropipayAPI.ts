/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API.
 *
 * @author Yosleivy Baez Acosta
 *
 */

import axios, { Axios, AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  TropipayConfig,
  AccountBalance,
  Country,
  LoginResponse,
  RefundResponse,
} from "../interfaces";
type ServerMode = "Development" | "Production";
import { API_BASE } from "../constants/TropipayConstants";
import TropipayHooks from "../hooks/TropipayHooks";
import PaymentCard from "../paymentcard/PaymentCard";
import DepositAccounts from "../depositAccount/depositAccounts";
import Accounts from "../accounts/Accounts";
import Transfers from "../transfers/Transfers";
import { TropipayJSException, handleExceptions } from "../utils/errors";

const TOKEN_URL = `${API_BASE}/access/token`;

export class Tropipay {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly scopes: String[];
  public request: Axios;
  // Per instance, so several credentials (or environments) never share a token
  public accessToken: string | null = null;
  public refreshToken: string | null = null;
  public expiresIn: number | null = null;
  public serverMode: ServerMode;
  public hooks: TropipayHooks;
  public paymentCards: PaymentCard;
  public depositAccounts: DepositAccounts;
  public accounts: Accounts;
  public transfers: Transfers;

  /**
   * Initializes a new instance of the Tropipay class.
   *
   * @param {TropipayConfig} config - The configuration object.
   */

  constructor(config: TropipayConfig) {
    // use all scopes if none is passed
    if (!config?.scopes) {
      this.scopes = [
        "ALLOW_GET_PROFILE_DATA",
        "ALLOW_PAYMENT_IN",
        "ALLOW_EXTERNAL_CHARGE",
        "KYC3_FULL_ALLOW",
        "ALLOW_PAYMENT_OUT",
        "ALLOW_MARKET_PURCHASES",
        "ALLOW_GET_BALANCE",
        "ALLOW_GET_MOVEMENT_LIST",
        "ALLOW_GET_CREDENTIAL",
        "ALLOW_REFUND",
      ];
    } else {
      this.scopes = config.scopes;
    }

    if (!config.clientId || !config.clientSecret) {
      throw new TropipayJSException(
        `You must pass clientId and clientSecret in Tropipay constructor`,
        400,
        null
      );
    }

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.serverMode = config.serverMode || "Development";

    const tpp_env = this.serverMode === "Production"
    ? "https://www.tropipay.com"
    : "https://sandbox.tropipay.me";
    this.request = axios.create({
      baseURL: config.customTropipayUrl || tpp_env,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });


     // Log in (or refresh an expired token) and attach the current token to
     // every request. The token endpoint itself is skipped, otherwise login()
     // would re-enter this interceptor forever.
     this.request.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (config.url === TOKEN_URL) return config;

        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        const expired =
          this.expiresIn !== null && this.expiresIn < currentTimestamp;
        if (!this.accessToken || expired) {
          await this.login();
        }

        config.headers.Authorization = `Bearer ${this.accessToken}`;
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.hooks = new TropipayHooks(this);
    this.paymentCards = new PaymentCard(this);
    this.depositAccounts = new DepositAccounts(this);
    this.accounts = new Accounts(this);
    this.transfers = new Transfers(this);
  }

  public async login() {
    try {
      if (this.refreshToken) {
        const { data } = await this.request.post<LoginResponse>(TOKEN_URL, {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
        });

        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.expiresIn = data.expires_in;
        return data;
      }

      // normal credetials login
      const { data } = await this.request.post<LoginResponse>(TOKEN_URL, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
        scope: this.scopes.join(" "), // "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE KYC3_FULL_ALLOW ALLOW_PAYMENT_OUT ALLOW_MARKET_PURCHASES ALLOW_GET_BALANCE ALLOW_GET_MOVEMENT_LIST ALLOW_GET_CREDENTIAL",
      });

      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresIn = data.expires_in;
      return data;
    } catch (error) {
      this.accessToken = null;
      this.refreshToken = null;
      this.expiresIn = null;
      throw handleExceptions(error as any);
    }
  }

  /**
   * Get the list of all supported countries by Tropipay.
   * @returns Array of Countries Data
   * @see https://doc.tropipay.com/docs/api-reference/countries
   */
  async countries(): Promise<Country[]> {
    try {
      const countries = await this.request.get(`${API_BASE}/countries`);
      return countries.data;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }
  /**
   * Get balance of the user's default account.
   * For per-account balances use `accounts.balance()` or
   * `accounts.allBalances()`.
   * @returns balance Object { balance: number, pendingIn: number, pendingOut: number }
   */
  async getBalance(): Promise<AccountBalance> {
    try {
      const balance = await this.request.get(`${API_BASE}/users/balance`);
      return balance.data;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * Get the list of all detination countries supported by Tropipay.
   * Obtaining the list of valid countries to send funds to. Useful
   * when adding new beneficiaries to some user.
   *
   * @returns Array of Country Objects
   * @see https://doc.tropipay.com/docs/api-reference/countries
   */
  async destinations(): Promise<Country[]> {
    try {
      const countries = await this.request.get(
        `${API_BASE}/countries/destinations`
      );
      return countries.data;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * Get list of all the favorites payment links.
   * @returns Array of account Object or throws an error
   */
  async favorites() {
    try {
      const favoritesList = await this.request.get(
        `${API_BASE}/paymentcards/filters`,
        {
          params: { favorite: true },
        }
      );
      return favoritesList?.data?.rows;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * List all account movements. You can optionaly specify
   * offset and limit params for pagination (limit is capped
   * to 50 by the API).
   * For the movements of one specific account use
   * `accounts.movements(accountId)`.
   * @returns
   */
  async movements(offset = 0, limit = 10) {
    try {
      const movements = await this.request.get(`${API_BASE}/movements`, {
        params: { limit: limit, offset: offset },
      });
      return movements.data;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * Return profile data for current Tropipay account.
   * @returns account object
   */
  async profile() {
    try {
      const profile = await this.request.get(`${API_BASE}/users/profile`);
      return profile.data;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * Obtain current Tropipay conversion rate. For example USD to EUR
   * targetCurrency must be 'EUR'
   * @param originCurrency Target currency code supported by Tropipay.
   * @param targetCurrency Must be 'EUR'? (not documented by Tropipay)
   * @returns Conversion rate (number)
   * @see https://doc.tropipay.com/docs/api-reference/movements
   */
  async rates(
    originCurrency: string,
    targetCurrency: string = "EUR"
  ): Promise<number | Error> {
    try {
      const rates = await this.request.post(`${API_BASE}/movements/get_rate`, {
        currencyFrom: originCurrency,
        currencyTo: targetCurrency,
      });
      // the v3 API returns the rate as a numeric string
      return Number(rates.data.rate);
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * Refund a completed transaction.
   * Requires 2FA enabled and ALLOW_REFUND permission on the Tropipay account.
   *
   * In Development mode, `securityCode` defaults to `"123456"` when omitted.
   * In Production mode, you must first call `requestSecurityCode()` to receive
   * the 2FA code via SMS, then pass it as the `securityCode` parameter.
   *
   * @see https://doc.tropipay.com/docs/api-reference/movements#refund-a-transaction
   * @param orderCode Code of the order/transaction to refund (e.g. "ORD-123456")
   * @param amount Amount to refund in cents (e.g. 5000 = 50.00 USD/EUR)
   * @param securityCode 2FA confirmation code. Use "123456" in Development or
   * the code received via SMS in Production (obtained via requestSecurityCode()).
   */
  async refundMovement(
    orderCode: string,
    amount: number,
    securityCode: string
  ): Promise<RefundResponse> {
    if (!this.scopes.includes("ALLOW_REFUND")) {
      throw new TropipayJSException(
        "The credential does not have the ALLOW_REFUND scope required to perform refunds. If you believe your account should have this permission, please contact Tropipay support.",
        403,
        null
      );
    }

    try {
      const response = await this.request.post(
        `${API_BASE}/movements/in/refund`,
        { orderCode, amount, securityCode }
      );
      return response.data as RefundResponse;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * Request a 2FA security code to be sent via SMS for confirming sensitive
   * operations like refunds.
   *
   * In Production mode, you must call this method first to trigger an SMS with
   * the code, then use the received code when calling `refundMovement()`.
   * In Development mode this is not required as the default code "123456"
   * is used automatically.
   *
   * @see https://doc.tropipay.com/docs/api-reference/movements#refund-a-transaction
   * @returns The API response confirming the code was sent
   */
  async requestSecurityCode(type: "sms" | "email" = "sms"): Promise<any> {
    try {
      const response = await this.request.post(
        `${API_BASE}/users/sendSecurityCode`,
        { type }
      );
      return response.data;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

}

export const Scopes = {
  ALLOW_PAYMENT_IN: "ALLOW_PAYMENT_IN",
  ALLOW_EXTERNAL_CHARGE: "ALLOW_EXTERNAL_CHARGE",
  KYC3_FULL_ALLOW: "KYC3_FULL_ALLOW",
  ALLOW_PAYMENT_OUT: "ALLOW_PAYMENT_OUT",
  ALLOW_MARKET_PURCHASES: "ALLOW_MARKET_PURCHASES",
  ALLOW_GET_BALANCE: "ALLOW_GET_BALANCE",
  ALLOW_GET_MOVEMENT_LIST: "ALLOW_GET_MOVEMENT_LIST",
  ALLOW_GET_CREDENTIAL: "ALLOW_GET_CREDENTIAL",
  ALLOW_REFUND: "ALLOW_REFUND",
};
