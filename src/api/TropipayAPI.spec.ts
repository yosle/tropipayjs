import axios from "axios";
import { Tropipay } from "./TropipayAPI";
import { handleExceptions, TropipayJSException } from "../utils/errors";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

type RequestMock = {
  post: jest.Mock;
  get: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
  interceptors: { request: { use: jest.Mock } };
};

const TOKEN_URL = "/api/v3/access/token";
const now = () => Math.floor(Date.now() / 1000);

function loginResponse(token: string, refresh: string, expiresIn: number) {
  return {
    data: {
      access_token: token,
      refresh_token: refresh,
      token_type: "Bearer",
      expires_in: expiresIn,
      scope: "",
    },
  };
}

describe("Tropipay", () => {
  let requestMock: RequestMock;

  beforeEach(() => {
    requestMock = {
      post: jest.fn().mockResolvedValue({ data: {} }),
      get: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
      interceptors: { request: { use: jest.fn() } },
    };
    mockedAxios.create.mockReturnValue(requestMock as any);
  });

  const create = (clientId = "clientId") =>
    new Tropipay({ clientId, clientSecret: "clientSecret" });

  // the interceptor registered by the instance created last
  const interceptor = () =>
    requestMock.interceptors.request.use.mock.calls.at(-1)![0] as (
      config: any
    ) => Promise<any>;

  describe("request interceptor", () => {
    it("lets the token request through without logging in again", async () => {
      create();
      const config = { url: TOKEN_URL, headers: {} };

      await expect(interceptor()(config)).resolves.toBe(config);
      expect(requestMock.post).not.toHaveBeenCalled();
    });

    it("logs in when there is no token and attaches it", async () => {
      const tpp = create();
      requestMock.post.mockResolvedValueOnce(
        loginResponse("token-1", "refresh-1", now() + 3600)
      );

      const config = await interceptor()({ url: "/api/v3/accounts", headers: {} });

      expect(requestMock.post).toHaveBeenCalledTimes(1);
      expect(requestMock.post).toHaveBeenCalledWith(
        TOKEN_URL,
        expect.objectContaining({ grant_type: "client_credentials" })
      );
      expect(tpp.accessToken).toBe("token-1");
      expect(config.headers.Authorization).toBe("Bearer token-1");
    });

    it("refreshes an expired token once and sends the new one", async () => {
      const tpp = create();
      tpp.accessToken = "old-token";
      tpp.refreshToken = "refresh-1";
      tpp.expiresIn = now() - 10;
      requestMock.post.mockResolvedValueOnce(
        loginResponse("new-token", "refresh-2", now() + 3600)
      );

      const config = await interceptor()({
        url: "/api/v3/user/hooks/",
        headers: { Authorization: "Bearer old-token" },
      });

      expect(requestMock.post).toHaveBeenCalledTimes(1);
      expect(requestMock.post).toHaveBeenCalledWith(
        TOKEN_URL,
        expect.objectContaining({
          grant_type: "refresh_token",
          refresh_token: "refresh-1",
        })
      );
      expect(tpp.refreshToken).toBe("refresh-2");
      expect(config.headers.Authorization).toBe("Bearer new-token");
    });

    it("propagates a failed login with its original status", async () => {
      create();
      const loginError = new TropipayJSException("invalid_grant", 401, null);
      requestMock.post.mockRejectedValueOnce(loginError);

      await expect(
        interceptor()({ url: "/api/v3/accounts", headers: {} })
      ).rejects.toMatchObject({ code: 401, message: "invalid_grant" });
    });
  });

  it("keeps tokens per instance", async () => {
    const a = create("client-a");
    const b = create("client-b");
    requestMock.post.mockResolvedValueOnce(
      loginResponse("token-a", "refresh-a", now() + 3600)
    );

    await a.login();

    expect(a.accessToken).toBe("token-a");
    expect(b.accessToken).toBeNull();
  });

  it("returns rates as a number", async () => {
    const tpp = create();
    requestMock.post.mockResolvedValueOnce({ data: { rate: "0.92" } });

    await expect(tpp.rates("USD", "EUR")).resolves.toBe(0.92);
  });

  describe("accounts", () => {
    it("returns the rows of a paginated list", async () => {
      const tpp = create();
      const rows = [{ id: 1, currency: "EUR" }];
      requestMock.get.mockResolvedValueOnce({ data: { count: 1, rows } });

      await expect(tpp.accounts.list()).resolves.toEqual(rows);
      expect(requestMock.get).toHaveBeenCalledWith("/api/v3/accounts", {
        params: undefined,
      });
    });

    it("returns a plain array list as is", async () => {
      const tpp = create();
      const rows = [{ id: 1, currency: "EUR" }];
      requestMock.get.mockResolvedValueOnce({ data: rows });

      await expect(tpp.accounts.list()).resolves.toEqual(rows);
    });

    it("uses the v3 endpoint for account movements", async () => {
      const tpp = create();

      await tpp.accounts.movements(7, { limit: 5 });

      expect(requestMock.get).toHaveBeenCalledWith(
        "/api/v3/accounts/7/movements",
        { params: { limit: 5, offset: 0 } }
      );
    });
  });

  describe("transfers", () => {
    it("uses the v3 booking endpoints", async () => {
      const tpp = create();
      const payout = {
        amount: 1000,
        currency: "EUR",
        destinationCurrency: "EUR",
        depositaccountId: 3,
        reasonId: 4,
        securityCode: "123456",
      };

      await tpp.transfers.simulate({ accountId: 1, currencyToPay: "EUR" });
      await tpp.transfers.payout(payout);
      await tpp.transfers.requestSecurityCode();

      expect(requestMock.post).toHaveBeenCalledWith(
        "/api/v3/booking/payout/simulate",
        { accountId: 1, currencyToPay: "EUR" }
      );
      expect(requestMock.post).toHaveBeenCalledWith(
        "/api/v3/booking/payout",
        payout
      );
      expect(requestMock.post).toHaveBeenCalledWith(
        "/api/v3/booking/sendSecurityCode",
        {}
      );
    });
  });

  describe("depositAccounts", () => {
    it("sends the beneficiary data as the update body", async () => {
      const tpp = create();

      await tpp.depositAccounts.update({ id: 3, alias: "new alias" });

      expect(requestMock.put).toHaveBeenCalledWith("/api/v3/deposit_accounts", {
        id: 3,
        alias: "new alias",
      });
    });

    it("validates an account number against the v3 endpoint", async () => {
      const tpp = create();
      const payload = { accountNumber: "abc", network: "TRON" };

      await tpp.depositAccounts.validateAccountNumber(payload);

      expect(requestMock.post).toHaveBeenCalledWith(
        "/api/v3/deposit_accounts/validate_account_number",
        payload
      );
    });
  });
});

describe("handleExceptions", () => {
  it("returns an existing TropipayJSException unchanged", () => {
    const error = new TropipayJSException("invalid_grant", 401, { a: 1 });

    expect(handleExceptions(error)).toBe(error);
  });
});
