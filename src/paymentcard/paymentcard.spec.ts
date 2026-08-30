import axios from "axios";
import { Tropipay } from "../api/TropipayAPI";
import { PaymentLinkPayload, PaymentMethod } from "../interfaces";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PaymentCard", () => {
  let requestMock: {
    post: jest.Mock;
    get: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
    interceptors: { request: { use: jest.Mock } };
  };

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
    paymentMethods: ["EXT", "TPP", "CRYPTO"],
    accountId: 12345,
    lang: "es",
  };

  beforeEach(() => {
    requestMock = {
      post: jest.fn().mockResolvedValue({ data: {} }),
      get: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
      interceptors: { request: { use: jest.fn() } },
    };
    mockedAxios.create.mockReturnValue(requestMock as any);
    // skip login()
    Tropipay.accessToken = "fake-token";
    Tropipay.refreshToken = null;
    Tropipay.expiresIn = null;
  });

  it("creates a payment link against the v3 endpoint with accountId and CRYPTO", async () => {
    const expectedPaymentLink = {
      id: "1f8b0600-0b62-11ef-b879-9d16dab40e58",
      shortUrl: "https://tppay.me/lvugy80i",
    };
    requestMock.post.mockResolvedValue({ data: expectedPaymentLink });

    const tropipay = new Tropipay({
      clientId: "clientId",
      clientSecret: "clientSecret",
    });

    const result = await tropipay.paymentCards.create(payload);

    expect(requestMock.post).toHaveBeenCalledWith(
      "/api/v3/paymentcards",
      expect.objectContaining({
        accountId: 12345,
        paymentMethods: ["EXT", "TPP", "CRYPTO"],
      }),
      expect.anything()
    );
    expect(result).toEqual(expectedPaymentLink);
  });

  it("uses the v3 endpoint for list, get, update and delete", async () => {
    const tropipay = new Tropipay({
      clientId: "clientId",
      clientSecret: "clientSecret",
    });

    await tropipay.paymentCards.list();
    expect(requestMock.get).toHaveBeenCalledWith(
      "/api/v3/paymentcards",
      expect.anything()
    );

    await tropipay.paymentCards.get("some-id");
    expect(requestMock.get).toHaveBeenCalledWith(
      "/api/v3/paymentcards/some-id",
      expect.anything()
    );

    await tropipay.paymentCards.update({ cardId: "some-id", favorite: true });
    expect(requestMock.put).toHaveBeenCalledWith(
      "/api/v3/paymentcards/",
      expect.objectContaining({ cardId: "some-id", favorite: true }),
      expect.anything()
    );

    await tropipay.paymentCards.delete("some-id");
    expect(requestMock.delete).toHaveBeenCalledWith(
      "/api/v3/paymentcards/",
      expect.objectContaining({ data: { cardId: "some-id" } })
    );
  });

  it("accepts every documented payment method in the type", () => {
    const methods: PaymentMethod[] = [
      "TPP",
      "EXT",
      "CRYPTO",
      "WIRE_TRANSFER",
      "APPLE_PAY",
      "GOOGLE_PAY",
      "TPP_GIFTCARD",
      "TROPICARD",
    ];
    // @ts-expect-error - unknown payment methods must not compile
    const invalid: PaymentMethod[] = ["BITCOIN"];
    expect(methods).toHaveLength(8);
    expect(invalid).toBeDefined();
  });
});
