export interface DepositAccountConfig {
    searchValue?: string;
    alias: string;
    userRelationTypeId: number;
    beneficiaryType: BeneficiaryType;
    searchBy?: number;
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
}
type INTERNAL = 1;
type EXTERNAL = 2;
export type BeneficiaryType = INTERNAL | EXTERNAL;
export declare const DepositAccountTypesList: {
    /**
     * Banco Metropolitano (Cuba) Bank Account
     */
    readonly BANMET_BANK_ACCOUNT: 0;
    /**
     * Banco Popular de Ahorro
     */
    readonly BPA_BANK_ACCOUNT: 1;
    /**
     * Banco de Credito y Comercio (Cuba) Bank Account
     */
    readonly BANDEC_BANK_ACCOUNT: 2;
    /**
     * Banco Metropilitano (Cuba) card
     */
    readonly BANMET_CARD: 3;
    /**
     * Banco Popular de Ahorro (Cuba) card
     */
    readonly BPA_CARD: 4;
    /**
     * Not available anymore
     * @deprecated
     */
    readonly AIS_CUC_CARD: 5;
    /**
     * Not available
     * @deprecated
     */
    readonly AIS_USD_CARD: 6;
    /**
     * For international bank accounts
     */
    readonly OTHER: 7;
    /**
     * Banco de Credito y comercio card
     */
    readonly BANDEC_CARD: 8;
};
export type DepositAccountType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 | 11;
export {};
