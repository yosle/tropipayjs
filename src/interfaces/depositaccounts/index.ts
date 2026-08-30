export interface DepositAccountConfig {
  id?: number;
  searchValue?: string;
  alias: string;
  userRelationTypeId: number;
  beneficiaryType: BeneficiaryType;
  searchBy?: number;
  /** Bank account number, card number or crypto wallet address (beneficiaryType 3). */
  accountNumber?: string;
  swift?: string;
  type: DepositAccountType;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  countryDestinationId?: number;
  city?: string;
  postalCode?: number;
  address?: string;
  documentNumber?: string;
  phone?: string;
  province?: string;
  paymentType?: string;
  documentTypeId?: number;
  documentExpirationDate: string;
  /**
   * Blockchain network of the wallet. Required when beneficiaryType is
   * CRYPTO (3). The API matches it case-insensitively against its
   * supported network list.
   */
  network?: CryptoNetwork;
  currency?: string;
}
type INTERNAL = 1;
type EXTERNAL = 2;
type CRYPTO = 3;

/**
 * 1 = INTERNAL (another Tropipay user), 2 = EXTERNAL (bank account/card),
 * 3 = CRYPTO (crypto wallet).
 */
export type BeneficiaryType = INTERNAL | EXTERNAL | CRYPTO;

/**
 * Crypto networks supported for wallet beneficiaries.
 */
export type CryptoNetwork =
  | "SOLANA"
  | "ETHEREUM"
  | "POLYGON"
  | "BSC"
  | "BINANCE_SMART_CHAIN"
  | "BEP20"
  | "BINANCE_CHAIN"
  | "BEP2"
  | "ARBITRUM"
  | "OPTIMISM"
  | "AVALANCHE"
  | "BASE"
  | "TRON"
  | "BITCOIN"
  | "BTC"
  | "ETH";

export const DepositAccountTypesList = {
  /**
   * Banco Metropolitano (Cuba) Bank Account
   */
  BANMET_BANK_ACCOUNT: 0,
  /**
   * Banco Popular de Ahorro
   */
  BPA_BANK_ACCOUNT: 1,
  /**
   * Banco de Credito y Comercio (Cuba) Bank Account
   */
  BANDEC_BANK_ACCOUNT: 2,
  /**
   * Banco Metropilitano (Cuba) card
   */
  BANMET_CARD: 3,
  /**
   * Banco Popular de Ahorro (Cuba) card
   */
  BPA_CARD: 4,
  /**
   * Not available anymore
   * @deprecated
   */
  AIS_CUC_CARD: 5,
  /**
   * Not available
   * @deprecated
   */
  AIS_USD_CARD: 6,
  /**
   * For international bank accounts
   */
  OTHER: 7,
  /**
   * Banco de Credito y comercio card
   */
  BANDEC_CARD: 8,
} as const;

export type DepositAccountType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 | 11;
