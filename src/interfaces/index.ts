import { ServerMode } from "../constants/TropipayConstants";

export type AccountBalance = {
  balance: number;
  pendingIn: number;
  pendingOut: number;
};

export interface TropipayConfig {
  clientId: string;
  clientSecret: string;
  scopes?: string[];
  serverMode?: ServerMode;
  // Custom tropipay environment for testing
  customTropipayUrl?: string;
}

export type TropipayCredentials = { clientId: string; clientSecret: string };
export type HookEventType =
  | "transaction_completed"
  | "transaction_charged"
  | "transaction_guarded"
  | "user_signup"
  | "user_kyc"
  | "payment_in_state_change"
  | "payment_out_state_change"
  | "beneficiary_added"
  | "beneficiary_updated"
  | "beneficiary_deleted"
  | "transaction_new"
  | "transaction_preauthorized"
  | "transaction_pendingin"
  | "transaction_processing"
  | "transaction_error"
  | "transaction_bloqued"
  | "transaction_guarded_send"
  | "transaction_guarded_mediation"
  | "user_after_update"
  | "user_after_create"
  | "userDetail_after_create"
  | "userDetail_after_update"
  | "tpv_callback_ok"
  | "fraud_state_on_change";

export type HookTargetType = "web" | "email";
export interface UserHook {
  event: HookEventType;
  target: string;
  value: string;
}
export interface UserHookSubscribed extends UserHook {
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment methods accepted by the Tropipay API for payment links
 * (`paymentMethods` field of a paymentcard).
 *
 * - `TPP`: pay with Tropipay balance.
 * - `EXT`: external credit/debit card.
 * - `CRYPTO`: pay with cryptocurrency.
 * - `WIRE_TRANSFER`: bank wire transfer.
 * - `APPLE_PAY` / `GOOGLE_PAY`: wallet payments. The server adds them
 *   automatically when `EXT` is present, so they rarely need to be sent.
 * - `TPP_GIFTCARD`: Tropipay gift card.
 * - `TROPICARD`: Tropicard.
 */
export type PaymentMethod =
  | "TPP"
  | "EXT"
  | "CRYPTO"
  | "WIRE_TRANSFER"
  | "APPLE_PAY"
  | "GOOGLE_PAY"
  | "TPP_GIFTCARD"
  | "TROPICARD";

/**
 * Payment reasons accepted in the `reasonId` field.
 */
export enum Reasons {
  HOUSING_ARRANGEMENT = 1,
  FINANCIAL_AID = 2,
  FAMILY_SUPPORT = 3,
  TRAVEL_FUND = 4,
  REAL_ESTATE_PURCHASE = 5,
  FURNITURE_PURCHASE = 6,
  EDUCATION = 7,
  MEDICAL_EXPENSES = 8,
  OTHER = 9,
  DEBT_PAYMENT = 10,
  TOURISM = 11,
  SELF_SHIPPING = 12,
  ACCOUNT_ACTIVATION = 13,
  SPORTS_ACTIVITIES = 14,
  DONATION = 15,
  AFFILIATE_COMMISSION = 16,
  SALARY = 17,
  SAVINGS = 18,
  RENT_AND_LEASING = 19,
  SHARED_EXPENSES = 20,
  SERVICE_PAYMENT = 21,
  GIFT = 22,
  CRYPTOCURRENCY_PURCHASE = 23,
  OPERATING_EXPENSES = 24,
  CURRENCY_EXCHANGE = 25,
  ACCOMMODATION = 26,
  EQUIPMENT_PURCHASE = 27,
  CONSULTING = 28,
  SOFTWARE_DEVELOPMENT = 29,
  REFUND = 30,
  PACKAGE_DELIVERY = 31,
  PERSONAL_EXPENSES = 32,
  INVESTMENT = 33,
  BILL_PAYMENT = 34,
  HOST_PAYMENT = 35,
  TRANSPORTATION = 36,
  LOAN = 37,
  BONUS = 38,
  HALLOWEEN_REMITTANCE = 39,
  PLINK_REMITTANCE = 41,
  R1_2023 = 78,
  HAPPYWEEK = 79,
  SENDING_YOU_A_KISS = 80,
}

/**
 * Currencies accepted when creating a payment link (API v3).
 */
export type PaymentLinkCurrency = "USD" | "EUR" | "USDC" | "USDT";

export interface PaymentLinkPayload {
  reference: string;
  concept: string;
  favorite: boolean;
  /** Amount in cents (minimum 100). */
  amount: number;
  currency: PaymentLinkCurrency;
  description: string;
  singleUse: boolean;
  reasonId: number;
  expirationDays: number;
  lang: string;
  urlSuccess: string;
  urlFailed: string;
  urlNotification: string;
  serviceDate: string;
  client?: {
    name?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    email?: string;
    countryId?: number;
    countryIso?: string;
    city: string;
    postCode: string;
    termsAndConditions: boolean;
  } | null;
  directPayment: boolean;
  /**
   * Payment methods to offer on the payment page.
   * If omitted the server defaults to `["EXT", "TPP", "WIRE_TRANSFER"]`.
   * `APPLE_PAY`/`GOOGLE_PAY` are injected automatically when `EXT` is
   * included. The server intersects this list with the methods enabled
   * for the account, so a requested method (e.g. `CRYPTO`) only shows
   * up if the account has it active.
   */
  paymentMethods?: PaymentMethod[];
  imageBase?: string;
  saveToken?: boolean;
  /**
   * Account that will receive the payment (multi-account support).
   * Must belong to the authenticated user, otherwise the API responds
   * with ACCOUNT_NOT_FOUND. Defaults to the user's default account.
   */
  accountId?: number;
  /** Absolute expiration timestamp (ISO 8601). Alternative to expirationDays. */
  expirationDate?: string;
  /**
   * 3D-Secure behavior: "default" lets Tropipay decide, "force" always
   * requires 3DS, "bypass" skips it (needs the SKIP_3DS_VERIFICATION_MARKETPLACE
   * setting enabled on the account, otherwise falls back to "default").
   */
  payment3DS?: "default" | "force" | "bypass";
  strictPostalCodeCheck?: boolean;
  strictAddressCheck?: boolean;
  /** 1 = SIMPLE, 2 = MEDIATION, 3 = GIFTCARD, 4 = MARKETPLACE */
  paymentcardType?: 1 | 2 | 3 | 4;
}

export interface PaymentLink extends PaymentLinkPayload {
  expirationDate: string;
  hasClient: boolean;
  updatedAt: string;
  createdAt: string;
  qrImage: string;
  shortUrl: string;
  paymentUrl: string;
}

export interface MediationPaymentCardConfig {
  amount: number;
  currency: "EUR" | "USD";
  concept: string;
  description: string;
  reference: string;
  singleUse: boolean;
  lang: string;
  productUrl?: string;
  buyer: null | any;
  seller: {
    sellerId?: number;
    type?: number;
    email?: string;
  };
  feePercent?: number;
  feeFixed?: number;
  sendMail: boolean;
}

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  scope: string;
};

