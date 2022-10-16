type LoginResponse = {
    access_token: string,
    refresh_token: string
    token_type: "Bearer",
    expires_in: number,
    scope: string
}

type LoginError = {
    error: string
}

type Country = {
        id: number,
        name: string,
        sepaZone: boolean,
        state: number,
        slug: string,
        slugn: number,
        callingCode: number,
        isDestination: boolean,
        isRisky: boolean,
        currentCurrency: string | null,
        createdAt: string,
        updatedAt: string,
        isFavorite: boolean,
        position: any

}

type Deposit = {
    id: number,
    accountNumber: string,
    alias: string,
    swift: string,
    type: number,
    country: number | null,
    firstName: string,
    default: null,
    state: number,
    userId: string,
    countryDestinationId: number,
    lastName: string,
    documentNumber: number,
    userRelationTypeId: number,
    city: string,
    postalCode: string,
    address: string,
    phone: string,
    checked: boolean,
    province: string,
    beneficiaryType: number,
    relatedUserId: null | string,
    currency: string,
    correspondent?: any,
    location: any,
    office: any,
    officeValue: any,
    paymentType: number,
    paymentEntityBeneficiaryId: number,
    paymentEntityAccountId: number,
    verified: any,
    paymentEntityInfo: any,
    documentTypeId: any,
    documentExpirationDate: Date,
    createdAt: Date<string>,
    updatedAt: Date<string>,
    countryDestination: Country
}

type AccountDeposits = {
   count: number,
   rows:  Deposit[]
}