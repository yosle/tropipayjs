import { HookEventType, UserHookSubscribed } from "../interfaces";
import { Tropipay } from "../api/TropipayAPI";
export declare class TropipayHooks {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    static subscribeHook(eventType: HookEventType, target: string, value: string): Promise<void>;
    /**
     * Get hook the sucbcribed hook info by his eventType.
     * If no eventType is passed it will return
     * all subscribed hooks or empty Array if none hooks exist.
     * @param eventType or no params for retrieving all hooks
     * @returns
     */
    getSubscribedHook(eventType?: HookEventType): Promise<UserHookSubscribed[]>;
    updateSubscribedHook(eventType?: string): Promise<void>;
    deleteSubscribedHook(eventType?: string): Promise<void>;
}