export type LoginError = {
  error: string;
};

export type Country = {
  id: number;
  name: string;
  sepaZone: boolean;
  state: number;
  slug: string;
  slugn: number;
  callingCode: number;
  isDestination: boolean;
  isRisky: boolean;
  currentCurrency: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  position: any;
};

/**
 * A Tropipay account (a user can hold several, one per currency).
 * Returned by `tpp.accounts.list()` — use `id` as the `accountId`
 * when creating payment links or transfers.
 */
export type Account = {
  id: number;
  accountNumber: string;
  currency: string;
  balance: number;
  pendingIn?: number;
  pendingOut?: number;
  state: number;
  isDefault?: boolean;
  type?: number;
  createdAt?: string;
  updatedAt?: string;
  /** Payment method slugs enabled for this account. */
  paymentMethods?: any[];
  services?: any[];
  paymentEntity?: any;
  canRefund?: boolean;
};

/**
 * Payload for an external payout (transfer to a beneficiary).
 * Used by `tpp.transfers.payout()` and `tpp.transfers.simulate()`.
 */
export interface PayoutPayload {
  /** Amount in cents to be debited. */
  amount: number;
  currency: string;
  /** Amount in cents the beneficiary receives (alternative to amount). */
  destinationAmount?: number;
  destinationCurrency: string;
  /** Beneficiary (deposit account) id. */
  depositaccountId: number;
  reasonId: number;
  /** Free-text reason. Required when reasonId is OTHER (9). */
  reasonDes?: string;
  /** Concept shown to the beneficiary (max 254 chars). */
  conceptTransfer?: string;
  /** 2FA delivery type used to validate the securityCode. */
  twoFaType?: number;
  /** 2FA code obtained via transfers.requestSecurityCode(). */
  securityCode?: string;
  /** Source account id (multi-account). Defaults to the default account. */
  accountId?: number;
}

/**
 * Payload for `tpp.transfers.simulate()`. Note the shape differs from
 * the payout payload: the simulation endpoint uses currencyToPay /
 * currencyToGet and amountToPay / amountToGet, and requires accountId.
 */
export interface PayoutSimulatePayload {
  /** Source account id (required). Get it from `accounts.list()`. */
  accountId: number;
  currencyToPay: "USD" | "EUR" | "USDC" | "USDT";
  currencyToGet?: "USD" | "EUR" | "USDC" | "USDT";
  /** Amount in cents to be debited (provide this or amountToGet). */
  amountToPay?: number;
  /** Amount in cents the beneficiary receives (provide this or amountToPay). */
  amountToGet?: number;
  /** Beneficiary (deposit account) id. */
  depositaccountId?: number;
  paymentMethod?: string;
  serviceSlug?: string;
  destinationAccount?: number;
}

export type Deposit = {
  id: number;
  accountNumber: string;
  alias: string;
  swift: string;
  type: number;
  country: number | null;
  firstName: string;
  default: null;
  state: number;
  userId: string;
  countryDestinationId: number;
  lastName: string;
  documentNumber: number;
  userRelationTypeId: number;
  city: string;
  postalCode: string;
  address: string;
  phone: string;
  checked: boolean;
  province: string;
  beneficiaryType: number;
  relatedUserId: null | string;
  currency: string;
  correspondent?: any;
  location: any;
  office: any;
  officeValue: any;
  paymentType: number;
  paymentEntityBeneficiaryId: number;
  paymentEntityAccountId: number;
  verified: any;
  paymentEntityInfo: any;
  documentTypeId: any;
  documentExpirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  countryDestination: Country;
};

export type AccountDeposits = {
  count: number;
  rows: Deposit[];
};

export type RefundResponse = {
  id: number;
  orderCode: string;
  amount: number;
  currency: string;
  state: string;
  type: string;
  createdAt: string;
  completedAt: string;
};
