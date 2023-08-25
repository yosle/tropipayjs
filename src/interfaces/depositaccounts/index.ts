export interface DepositAccountConfig {
  searchValue?: string;
  alias: string;
  userRelationTypeId: number;
  beneficiaryType: BeneficiaryType;
  searchBy?: number;
  accountNumber?: string;
  swift?: string;
  type?: number;
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
