/**
 * Tropipayjs is a Typescript/Javascript library for the Tropipay API.
 *
 * @author Yosleivy Baez Acosta
 *
 */

import axios, { Axios, AxiosError, AxiosRequestConfig } from "axios";
import {
  TropipayConfig,
  AccountBalance,
  Country,
  PaymentLinkPayload,
  PaymentLink,
  MediationPaymentCardConfig,
  LoginResponse,
  AccountDeposits,
} from "../interfaces";
type ServerMode = "Development" | "Production";
import TropipayHooks from "../hooks/TropipayHooks";
import PaymentCard from "../paymentcard/PaymentCard";
import MediationPaymentCard from "../mediationPaymentCard/MediationPaymentCard";
import DepositAccounts from "../depositAccount/depositAccounts";
import { TropipayJSException, handleExceptions } from "../utils/errors";
export class Tropipay {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly scopes: String[];
  public request: Axios;
  public loginRequest: Axios; 
  public static accessToken: string | null;
  public static refreshToken: string | null;
  public static expiresIn: number | null;
  public serverMode: ServerMode;
  public hooks: TropipayHooks;
  public paymentCards: PaymentCard;
  public depositAccounts: DepositAccounts;
  public mediationPaymentCard: MediationPaymentCard;

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
    : "https://tropipay-dev.herokuapp.com";
    this.request = axios.create({
      baseURL: config.customTropipayUrl || tpp_env,                
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${Tropipay.accessToken}`,
      },
    });

      // Create a separate instance for login requests
      this.loginRequest = axios.create({
        baseURL: config.customTropipayUrl || tpp_env,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
      });

     // Add request interceptor for Token expired
     this.request.interceptors.request.use(
      async (config) => {
        console.log("Executing interceptor!!");
        const currentTimestamp = Math.floor(Date.now() / 1000);
    
        if (Tropipay.expiresIn && Tropipay.expiresIn < currentTimestamp) {
          console.debug("Token expired, attempting to log in");
          try {
            await this.login();
          } catch (error) {
            throw handleExceptions(error as Error);
          }
        }    
        // Update the Authorization header in the config
        config.headers.Authorization = `Bearer ${Tropipay.accessToken}`;    
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    

    this.hooks = new TropipayHooks(this);
    this.paymentCards = new PaymentCard(this);
    this.mediationPaymentCard = new MediationPaymentCard(this);

    this.depositAccounts = new DepositAccounts(this);

    

    
  }

  public async login() {
    try {
     
      // normal credetials login
      const { data } = await this.loginRequest.post<LoginResponse>(
        "/api/v2/access/token",
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
          scope: this.scopes.join(" "), // "ALLOW_GET_PROFILE_DATA ALLOW_PAYMENT_IN ALLOW_EXTERNAL_CHARGE KYC3_FULL_ALLOW ALLOW_PAYMENT_OUT ALLOW_MARKET_PURCHASES ALLOW_GET_BALANCE ALLOW_GET_MOVEMENT_LIST ALLOW_GET_CREDENTIAL",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      
      Tropipay.accessToken = data.access_token;
      Tropipay.expiresIn = data.expires_in;
      return data;
    } catch (error) {

      console.log("RAW login error ", error)
      Tropipay.accessToken = null;
      Tropipay.refreshToken = null;
      Tropipay.expiresIn = null;
      Tropipay.expiresIn = null;
      throw handleExceptions(error as any);
    }
  }

  /**
   * Get the list of all supported countries by Tropipay.
   * @returns Array of Countries Data
   * @see https://tpp.stoplight.io/docs/tropipay-api-doc/bfac21259e2ff-getting-users-countries-list
   */
  async countries(): Promise<Country[]> {
    try {
      const countries = await this.request.get("/api/v2/countries");
      return countries.data;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }
  /**
   * Get user balance
   * @returns balance Object { balance: number, pendingIn: number, pendingOut: number }
   */
  async getBalance(): Promise<AccountBalance> {
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
   * @see https://tpp.stoplight.io/docs/tropipay-api-doc/3cfe5504f0524-getting-list-of-beneficiary-countries
   */
  async destinations(): Promise<Country[]> {
    try {
      const countries = await this.request.get(
        "/api/v2/countries/destinations"
      );
      return countries.data;
    } catch (error) {
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
      const favoritesList = await this.request.get(
        "/api/v2/paymentcards/favorites",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return favoritesList?.data?.rows;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * List all account movements. You can optionaly specify
   * offset and limit params for pagination.
   * @returns
   */
  async movements(offset = 0, limit = 10) {
    if (!Tropipay.accessToken) await this.login();

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
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }

  /**
   * Return profile data for current Tropipay account.
   * @returns account object
   */
  async profile() {
    if (!Tropipay.accessToken) await this.login();
    try {
      const profile = await this.request.get("/api/users/profile");
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
   * @see https://tpp.stoplight.io/docs/tropipay-api-doc/85163f6f28b23-get-rate
   */
  async rates(
    originCurrency: string,
    targetCurrency: string = "EUR"
  ): Promise<number | Error> {
    if (!Tropipay.accessToken) {
      await this.login();
    }
    try {
      const rates = await this.request.post(
        "/api/v2/movements/get_rate",
        {
          currencyFrom: originCurrency,
          currencyTo: targetCurrency,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
          },
        }
      );
      return rates.data.rate;
    } catch (error) {
      throw handleExceptions(error as any);
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
  async createMediationPaymentCard(
    config: MediationPaymentCardConfig
  ): Promise<PaymentLink> {
    if (!Tropipay.accessToken) await this.login();
    try {
      const mediation = await this.request.post(
        "/api/v2/paymentcards/mediation",
        config,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return mediation.data as PaymentLink;
    } catch (error) {
      throw handleExceptions(error as any);
    }
  }
}

export class ClientSideUtils {
  constructor(tropipayInstance: Tropipay) {
    throw Error(`Not implemented yet`);
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
};
