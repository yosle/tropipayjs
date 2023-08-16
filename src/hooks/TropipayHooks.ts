import { HookEventType, UserHookSubscribed } from "../interfaces";
import { Tropipay } from "../api/TropipayAPI";
export class TropipayHooks {
  private tropipay: Tropipay;
  // ... hook-related functionality ...
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }

  public static async subscribeHook(
    eventType: HookEventType,
    target: string,
    value: string
  ) {}
  /**
   * Get hook the sucbcribed hook info by his eventType.
   * If no eventType is passed it will return
   * all subscribed hooks or empty Array if none hooks exist.
   * @param eventType or no params for retrieving all hooks
   * @returns
   */
  public async getSubscribedHook(
    eventType?: HookEventType
  ): Promise<UserHookSubscribed[]> {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const hooks = await this.tropipay.request.get(
        `/api/v2/hooks/${eventType || ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Tropipay.accessToken}`,
            Accept: "application/json",
          },
        }
      );
      return hooks.data;
    } catch (error) {
      throw new Error(`Could not get subscribed hooks ${error}`);
    }
  }
  public async updateSubscribedHook(eventType?: string) {
    //TODO
    throw new Error("Not implementet yet");
  }
  async deleteSubscribedHook(eventType?: string) {
    //TODO
    throw new Error("Not implementet yet");
  }
}
