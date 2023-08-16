type PaymentMethodElement = "EXT" | "TPP";
export type PaymentMethods =
  | Element
  | [PaymentMethodElement, PaymentMethodElement];

enum Reasons {
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

export interface PaymentLinkPayload {
  reference: string;
  concept: string;
  favorite: boolean;
  amount: number;
  currency: string;
  description: string;
  singleUse: boolean;
  reasonId: Reasons;
  expirationDays: number;
  lang: string;
  urlSuccess: string;
  urlFailed: string;
  urlNotification: string;
  serviceDate: string;
  /**
   * fgfsgdfgdfgd
   */
  client?: {
    name: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    countryId: number;
    termsAndConditions: boolean;
  } | null;
  directPayment?: boolean;
  paymentMethods?: PaymentMethods;
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
