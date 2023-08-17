import { HookEventType, UserHookSubscribed } from "../interfaces";
import { Tropipay } from "../api/TropipayAPI";
export declare class TropipayHooks {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
    static subscribeHook(eventType: HookEventType, target: string, value: string): Promise<void>;
    /**
     * Get the sucbcribed hook info by his event type.
     * If no event type is passed, it will return
     * all subscribed hooks or empty Array if none exist.
     * @param eventType or no params for retrieving all hooks
     * @returns All subscribed hooks or empty Array if none exist.
     */
    getSubscribedHook(eventType?: HookEventType): Promise<UserHookSubscribed[]>;
    updateSubscribedHook(eventType?: string): Promise<void>;
    deleteSubscribedHook(eventType?: string): Promise<void>;
}
