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
const _1 = __importDefault(require("."));
const tpp = new _1.default('5aca1638f7596bee9cb388e51d2ad58e', '4a0150d3cec2036b9f24ec53f52e7c19');
const payload = {
    reference: "platano",
    concept: "Bicycle",
    favorite: true,
    description: "Platano burro",
    amount: 234,
    currency: "EUR",
    singleUse: true,
    reasonId: 4,
    expirationDays: 1,
    lang: "es",
    urlSuccess: "https://my-business.com/payment-ok",
    urlFailed: "https://my-business.com/payment-ko",
    urlNotification: "https://my-business.com/payment-callback",
    serviceDate: "2021-08-20",
    client: {
        name: "John",
        lastName: "McClane",
        address: "Ave. Guadí 232, Barcelona, Barcelona",
        phone: "+34645553333",
        email: "client@email.com",
        countryId: 1,
        termsAndConditions: true
    },
    directPayment: true,
};
const est = () => __awaiter(void 0, void 0, void 0, function* () {
    //  //await tpp.login()
    //  const paylink = await tpp.createPayLink(payload)
    try {
        const rates = yield tpp.createPayLink(payload);
        tpp.countries;
        console.log(rates);
    }
    catch (error) {
        if (error instanceof Error)
            console.error(error.message);
    }
});
est();
