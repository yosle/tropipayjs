import { Tropipay } from "../api/TropipayAPI";
import { handleExceptions } from "../utils/errors";

// Account interfaces
export interface PaymentMethod {
  slug: string;
  name: string;
  enabled: boolean;
  allowedCurrencies: string[];
}

export interface ServiceLimit {
  value: number | null;
  currency: string;
}

export interface ServiceLimits {
  min: ServiceLimit;
  max: ServiceLimit;
}

export interface Service {
  slug: string;
  enabled: boolean;
  allowed_currencies: string[];
  limits: ServiceLimits;
}

export interface TropiCard {
  // TropiCard properties can be added here as needed
}

export interface Account {
  id: number;
  accountNumber: string;
  userId: string;
  alias: string;
  balance: number;
  pendingIn: number;
  pendingOut: number;
  state: number;
  paymentEntityId: number;
  currency: string;
  type: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  groupId: number | null;
  TropiCards: TropiCard[];
  services: Service[];
  paymentMethods: PaymentMethod[];
}

export default class Accounts {
  private tropipay: Tropipay;
  
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  /**
   * List all accounts of the authenticated user
   * @returns Array of Account objects
   */
  public async list(): Promise<Account[]> {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    
    try {
      const accounts = await this.tropipay.request.get(
        `/api/v3/accounts/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return accounts.data;
    } catch (error) {
      throw handleExceptions(error as unknown as any);
    }
  }
}
