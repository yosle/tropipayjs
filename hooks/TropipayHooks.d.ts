import { HookEventType, UserHookSubscribed } from "../interfaces";
import { Tropipay } from "../api/TropipayAPI";
export default class TropipayHooks {
    private tropipay;
    constructor(tropipayInstance: Tropipay);
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
    subscribe({ eventType, target, value, }: {
        eventType: HookEventType;
        target: "email" | "web";
        value: string;
    }): Promise<any>;
    /**
     * Get the subscribed hook info by his event type.
     * If no event type is passed, it will return
     * all subscribed hooks or empty Array if none exist.
     * @param eventType or no params for retrieving all hooks
     * @returns All subscribed hooks or empty Array if none exist.
     */
    list(eventType?: HookEventType): Promise<UserHookSubscribed[]>;
    update(eventType: string, target: "web" | "email", value: string): Promise<any>;
    delete(eventType: HookEventType, target: string): Promise<any>;
    events(): Promise<any>;
}
