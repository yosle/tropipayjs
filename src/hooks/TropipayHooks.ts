import { HookEventType, UserHookSubscribed } from "../interfaces";
import { Tropipay } from "../api/TropipayAPI";
export class TropipayHooks {
  private tropipay: Tropipay;
  // ... hook-related functionality ...
  constructor(tropipayInstance: Tropipay) {
    this.tropipay = tropipayInstance;
  }
  /**
   * Subscribe a new hook
   * @param event String that represents the name of the event,
   * you must select from the list of available events, otherwise
   * it will not produce an error but it will not be executed.
   * For get full list of available events see endpoint
   * GET /api/v2/hook/events.
   * @param target String representing the type of event supported.
   * It is currently available: 'web' (allows to receive information in a url),
   * 'email' (allows to receive information in an email address).
   * @param value if the selected 'target' is email the value would be an
   *  email address, likewise if the selected 'target' is 'web' the expected
   *  value corresponds to a url that receives information through the
   * HTTP POST method.
   * @returns
   */
  public async subscribe({
    eventType,
    target,
    value,
  }: {
    eventType: HookEventType;
    target: "email" | "web";
    value: string;
  }) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const hooks = await this.tropipay.request.post(
        `/api/v2/hooks`,
        {
          event: eventType,
          target: target,
          value: value,
        },
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
      throw new Error(`Could not get subscribe new hook`);
    }
  }
  /**
   * Get the sucbcribed hook info by his event type.
   * If no event type is passed, it will return
   * all subscribed hooks or empty Array if none exist.
   * @param eventType or no params for retrieving all hooks
   * @returns All subscribed hooks or empty Array if none exist.
   */
  public async list(eventType?: HookEventType): Promise<UserHookSubscribed[]> {
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
      throw new Error(`Could not get subscribed hooks`);
    }
  }
  public async update(
    eventType: string,
    target: "web" | "email",
    value: string
  ) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const hooks = await this.tropipay.request.put(
        `/api/v2/hooks`,
        {
          event: eventType,
          target: target,
          value: value,
        },
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
      throw new Error(`Could not update subscribed hooks`);
    }
  }
  async delete(eventType: HookEventType, target: string) {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const hooks = await this.tropipay.request.delete(
        `/api/v2/hooks/${eventType}/${target}`,
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
      console.trace(error);
      throw new Error(`Could not delete subscribed hooks`);
    }
  }

  async events() {
    if (!Tropipay.accessToken) {
      await this.tropipay.login();
    }
    try {
      const hooks = await this.tropipay.request.get(`/api/v2/hooks/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Tropipay.accessToken}`,
          Accept: "application/json",
        },
      });
      return hooks.data;
    } catch (error) {
      throw new Error(`Could not get events list for hooks ${error}`);
    }
  }
}
