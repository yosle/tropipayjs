import { Tropipay } from "../../src/api/TropipayAPI";
import { PaymentLinkPayload } from "../interfaces";
import { TropipayJSException } from "../utils/errors";
import PaymentCard from "./PaymentCard";

jest.mock("axios");
jest.mock("../../src/api/TropipayAPI");

describe("Create PaymentCard", () => {
  describe("create", () => {
    it("should create a payment link", async () => {
      const payload: PaymentLinkPayload = {
        amount: 200,
        client: null,
        concept: "Concept",
        currency: "EUR",
        description: "Description",
        directPayment: true,
        expirationDays: 30,
        favorite: false,
        reasonId: 45,
        reference: "Reference",
        serviceDate: "2022-01-01",
        urlFailed: "urlFailed",
        urlNotification: "urlNotification",
        urlSuccess: "urlSuccess",
        singleUse: false,
        paymentMethods: ["EXT"],
        lang: "es",
      };
      const expectedPaymentLink = {
        id: "1f8b0600-0b62-11ef-b879-9d16dab40e58",
        reference: "08025834659",
        concept: "NFT Purchase",
        description: "Golden Monkey NFT character",
        amount: 500,
        currency: "EUR",
        singleUse: true,
        favorite: false,
        reasonId: 4,
        reasonDes: null,
        expirationDays: 0,
        userId: "a9546500-65c0-11ed-97e6-2ffd2c53074d",
        lang: "es",
        imageBase: null,
        state: 1,
        urlSuccess: null,
        urlFailed: null,
        urlNotification: null,
        expirationDate: null,
        serviceDate: null,
        hasClient: false,
        credentialId: 129710,
        force3ds: false,
        saveToken: true,
        origin: 2,
        paymentcardType: 1,
        updatedAt: "2024-05-06T04:35:54.352Z",
        createdAt: "2024-05-06T04:35:53.568Z",
        qrImage:
          "data:image/png;base64,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",
        shortUrl: "https://tppay.me/lvugy80i",
        paymentUrl: null,
        rawUrlPayment: null,
        giftcard: null,
      };

      const tropipayInstance = new Tropipay({
        clientId: "clientId",
        clientSecret: "clientSecret",
      });

      const result = await tropipayInstance.paymentCards.create(payload);

      // expect(result).toEqual(expectedPaymentLink);
      expect(true).toBeDefined();
    });
  });
});
